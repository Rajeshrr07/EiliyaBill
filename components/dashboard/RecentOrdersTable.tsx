"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { Order } from "@/lib/data";

export function RecentOrdersTable({ orders }: { orders: Order[] }) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Order ID</TableHead>
          <TableHead>Items</TableHead>
          <TableHead>Total</TableHead>
          <TableHead className="text-right">Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {orders.map((o) => (
          <TableRow key={o.id}>
            <TableCell className="font-medium">{`#${o.id}`}</TableCell>
            <TableCell>{o.items}</TableCell>
            <TableCell>
              {new Intl.NumberFormat("en-IN", {
                style: "currency",
                currency: "INR",
                maximumFractionDigits: 0,
              }).format(o.total)}
            </TableCell>
            <TableCell className="text-right">
              <StatusPill status={o.status} />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

function StatusPill({ status }: { status: Order["status"] }) {
  const isPaid = status === "paid";
  return (
    <span
      className={`inline-flex items-center justify-center rounded-full px-2.5 py-1 text-xs font-medium ${
        isPaid
          ? "bg-primary/90 text-primary-foreground"
          : "bg-muted text-foreground"
      }`}
      aria-label={isPaid ? "Paid" : "Pending"}
    >
      {isPaid ? "Paid" : "Pending"}
    </span>
  );
}
