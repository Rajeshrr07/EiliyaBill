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

/* --------------------------------
   CHILD COMPONENT (row editor)
----------------------------------*/
function GroceryRow({ item, updateItem, deleteItem, loadItems }) {
  const [editing, setEditing] = useState(false);
  const [editName, setEditName] = useState(item.product_name);
  const [editPrice, setEditPrice] = useState(item.price);

  return (
    <div
      key={item.id}
      className="flex flex-col gap-2 px-4 py-3 md:flex-row md:items-center justify-center"
    >
      <div className="flex-1 flex flex-col gap-2 md:flex-row md:items-center md:gap-3">
        <Input
          value={editName}
          disabled={!editing}
          onChange={(e) => setEditName(e.target.value)}
          className="h-9 rounded-lg disabled:opacity-60"
        />

        <Input
          type="number"
          value={editPrice}
          disabled={!editing}
          onChange={(e) => setEditPrice(e.target.value)}
          className="h-9 rounded-lg md:max-w-[120px] disabled:opacity-60"
        />
        <span className="text-[10px] md:text-xs text-muted-foreground">
          {item.added_date
            ? new Date(item.added_date).toLocaleDateString()
            : new Date(item.created_at).toLocaleDateString()}
        </span>
      </div>

      <div className="flex items-center gap-2 w-1/3  justify-end mx-2">
        <div className="flex items-center gap-2">
          {!editing ? (
            <Button
              variant="ghost"
              onClick={() => setEditing(true)}
              className="cursor-pointer"
            >
              Edit
            </Button>
          ) : (
            <Button
              className="cursor-pointer"
              onClick={async () => {
                await updateItem(item.id, editName, editPrice);
                setEditing(false);
              }}
            >
              Save
            </Button>
          )}

          <Button
            variant="ghost"
            onClick={() => {
              deleteItem(item.id);
              loadItems();
            }}
            className="px-2 cursor-pointer text-red-500 hover:text-red"
          >
            Delete
          </Button>
        </div>
      </div>
    </div>
  );
}

