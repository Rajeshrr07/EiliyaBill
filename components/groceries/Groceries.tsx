"use client";

import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

export default function GroceriesTab({ userId }) {
  const [fields, setFields] = useState([{ productName: "", price: "" }]);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);

  function addField() {
    setFields((prev) => [...prev, { productName: "", price: "" }]);
  }

  async function loadItems() {
    try {
      setLoading(true);
      const res = await fetch(`/api/groceries?userId=${userId}`);
      const data = await res.json();
      if (data.success) {
        setItems(data.data || []);
      } else {
        toast.error(data.error || "Failed to load groceries");
      }
    } catch (e) {
      toast.error("Failed to load groceries");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (userId) loadItems();
  }, [userId]);

  async function saveProducts() {
    try {
      const validFields = fields.filter((f) => f.productName && f.price);

      if (!validFields.length) {
        toast.error("Please enter at least one product");
        return;
      }

      await Promise.all(
        validFields.map((f) =>
          fetch("/api/groceries/add", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              userId,
              productName: f.productName,
              price: Number(f.price),
            }),
          })
        )
      );

      toast.success("Groceries saved");
      setFields([{ productName: "", price: "" }]);
      loadItems();
    } catch (e) {
      toast.error("Failed to save groceries");
    }
  }

  async function updateItem(id, productName, price) {
    try {
      await fetch("/api/groceries/update", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, productName, price: Number(price) }),
      });
      toast.success("Updated");
      loadItems();
    } catch (e) {
      toast.error("Failed to update");
    }
  }

  // ------------------------------
  //  📊 Last 30 days chart + stats
  // ------------------------------
  const { chartData, total30Days } = useMemo(() => {
    if (!items?.length) return { chartData: [], total30Days: 0 };

    const today = new Date();
    const dateKey = (d) => new Date(d).toISOString().split("T")[0];

    // Build map date -> total
    const map = new Map();

    for (const item of items) {
      const srcDate = item.added_date || item.created_at;
      if (!srcDate) continue;

      const d = new Date(srcDate);
      const diffDays = (today - d) / (1000 * 60 * 60 * 24);
      if (diffDays < 0 || diffDays > 30) continue; // only last 30 days

      const key = dateKey(d);
      const prev = map.get(key) || 0;
      map.set(key, prev + Number(item.price || 0));
    }

    const arr = [];
    for (let i = 30; i >= 0; i--) {
      const d = new Date();
      d.setDate(today.getDate() - i);
      const key = dateKey(d);
      const total = map.get(key) || 0;
      arr.push({
        date: `${d.getDate()}/${d.getMonth() + 1}`,
        total,
      });
    }

    const sum = arr.reduce((acc, x) => acc + x.total, 0);

    return { chartData: arr, total30Days: sum };
  }, [items]);

  return (
    <div className="space-y-6">
      {/* TOP: Add Groceries + Summary */}
      <div className="grid gap-6 lg:grid-cols-[1.2fr_1fr]">
        {/* LEFT: Add Products */}
        <Card className="border-slate-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-base md:text-lg">
              Add Groceries
            </CardTitle>
            <CardDescription className="text-xs md:text-sm">
              Quickly add items you purchase. We’ll track your spend and show
              you a 30-day graph.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              {fields.map((field, i) => (
                <div key={i} className="flex flex-col gap-2 sm:flex-row">
                  <Input
                    placeholder="Product name"
                    value={field.productName}
                    className="h-10 rounded-lg"
                    onChange={(e) => {
                      const copy = [...fields];
                      copy[i].productName = e.target.value;
                      setFields(copy);
                    }}
                  />
                  <Input
                    placeholder="Price"
                    type="number"
                    className="h-10 rounded-lg sm:max-w-[140px]"
                    value={field.price}
                    onChange={(e) => {
                      const copy = [...fields];
                      copy[i].price = e.target.value;
                      setFields(copy);
                    }}
                  />
                </div>
              ))}
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Button
                variant="outline"
                size="sm"
                type="button"
                onClick={addField}
                className="rounded-full px-4"
              >
                + New product
              </Button>
              <Button
                size="sm"
                type="button"
                onClick={saveProducts}
                className="rounded-full px-6"
              >
                Save
              </Button>
              {loading && (
                <span className="text-xs text-muted-foreground">
                  Loading...
                </span>
              )}
            </div>
          </CardContent>
        </Card>

        {/* RIGHT: 30-Day Summary + Chart */}
        <Card className="border-slate-200">
          <CardHeader className="pb-1">
            <div className="flex items-center justify-between gap-2">
              <CardTitle className="text-base md:text-lg">
                Last 30 days
              </CardTitle>
              <Badge variant="outline" className="text-[10px] md:text-xs">
                {items.length} items
              </Badge>
            </div>
            <CardDescription className="text-xs md:text-sm">
              Total spent in last 30 days
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="text-2xl font-semibold">
              ₹{total30Days.toFixed(2)}
            </div>

            <div className="h-40 md:h-52">
              {chartData.length ? (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" fontSize={10} />
                    <YAxis fontSize={10} />
                    <Tooltip />
                    <Area
                      type="monotone"
                      dataKey="total"
                      stroke="#22c55e"
                      fill="#bbf7d0"
                      strokeWidth={2}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex h-full items-center justify-center text-xs text-muted-foreground">
                  No data yet. Add some groceries to see the graph.
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* BOTTOM: List / Edit Existing Items */}
      <Card className="border-slate-200">
        <CardHeader className="pb-3">
          <CardTitle className="text-base md:text-lg">All groceries</CardTitle>
          <CardDescription className="text-xs md:text-sm">
            Edit name or price. Changes are saved when you leave the field.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <ScrollArea className="h-72 overflow-y-scroll">
            <div className="divide-y">
              {items.length === 0 && (
                <div className="px-4 py-8 text-center text-xs md:text-sm text-muted-foreground">
                  No groceries added yet.
                </div>
              )}

              {items.map((item) => {
                const dateLabel = item.added_date || item.created_at;
                return (
                  <div
                    key={item.id}
                    className="flex flex-col gap-2 px-4 py-3 md:flex-row md:items-center"
                  >
                    <div className="flex-1 flex flex-col gap-2 md:flex-row md:items-center md:gap-3">
                      <Input
                        defaultValue={item.product_name}
                        className="h-9 rounded-lg"
                        onBlur={(e) =>
                          updateItem(item.id, e.target.value, item.price)
                        }
                      />
                      <Input
                        defaultValue={item.price}
                        type="number"
                        className="h-9 rounded-lg md:max-w-[120px]"
                        onBlur={(e) =>
                          updateItem(item.id, item.product_name, e.target.value)
                        }
                      />
                    </div>
                    <div className="flex items-center justify-between md:w-[140px]">
                      <span className="text-[10px] md:text-xs text-muted-foreground">
                        {dateLabel
                          ? new Date(dateLabel).toLocaleDateString()
                          : ""}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}
