"use client";

import { useEffect, useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

import { AreaChart, Area, CartesianGrid, XAxis, YAxis } from "recharts";
import { RefreshCw, FileDown, Printer } from "lucide-react";
import { exportToCSV } from "@/lib/export-utils";

export default function ReportsPage() {
  const [salesData, setSalesData] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [salesHistory, setSalesHistory] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  // DEFAULT MONTH = current month
  const [selectedMonth, setSelectedMonth] = useState(() => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
  });

  const [year, month] = selectedMonth.split("-").map(Number);

  /* -------------------------------------------------
     FETCH SALES HISTORY + DAILY SALES ONCE
  ------------------------------------------------- */
  useEffect(() => {
    fetch("/api/orders")
      .then((r) => r.json())
      .then((data) => {
        const mapped = data.map((o) => ({
          id: o.id,
          date: o.date, // Full ISO date from backend
          dateTime: new Date(o.date).toLocaleString(),
          receipt: o.receipt,
          items: o.items ?? "—",
          total: o.total,
        }));
        setSalesHistory(mapped);
      });

    fetch("/api/orders/daily")
      .then((r) => r.json())
      .then(setSalesData);
  }, []);

  /* -------------------------------------------------
     FETCH TOP PRODUCTS WHEN MONTH CHANGES
  ------------------------------------------------- */
  useEffect(() => {
    fetch(`/api/orders/top-products?month=${month}&year=${year}`)
      .then((r) => r.json())
      .then(setTopProducts);
  }, [month, year]);

  /* -------------------------------------------------
     MONTH FILTERING LOGIC (No Date() issues)
  ------------------------------------------------- */
  const monthMatches = (dateStr) => {
    const [yyyy, mm] = dateStr.split("-");
    return Number(yyyy) === year && Number(mm) === month;
  };

  /* -------------------------------------------------
     FIX DAILY SALES
  ------------------------------------------------- */
  const fixedDailySales = useMemo(() => {
    return salesData.map((d) => ({
      fullDate: d.date, // "2025-12-08"
      dayLabel: d.date.slice(8), // "08"
      sales: d.sales,
    }));
  }, [salesData]);

  const filteredDailySales = fixedDailySales.filter((d) =>
    monthMatches(d.fullDate)
  );

  /* -------------------------------------------------
     FILTER SALES HISTORY
  ------------------------------------------------- */
  const filteredHistory = salesHistory.filter((row) => monthMatches(row.date));

  /* -------------------------------------------------
     KPI VALUES
  ------------------------------------------------- */
  const totalSales = filteredHistory.reduce((acc, row) => acc + row.total, 0);
  const totalOrders = filteredHistory.length;
  const avgOrderValue =
    totalOrders > 0 ? Math.round(totalSales / totalOrders) : 0;

  /* -------------------------------------------------
     RENDER PAGE UI
  ------------------------------------------------- */
  return (
    <div className="flex min-h-screen w-full flex-col bg-background p-6">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-6 flex-wrap gap-3">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-semibold">Reports</h1>
          <Badge>
            {new Date(selectedMonth + "-01").toLocaleString("en-IN", {
              month: "long",
              year: "numeric",
            })}
          </Badge>
        </div>

        <div className="flex items-center gap-3">
          <Input
            type="month"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="w-[160px]"
          />

          <Button variant="outline" onClick={() => window.location.reload()}>
            <RefreshCw className="size-4" /> Refresh
          </Button>

          <Button
            className="bg-orange-500 text-white"
            onClick={() => {
              const headers = ["Date", "Receipt", "Items", "Total"];
              const rows = filteredHistory.map((s) => [
                s.dateTime,
                s.receipt,
                s.items,
                s.total,
              ]);
              exportToCSV(headers, rows, "sales-report.csv");
            }}
          >
            <FileDown className="size-4" /> Export CSV
          </Button>
        </div>
      </div>

      {/* KPI CARDS */}
      <div className="grid md:grid-cols-3 gap-4 mb-6">
        <Card className="bg-orange-50 border-orange-200">
          <CardHeader>
            <CardTitle>Total Sales</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">₹ {totalSales}</div>
          </CardContent>
        </Card>

        <Card className="bg-orange-50 border-orange-200">
          <CardHeader>
            <CardTitle>Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{totalOrders}</div>
          </CardContent>
        </Card>

        <Card className="bg-orange-50 border-orange-200">
          <CardHeader>
            <CardTitle>Avg Order Value</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">₹ {avgOrderValue}</div>
          </CardContent>
        </Card>
      </div>

      {/* SALES CHART + TOP PRODUCTS */}
      <div className="grid lg:grid-cols-2 gap-6 mb-6">
        {/* SALES OVER TIME CHART */}
        <Card>
          <CardHeader>
            <CardTitle>Sales Over Time</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                sales: {
                  label: "Sales",
                  color: "hsl(var(--chart-1))",
                },
              }}
              className="h-[300px]"
            >
              <AreaChart data={filteredDailySales}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="dayLabel" />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Area
                  type="monotone"
                  dataKey="sales"
                  stroke="hsl(var(--chart-1))"
                  fill="hsl(var(--chart-1))"
                />
              </AreaChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* TOP PRODUCTS TABLE */}
        <Card>
          <CardHeader>
            <CardTitle>Top Products</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead>Qty</TableHead>
                  <TableHead>Revenue</TableHead>
                  <TableHead>Share</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {topProducts.map((p, i) => (
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

      {/* SALES HISTORY */}
      <Card>
        <CardHeader>
          <CardTitle>Sales History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2 mb-4">
            <Input
              placeholder="Search receipt"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-[250px]"
            />
            <Button variant="outline" onClick={() => window.print()}>
              <Printer className="size-4" /> Print
            </Button>
          </div>
          <div className="h-64 overflow-y-scroll">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date & Time</TableHead>
                  <TableHead>Receipt</TableHead>
                  <TableHead>Items</TableHead>
                  <TableHead>Total</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {filteredHistory
                  .filter(
                    (row) =>
                      row.receipt
                        .toLowerCase()
                        .includes(searchQuery.toLowerCase()) ||
                      row.dateTime.includes(searchQuery)
                  )
                  .map((row) => (
                    <TableRow key={row.id}>
                      <TableCell>{row.dateTime}</TableCell>
                      <TableCell className="text-orange-700">
                        {row.receipt}
                      </TableCell>
                      <TableCell>{row.items}</TableCell>
                      <TableCell>₹ {row.total}</TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
