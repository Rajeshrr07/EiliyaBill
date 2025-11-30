"use client";

import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import { CartItemComponent } from "./CartItem";
import { useCart } from "@/hooks/use-cart";
import { SaveOrders } from "@/store/SaveOrder";
import { toast } from "sonner";
import { useState } from "react";

export function OrderCart() {
  const items = useCart((s) => s.items);
  const total = useCart((s) => s.total);
  const clearCart = useCart((s) => s.clearCart);

  // still using your existing store if needed
  const addTempItem = SaveOrders((s) => s.addTempItem);
  const saveOrderLocal = SaveOrders((s) => s.saveOrder);
  const printBill = SaveOrders((s) => s.printBill);

  const [saving, setSaving] = useState(false);

  // Handle printing bill (currently still local)
  const handlePrintBill = () => {
    if (items.length === 0) return;

    const order = saveOrderLocal(total);
    if (order) {
      printBill(order.id);
      clearCart();
      toast.success(`Bill printed for order ${order.id}`);
    }
  };

  // ✅ Handle saving order TO SUPABASE
  const handleSaveOrder = async () => {
    if (items.length === 0) return;

    try {
      setSaving(true);

      // OPTIONAL: still keep your local temp store
      addTempItem(items);
      const localOrder = saveOrderLocal(total);
      console.log("localOrder:", localOrder);

      // Call Supabase API
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items,
          total,
        }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        console.error("Save order error:", err);
        toast.error("Failed to save order to database");
        return;
      }

      const data = await res.json();
      console.log("Saved order to DB:", data);

      clearCart();
      toast.success(`Order ${data.orderId} saved successfully!`);
    } catch (error) {
      console.error("Error saving order:", error);
      toast.error("Something went wrong while saving the order");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-white border-l border-gray-200 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">Order Cart</h2>
      </div>

      {/* Table */}
      <div className="flex-1 p-4">
        {items.length === 0 ? (
          <div className="text-center text-gray-500 py-10">
            No items in cart
          </div>
        ) : (
          <Table className="w-full">
            <TableHeader className="bg-green-500">
              <TableRow>
                <TableHead className="text-left text-white">Item</TableHead>
                <TableHead className="text-center text-white">Qty</TableHead>
                <TableHead className="text-right text-white">Price</TableHead>
                <TableHead className="text-right text-white">Total</TableHead>
                <TableHead className="text-center text-white">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {items.map((item) => (
                <CartItemComponent key={item.product.id} item={item} />
              ))}
            </TableBody>

            <TableFooter className="w-full bg-white">
              <TableRow className="font-semibold border-t">
                <TableCell colSpan={3} className="text-right">
                  Total
                </TableCell>
                <TableCell className="text-right">₹ {total}</TableCell>
              </TableRow>
            </TableFooter>
          </Table>
        )}

        {/* Footer + Actions */}
        {items.length > 0 && (
          <div className="mt-2 border-t pt-3 space-y-3">
            <div className="flex justify-between items-center text-gray-700">
              <span className="font-medium">Momos Hub</span>
            </div>

            <div className="text-center text-sm text-gray-500">Thank you!</div>

            <div className="flex gap-2">
              <Button
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white cursor-pointer"
                onClick={handlePrintBill}
                disabled
              >
                Print Bill
              </Button>
              <Button
                className="flex-1 bg.green-600 hover:bg-green-700 text-white cursor-pointer"
                onClick={handleSaveOrder}
                disabled={saving}
              >
                {saving ? "Saving..." : "Save Order"}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
