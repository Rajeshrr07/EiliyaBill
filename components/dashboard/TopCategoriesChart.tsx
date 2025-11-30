"use client";

import { useMemo } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  LabelList,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";
import type { Order } from "@/lib/data";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

export function TopCategoriesChart({ orders }: { orders: Order[] }) {
  const data = useMemo(() => {
    const map = new Map<
      string,
      { category: string; paid: number; pending: number; total: number }
    >();
    for (const o of orders) {
      const k = o.category;
      if (!map.has(k))
        map.set(k, { category: k, paid: 0, pending: 0, total: 0 });
      if (o.status === "paid") map.get(k)!.paid += o.total;
      else map.get(k)!.pending += o.total;
      map.get(k)!.total += o.total;
    }
    return Array.from(map.values()).sort((a, b) => b.total - a.total);
  }, [orders]);

  const isEmpty = data.length === 0 || data.every((d) => d.total === 0);

  if (isEmpty) {
    return (
      <div className="h-56 md:h-64 w-full rounded-md border bg-muted/30 grid place-items-center text-xs text-muted-foreground">
        {"Stacked bar chart placeholder"}
      </div>
    );
  }

  const formatINR = (n: number) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(n);

  return (
    <ChartContainer
      config={{
        paid: { label: "Paid", color: "green" }, // green
        pending: { label: "Pending", color: "red" }, // orange
      }}
      className="h-56 md:h-64 w-full"
    >
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          layout="vertical"
          margin={{ left: 16, right: 16, top: 8, bottom: 8 }}
          barCategoryGap={14}
        >
          <defs>
            <linearGradient id="paidCatFill" x1="0" y1="0" x2="1" y2="0">
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
            <linearGradient id="pendingCatFill" x1="0" y1="0" x2="1" y2="0">
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
            horizontal={false}
          />
          <XAxis
            type="number"
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
            type="category"
            dataKey="category"
            tickLine={false}
            axisLine={false}
            fontSize={12}
            width={100}
          />

          <ChartTooltip
            content={
              <ChartTooltipContent
                formatter={(value: number, name, _item, _idx, payload) => [
                  formatINR(value),
                  name === "paid" ? "Paid" : "Pending",
                ]}
              />
            }
          />
          <ChartLegend content={<ChartLegendContent />} />

          <Bar
            dataKey="paid"
            stackId="x"
            fill="url(#paidCatFill)"
            radius={[0, 6, 6, 0]}
          >
            <LabelList
              dataKey="paid"
              position="insideLeft"
              formatter={(v: number) => (v ? formatINR(v) : "")}
              className="fill-background/90"
            />
          </Bar>
          <Bar
            dataKey="pending"
            stackId="x"
            fill="url(#pendingCatFill)"
            radius={[0, 6, 6, 0]}
          >
            <LabelList
              content={(props) => {
                const p = props as any;
                const payload = p?.payload;
                const width = Number(p?.width ?? 0);
                const height = Number(p?.height ?? 0);
                const x = Number(p?.x ?? 0);
                const y = Number(p?.y ?? 0);

                if (!payload || width <= 0 || height <= 0) return null;

                const total = Number(payload.total ?? 0);
                if (!total) return null;

                const tx = x + width + 6;
                const ty = y + height / 2 + 4;

                return (
                  <text
                    x={tx}
                    y={ty}
                    fontSize={12}
                    className="fill-muted-foreground"
                  >
                    {new Intl.NumberFormat("en-IN", {
                      style: "currency",
                      currency: "INR",
                      maximumFractionDigits: 0,
                    }).format(total)}
                  </text>
                );
              }}
            />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}
