"use client";

import { useMemo } from "react";
import {
  Bar,
  CartesianGrid,
  ComposedChart,
  Line,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";
import type { Order } from "@/lib/data";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

export function HourlySalesChart({ orders }: { orders: Order[] }) {
  const data = useMemo(() => {
    const base = Array.from({ length: 24 }, (_, h) => ({
      hour: h,
      label: `${h}:00`,
      paid: 0,
      pending: 0,
      orders: 0,
    }));
    for (const o of orders) {
      const h = new Date(o.createdAt).getHours();
      if (o.status === "paid") base[h].paid += o.total;
      else base[h].pending += o.total;
      base[h].orders += 1;
    }
    return base;
  }, [orders]);

  const isEmpty = data.every((d) => d.paid + d.pending === 0 && d.orders === 0);

  if (isEmpty) {
    return (
      <div className="h-56 md:h-64 w-full rounded-md border bg-muted/30 grid place-items-center text-xs text-muted-foreground">
        {"Line chart placeholder"}
      </div>
    );
  }

  return (
    <ChartContainer
      config={{
        paid: { label: "Paid Revenue", color: "hsl(var(--chart-1))" }, // green
        pending: { label: "Pending Revenue", color: "hsl(var(--chart-4))" }, // orange
        orders: { label: "Orders", color: "hsl(var(--chart-2))" }, // blue
      }}
      className="h-56 md:h-64 w-full"
    >
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart
          data={data}
          margin={{ left: 8, right: 16, top: 8, bottom: 8 }}
        >
          <defs>
            <linearGradient id="paidBarFill" x1="0" y1="0" x2="0" y2="1">
              <stop
                offset="0%"
                stopColor="var(--color-paid)"
                stopOpacity={0.95}
              />
              <stop
                offset="100%"
                stopColor="var(--color-paid)"
                stopOpacity={0.75}
              />
            </linearGradient>
            <linearGradient id="pendingBarFill" x1="0" y1="0" x2="0" y2="1">
              <stop
                offset="0%"
                stopColor="var(--color-pending)"
                stopOpacity={0.95}
              />
              <stop
                offset="100%"
                stopColor="var(--color-pending)"
                stopOpacity={0.75}
              />
            </linearGradient>
          </defs>

          <CartesianGrid
            stroke="oklch(var(--color-border))"
            strokeDasharray="4 4"
          />
          <XAxis
            dataKey="label"
            tickLine={false}
            axisLine={false}
            fontSize={12}
          />
          <YAxis
            tickFormatter={(v) =>
              new Intl.NumberFormat("en-IN", { notation: "compact" }).format(
                v as number
              )
            }
            tickLine={false}
            axisLine={false}
            fontSize={12}
          />
          <YAxis
            yAxisId="right"
            orientation="right"
            tickLine={false}
            axisLine={false}
            fontSize={12}
          />

          <ChartTooltip
            content={
              <ChartTooltipContent
                formatter={(value: number, name) => {
                  if (name === "orders") return [value, "Orders"];
                  return [
                    new Intl.NumberFormat("en-IN", {
                      style: "currency",
                      currency: "INR",
                      maximumFractionDigits: 0,
                    }).format(value),
                    name === "paid" ? "Paid Revenue" : "Pending Revenue",
                  ];
                }}
              />
            }
          />

          <Bar
            dataKey="paid"
            stackId="rev"
            // fill="url(#paidBarFill)"
            fill="green"
            // radius={[6, 6, 0, 0]}
          />
          <Bar
            dataKey="pending"
            stackId="rev"
            color="red"
            // fill="url(#pendingBarFill)"
            fill="red"
            // radius={[6, 6, 0, 0]}
          />

          <Line
            type="monotone"
            yAxisId="right"
            dataKey="orders"
            stroke="var(--color-orders)"
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 3 }}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}