/* --------------------------------
          MAIN COMPONENT
----------------------------------*/
export default function GroceriesTab({ userId }) {
  const [fields, setFields] = useState([{ productName: "", price: "" }]);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);

  // Selected month in YYYY-MM format
  const [selectedMonth, setSelectedMonth] = useState(() => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
  });

  const selectedMonthLabel = useMemo(() => {
    const [y, m] = selectedMonth.split("-");
    const d = new Date(Number(y), Number(m) - 1, 1);
    return d.toLocaleDateString("en-IN", { month: "long", year: "numeric" });
  }, [selectedMonth]);

  /* --------------------------------
      LOAD ITEMS
  ----------------------------------*/
  async function loadItems() {
    try {
      setLoading(true);
      const res = await fetch(`/api/groceries?userId=${userId}`);
      const data = await res.json();
      if (data.success) setItems(data.data || []);
      else toast.error(data.error || "Failed to load groceries");
    } catch (err) {
      toast.error("Failed to load groceries");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (userId) loadItems();
  }, [userId]);

  /* --------------------------------
      ADD MULTIPLE PRODUCTS
  ----------------------------------*/
  async function saveProducts() {
    try {
      const valid = fields.filter((f) => f.productName && f.price);
      if (!valid.length) return toast.error("Add at least one product");

      await Promise.all(
        valid.map((f) =>
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

      toast.success("Saved");
      setFields([{ productName: "", price: "" }]);
      loadItems();
    } catch {
      toast.error("Failed to save");
    }
  }

  /* --------------------------------
      UPDATE
  ----------------------------------*/
  async function updateItem(id, productName, price) {
    try {
      await fetch("/api/groceries/update", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, productName, price: Number(price) }),
      });
      toast.success("Updated");
      loadItems();
    } catch {
      toast.error("Failed to update");
    }
  }

  /* --------------------------------
      DELETE
  ----------------------------------*/
  async function deleteItem(id) {
    try {
      await fetch("/api/groceries/delete", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      toast.success("Deleted");
      loadItems();
    } catch {
      toast.error("Failed to delete");
    }
  }

  /* --------------------------------
      MONTH FILTER + CHART DATA
  ----------------------------------*/
  const { filteredItems, chartData, totalInMonth } = useMemo(() => {
    if (!items.length || !selectedMonth)
      return { filteredItems: [], chartData: [], totalInMonth: 0 };

    const [year, month] = selectedMonth.split("-").map(Number);

    const sameMonthItems = items.filter((i) => {
      const d = new Date(i.added_date || i.created_at);
      return d.getFullYear() === year && d.getMonth() + 1 === month;
    });

    const map = new Map();
    for (const item of sameMonthItems) {
      const d = new Date(item.added_date || item.created_at);
      const key = d.toISOString().split("T")[0];
      map.set(key, (map.get(key) || 0) + Number(item.price));
    }

    const lastDay = new Date(year, month, 0).getDate();
    const days = Array.from({ length: lastDay }, (_, i) => {
      const date = new Date(year, month - 1, i + 1);
      const key = date.toISOString().split("T")[0];
      return {
        date: `${i + 1}/${month}`,
        total: map.get(key) || 0,
      };
    });

    const sum = days.reduce((a, b) => a + b.total, 0);

    return {
      filteredItems: sameMonthItems,
      chartData: days,
      totalInMonth: sum,
    };
  }, [items, selectedMonth]);

  /* --------------------------------
             UI
  ----------------------------------*/
  return (
    <div className="space-y-6">
      {/* TOP SECTION */}
      <div className="grid gap-6 lg:grid-cols-[1.2fr_1fr]">
        {/* ADD PRODUCTS */}
        <Card>
          <CardHeader>
            <CardTitle>Add Groceries</CardTitle>
            <CardDescription>Add multiple groceries quickly</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {fields.map((field, idx) => (
              <div key={idx} className="flex gap-2">
                <Input
                  placeholder="Product name"
                  value={field.productName}
                  onChange={(e) => {
                    const copy = [...fields];
                    copy[idx].productName = e.target.value;
                    setFields(copy);
                  }}
                />
                <Input
                  type="number"
                  placeholder="Price"
                  value={field.price}
                  onChange={(e) => {
                    const copy = [...fields];
                    copy[idx].price = e.target.value;
                    setFields(copy);
                  }}
                />
              </div>
            ))}

            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() =>
                  setFields((p) => [...p, { productName: "", price: "" }])
                }
              >
                + Add More
              </Button>
              <Button onClick={saveProducts}>Save</Button>
            </div>
          </CardContent>
        </Card>

        {/* MONTH SUMMARY */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>{selectedMonthLabel}</CardTitle>
              <Badge>{filteredItems.length} items</Badge>
            </div>

            <Input
              type="month"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="w-[150px] mt-2"
            />
          </CardHeader>

          <CardContent>
            <div className="text-2xl font-bold mb-2">
              ₹{totalInMonth.toFixed(2)}
            </div>

            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" fontSize={10} />
                  <YAxis fontSize={10} />
                  <Tooltip />
                  <Area
                    dataKey="total"
                    stroke="#22c55e"
                    fill="#bbf7d0"
                    strokeWidth={2}
                    type="monotone"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* GROCERY LIST */}
      <Card>
        <CardHeader>
          <CardTitle>All Groceries</CardTitle>
          <CardDescription>Editable & deletable entries</CardDescription>
        </CardHeader>

        <CardContent className="p-0">
          <ScrollArea className="h-80">
            <div className="divide-y">
              {filteredItems.length === 0 && (
                <div className="py-10 text-center text-sm text-muted-foreground">
                  No groceries for this month
                </div>
              )}

              {filteredItems.map((item) => (
                <GroceryRow
                  key={item.id}
                  item={item}
                  updateItem={updateItem}
                  deleteItem={deleteItem}
                  loadItems={loadItems}
                />
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}
