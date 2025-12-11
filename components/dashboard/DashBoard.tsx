"use client";

import type React from "react";
import { useEffect, useMemo, useState } from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

import { HourlySalesChart } from "./HourlySalesChart";
import { TopCategoriesChart } from "./TopCategoriesChart";
import { RecentOrdersTable } from "./RecentOrdersTable";
import { QuickActions } from "./QuickActions";
import { RangeControls } from "./RangeControls";

import {
  computeKPIs,
  filterOrdersByDate,
  type KPI,
  type Order,
} from "@/lib/data";
import { Button } from "../ui/button";
import Link from "next/link";

export default function Dashboard() {
  const [date, setDate] = useState<Date>(new Date());
  const [allOrders, setAllOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/orders");
      const data = await res.json();
      const mapped: Order[] = data.map((row: any) => ({
        id: row.id,
        createdAt: new Date(row.created_at),
        total: Number(row.total),
        status: row.status ?? "pending",
        payment_method: row.payment_method ?? "Offline",
        items: row.items, // if you have items field
      }));

      setAllOrders(mapped);
    } catch (error) {
      console.error("Error loading orders:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const currentOrders = useMemo(
    () => filterOrdersByDate(allOrders, date),
    [allOrders, date]
  );

  const kpis: KPI = useMemo(() => computeKPIs(currentOrders), [currentOrders]);
  console.log("kpis: ", kpis);

  const today = new Date();

  return (
    <div aria-label="POS Dashboard">
      <div className="rounded-xl  bg-card overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 md:p-5">
          <div className="flex flex-col">
            <h1 className="text-balance text-lg md:text-xl font-medium">
              {date.toLocaleDateString() === today.toLocaleDateString()
                ? "Today's Performance"
                : new Intl.DateTimeFormat("en-IN", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  }).format(date) + " Performance"}
            </h1>
          </div>
          <RangeControls date={date} setDate={setDate} />
        </div>

        <Separator />

        {/* KPI Row */}
        <section className="grid grid-cols-1 md:grid-cols-4 gap-3 p-4 md:p-5">
          <KpiTile
            label="Revenue From Offline"
            value={formatCurrency(kpis.offlineRevenue ?? 0)}
          />
          <KpiTile
            label="Revenue From Online"
            value={formatCurrency(kpis.onlineRevenue ?? 0)}
          />
          <KpiTile
            label="Total Revenue"
            value={formatCurrency(kpis.revenue ?? 0)}
          />
          <KpiTile label="Orders" value={String(kpis.orders ?? 0)} />
          <KpiTile
            label="Avg Ticket"
            value={formatCurrency(kpis.avgTicket ?? 0)}
          />
          <KpiTile label="Refunds" value={formatCurrency(kpis.refunds ?? 0)} />
        </section>

        {/* Optional: loading indicator */}
        {loading && (
          <div className="px-4 md:px-5 pb-2 text-xs text-muted-foreground">
            Loading orders…
          </div>
        )}

        {/* Hourly Sales */}
        <section className="px-4 md:px-5 pb-4">
          <Card className="bg-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">
                Hourly Sales
              </CardTitle>
            </CardHeader>
            <CardContent>
              <HourlySalesChart orders={currentOrders} />
            </CardContent>
          </Card>
        </section>

        {/* Top Categories */}
        <section className="px-4 md:px-5 pb-4">
          <Card className="bg-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">
                Top Categories
              </CardTitle>
            </CardHeader>
            <CardContent>
              <TopCategoriesChart orders={currentOrders} />
            </CardContent>
          </Card>
        </section>

        {/* Recent Orders */}
        <section className="px-4 md:px-5 pb-4">
          <Card className="bg-card">
            <CardHeader className="pb-2 ">
              <CardTitle className="text-sm font-medium">
                Recent Orders
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0 h-[40vh] overflow-y-auto">
              <RecentOrdersTable
                orders={currentOrders}
                onChange={fetchOrders}
              />
            </CardContent>
          </Card>
        </section>

        {/* Quick Actions */}
        {/* <section className="px-4 md:px-5 pb-5">
          <QuickActions orders={currentOrders} />
        </section> */}
      </div>
    </div>
  );
}

function KpiTile({ label, value }: { label: string; value: string }) {
  return (
    <div
      className={cn(
        "rounded-lg p-4",
        "bg-primary text-primary-foreground",
        "shadow-sm"
      )}
      role="status"
      aria-label={label}
    >
      <p className="text-xs opacity-90">{label}</p>
      <p className="text-2xl font-semibold mt-1">{value}</p>
    </div>
  );
}

function formatCurrency(n: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(n);
}
