"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { RefreshCw, FileDown, Printer } from "lucide-react";
import { exportToCSV } from "@/lib/export-utils";

export default function ReportsPage() {
  const [salesData, setSalesData] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [salesHistory, setSalesHistory] = useState([]);

  const [searchQuery, setSearchQuery] = useState("");

  // Load data from Supabase APIs
  useEffect(() => {
    fetch("/api/orders/daily")
      .then((r) => r.json())
      .then(setSalesData);

    fetch("/api/orders/top-products")
      .then((r) => r.json())
      .then(setTopProducts);

    fetch("/api/orders")
      .then((r) => r.json())
      .then((data) => {
        const mapped = data.map((o: any, i: number) => ({
          id: o.id,
          dateTime: new Date(o.created_at).toLocaleString(),
          receipt: "#ORD-" + o.id.slice(0, 6).toUpperCase(),
          items: o.items_count ?? "—", // optional if you track item count
          total: o.total,
        }));
        setSalesHistory(mapped);
      });
  }, []);

  const filteredHistory = salesHistory.filter(
    (sale) =>
      sale.receipt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sale.dateTime.includes(searchQuery)
  );

  const totalSales = salesHistory.reduce((acc, s) => acc + s.total, 0);
  const totalOrders = salesHistory.length;

  const avgOrderValue =
    totalOrders > 0 ? Math.round(totalSales / totalOrders) : 0;

  return (
    <div className="flex min-h-screen w-full flex-col bg-background p-6">
      {/* Header */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-2">
          <h1 className="text-2xl font-semibold">Reports</h1>
          <Badge
            variant="secondary"
            className="bg-orange-100 text-orange-700 hover:bg-orange-100"
          >
            Last 30 days
          </Badge>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant="outline"
            className="gap-2 border-orange-200 bg-orange-50 text-orange-700 hover:bg-orange-100"
          >
            Report: Sales
          </Button>

          <Button
            variant="outline"
            className="gap-2 bg-orange-100 text-orange-700 hover:bg-orange-200"
            onClick={() => window.location.reload()}
          >
            <RefreshCw className="size-4" />
            Refresh
          </Button>
          <Button
            className="gap-2 bg-orange-500 text-white hover:bg-orange-600"
            onClick={() => {
              const headers = ["Date", "Receipt", "Items", "Total"];
              const rows = salesHistory.map((s) => [
                s.dateTime,
                s.receipt,
                s.items,
                s.total,
              ]);
              exportToCSV(headers, rows, "sales-report.csv");
            }}
          >
            <FileDown className="size-4" />
            Export CSV
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">
        <Card className="border-orange-200 bg-orange-50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-orange-700">
              Total Sales
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-900">
              ₹ {totalSales.toLocaleString()}
            </div>
          </CardContent>
        </Card>

        <Card className="border-orange-200 bg-orange-50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-orange-700">
              Orders
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-900">
              {totalOrders}
            </div>
          </CardContent>
        </Card>

        <Card className="border-orange-200 bg-orange-50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-orange-700">
              Avg. Order Value
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-900">
              ₹ {avgOrderValue}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="mb-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
        {/* Sales Over Time Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Sales Over Time</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                sales: { label: "Sales", color: "#fb923c" },
              }}
              className="h-[300px]"
            >
              <AreaChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="date" className="text-xs" />
                <YAxis className="text-xs" />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Area
                  type="monotone"
                  dataKey="sales"
                  stroke="#fb923c"
                  fill="#fb923c40"
                />
              </AreaChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Top Products */}
        <Card>
          <CardHeader>
            <CardTitle>Top Products</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="bg-orange-50 text-orange-700">
                    Product
                  </TableHead>
                  <TableHead className="bg-orange-50 text-orange-700">
                    Qty Sold
                  </TableHead>
                  <TableHead className="bg-orange-50 text-orange-700">
                    Revenue
                  </TableHead>
                  <TableHead className="bg-orange-50 text-orange-700">
                    Share
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {topProducts.map((p: any, i: number) => (
                  <TableRow key={i}>
                    <TableCell>{p.product}</TableCell>
                    <TableCell>{p.qtySold}</TableCell>
                    <TableCell>₹ {p.revenue}</TableCell>
                    <TableCell>{p.share}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      {/* Sales History */}
      <Card>
        <CardHeader>
          <CardTitle>Sales History</CardTitle>
        </CardHeader>

        <CardContent>
          <div className="flex items-center gap-2 mb-4">
            <Input
              placeholder="Search receipts"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-[280px]"
            />
            <Button
              variant="outline"
              className="gap-2 bg-orange-100 text-orange-700 hover:bg-orange-200"
              onClick={() => window.print()}
            >
              <Printer className="size-4" />
              Print
            </Button>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="bg-orange-50 text-orange-700">
                  Date & Time
                </TableHead>
                <TableHead className="bg-orange-50 text-orange-700">
                  Receipt
                </TableHead>
                <TableHead className="bg-orange-50 text-orange-700">
                  Items
                </TableHead>
                <TableHead className="bg-orange-50 text-orange-700">
                  Total
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {filteredHistory.map((sale) => (
                <TableRow key={sale.id}>
                  <TableCell>{sale.dateTime}</TableCell>
                  <TableCell className="text-orange-700">
                    {sale.receipt}
                  </TableCell>
                  <TableCell>{sale.items}</TableCell>
                  <TableCell>₹ {sale.total}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
