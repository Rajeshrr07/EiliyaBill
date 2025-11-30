"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import type { Order } from "@/lib/data";

export function QuickActions({ orders }: { orders: Order[] }) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [price, setPrice] = useState<number | "">("");

  const canSave =
    name.trim().length > 0 && typeof price === "number" && price > 0;

  function exportCSV() {
    const rows = [
      ["Order ID", "Items", "Total", "Status", "Date"],
      ...orders.map((o) => [
        o.id,
        o.items,
        o.total,
        o.status,
        new Date(o.createdAt).toISOString(),
      ]),
    ];
    const csv = rows.map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "orders-export.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="flex items-center gap-3">
      <Link href="/pos">
        <Button variant="outline" className="rounded-full bg-transparent">
          Go to POS
        </Button>
      </Link>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button className="rounded-full">Add Product</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Product</DialogTitle>
            <DialogDescription>
              Quickly add a new product to your catalog.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-3 py-2">
            <div className="grid gap-1">
              <label htmlFor="pname" className="text-sm">
                Name
              </label>
              <Input
                id="pname"
                placeholder="e.g. Iced Latte"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="grid gap-1">
              <label htmlFor="pprice" className="text-sm">
                Price (₹)
              </label>
              <Input
                id="pprice"
                type="number"
                value={price}
                onChange={(e) =>
                  setPrice(e.target.value === "" ? "" : Number(e.target.value))
                }
                min={1}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => setOpen(false)} disabled={!canSave}>
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Button variant="secondary" className="rounded-full" onClick={exportCSV}>
        Export Today
      </Button>
    </div>
  );
}
