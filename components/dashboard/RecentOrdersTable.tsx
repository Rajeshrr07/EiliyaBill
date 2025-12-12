// "use client";

// import { useState } from "react";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import type { Order } from "@/lib/data";
// import { toast } from "sonner";

// type Props = {
//   orders: Order[];
//   onChange?: () => void; // called after edit/delete
// };

// export function RecentOrdersTable({ orders, onChange }: Props) {
//   const [editingId, setEditingId] = useState<string | null>(null);
//   const [editTotal, setEditTotal] = useState<number | null>(null);
//   const [editStatus, setEditStatus] = useState<Order["status"]>("paid");
//   const [saving, setSaving] = useState(false);

//   function startEdit(o: Order) {
//     setEditingId(o.id);
//     setEditTotal(o.total);
//     setEditStatus(o.status);
//   }

//   function cancelEdit() {
//     setEditingId(null);
//     setEditTotal(null);
//   }

//   async function saveEdit(id: string) {
//     try {
//       if (editTotal == null) {
//         toast.error("Total cannot be empty");
//         return;
//       }
//       setSaving(true);
//       const res = await fetch("/api/orders", {
//         method: "PATCH",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           orderId: id,
//           total: editTotal,
//           status: editStatus,
//         }),
//       });

//       const data = await res.json();
//       if (!res.ok) {
//         toast.error(data.error || "Failed to update order");
//         return;
//       }

//       toast.success("Order updated");
//       setEditingId(null);
//       setEditTotal(null);
//       onChange?.();
//     } catch {
//       toast.error("Something went wrong");
//     } finally {
//       setSaving(false);
//     }
//   }

//   async function deleteOrder(id: string) {
//     if (!confirm("Delete this order? This cannot be undone.")) return;

//     try {
//       const res = await fetch("/api/orders", {
//         method: "DELETE",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ orderId: id }),
//       });

//       const data = await res.json();
//       if (!res.ok) {
//         toast.error(data.error || "Failed to delete order");
//         return;
//       }

//       toast.success("Order deleted");
//       onChange?.();
//     } catch {
//       toast.error("Something went wrong");
//     }
//   }

//   return (
//     <Table>
//       <TableHeader>
//         <TableRow>
//           <TableHead>Order ID</TableHead>
//           <TableHead>Total</TableHead>
//           <TableHead className="text-right">Status</TableHead>
//           <TableHead className="text-right">Actions</TableHead>
//         </TableRow>
//       </TableHeader>
//       <TableBody>
//         {orders.map((o) => {
//           const isEditing = editingId === o.id;

//           return (
//             <TableRow key={o.id}>
//               <TableCell className="font-medium">{`#${o.id}`}</TableCell>

//               <TableCell>
//                 {isEditing ? (
//                   <Input
//                     type="number"
//                     className="h-8 max-w-[120px]"
//                     value={editTotal ?? 0}
//                     onChange={(e) => setEditTotal(Number(e.target.value))}
//                   />
//                 ) : (
//                   new Intl.NumberFormat("en-IN", {
//                     style: "currency",
//                     currency: "INR",
//                     maximumFractionDigits: 0,
//                   }).format(o.total)
//                 )}
//               </TableCell>

//               <TableCell className="text-right">
//                 {isEditing ? (
//                   <select
//                     className="h-8 rounded-md border bg-background px-2 text-xs"
//                     value={editStatus}
//                     onChange={(e) =>
//                       setEditStatus(e.target.value as Order["status"])
//                     }
//                   >
//                     <option value="paid">Paid</option>
//                     <option value="pending">Pending</option>
//                     <option value="refunded">Refunded</option>
//                   </select>
//                 ) : (
//                   <StatusPill status={o.status} />
//                 )}
//               </TableCell>

//               <TableCell className="text-right">
//                 {isEditing ? (
//                   <div className="flex justify-end gap-2">
//                     <Button
//                       size="sm"
//                       variant="outline"
//                       className="h-8 px-3 text-xs"
//                       type="button"
//                       onClick={cancelEdit}
//                     >
//                       Cancel
//                     </Button>
//                     <Button
//                       size="sm"
//                       className="h-8 px-3 text-xs"
//                       type="button"
//                       disabled={saving}
//                       onClick={() => saveEdit(o.id)}
//                     >
//                       {saving ? "Saving..." : "Save"}
//                     </Button>
//                   </div>
//                 ) : (
//                   <div className="flex justify-end gap-2">
//                     <Button
//                       size="sm"
//                       variant="outline"
//                       className="h-8 px-3 text-xs"
//                       type="button"
//                       onClick={() => startEdit(o)}
//                     >
//                       Edit
//                     </Button>
//                     <Button
//                       size="sm"
//                       variant="ghost"
//                       className="h-8 px-3 text-xs text-red-600 hover:text-red-700"
//                       type="button"
//                       onClick={() => deleteOrder(o.id)}
//                     >
//                       Delete
//                     </Button>
//                   </div>
//                 )}
//               </TableCell>
//             </TableRow>
//           );
//         })}
//       </TableBody>
//     </Table>
//   );
// }

// function StatusPill({ status }: { status: Order["status"] }) {
//   const isPaid = status === "paid";
//   const isRefunded = status === "refunded";

//   const styles = isRefunded
//     ? "bg-amber-100 text-amber-800"
//     : isPaid
//       ? "bg-primary/90 text-primary-foreground"
//       : "bg-muted text-foreground";

//   const label = isRefunded ? "Refunded" : isPaid ? "Paid" : "Pending";

//   return (
//     <span
//       className={`inline-flex items-center justify-center rounded-full px-2.5 py-1 text-xs font-medium ${styles}`}
//       aria-label={label}
//     >
//       {label}
//     </span>
//   );
// }

"use client";

import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { Order } from "@/lib/data";
import { toast } from "sonner";

type Props = {
  orders: Order[];
  onChange?: () => void;
};

export function RecentOrdersTable({ orders, onChange }: Props) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTotal, setEditTotal] = useState<number | null>(null);
  const [editStatus, setEditStatus] = useState<Order["status"]>("paid");
  const [editPayment, setEditPayment] = useState<"Offline" | "Online">(
    "Offline"
  );
  const [saving, setSaving] = useState(false);

  function startEdit(o: Order) {
    setEditingId(o.id);
    setEditTotal(o.total);
    setEditStatus(o.status);
    setEditPayment(o.payment_method ?? "Offline"); // ⭐ LOAD PAYMENT METHOD
  }

  function cancelEdit() {
    setEditingId(null);
    setEditTotal(null);
  }

  async function saveEdit(id: string) {
    try {
      if (editTotal == null) {
        toast.error("Total cannot be empty");
        return;
      }
      setSaving(true);

      const res = await fetch("/api/orders", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId: id,
          total: editTotal,
          status: editStatus,
          payment_method: editPayment, // ⭐ SEND PAYMENT METHOD
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error || "Failed to update order");
        return;
      }

      toast.success("Order updated");
      setEditingId(null);
      setEditTotal(null);
      onChange?.();
    } catch {
      toast.error("Something went wrong");
    } finally {
      setSaving(false);
    }
  }

  async function deleteOrder(id: string) {
    if (!confirm("Delete this order? This cannot be undone.")) return;

    try {
      const res = await fetch("/api/orders", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId: id }),
      });

      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error || "Failed to delete order");
        return;
      }

      toast.success("Order deleted");
      onChange?.();
    } catch {
      toast.error("Something went wrong");
    }
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Order ID</TableHead>
          <TableHead>Total</TableHead>
          <TableHead>Payment</TableHead> {/* ⭐ NEW COLUMN */}
          <TableHead className="text-right">Status</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        {orders.map((o) => {
          const isEditing = editingId === o.id;

          return (
            <TableRow key={o.id}>
              <TableCell className="font-medium">{`#${o.id}`}</TableCell>

              {/* Total */}
              <TableCell>
                {isEditing ? (
                  <Input
                    type="number"
                    className="h-8 max-w-[120px]"
                    value={editTotal ?? 0}
                    onChange={(e) => setEditTotal(Number(e.target.value))}
                  />
                ) : (
                  new Intl.NumberFormat("en-IN", {
                    style: "currency",
                    currency: "INR",
                    maximumFractionDigits: 0,
                  }).format(o.total)
                )}
              </TableCell>

              {/* Payment Method */}
              <TableCell>
                {isEditing ? (
                  <select
                    className="h-8 rounded-md border bg-background px-2 text-xs"
                    value={editPayment}
                    onChange={(e) => setEditPayment(e.target.value as any)}
                  >
                    <option value="Offline">Offline</option>
                    <option value="Online">Online</option>
                  </select>
                ) : (
                  <PaymentPill method={o.payment_method} />
                )}
              </TableCell>

              {/* Status */}
              <TableCell className="text-right">
                {isEditing ? (
                  <select
                    className="h-8 rounded-md border bg-background px-2 text-xs"
                    value={editStatus}
                    onChange={(e) =>
                      setEditStatus(e.target.value as Order["status"])
                    }
                  >
                    <option value="paid">Paid</option>
                    <option value="pending">Pending</option>
                    <option value="refunded">Refunded</option>
                  </select>
                ) : (
                  <StatusPill status={o.status} />
                )}
              </TableCell>

              {/* Actions */}
              <TableCell className="text-right">
                {isEditing ? (
                  <div className="flex justify-end gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-8 px-3 text-xs"
                      type="button"
                      onClick={cancelEdit}
                    >
                      Cancel
                    </Button>
                    <Button
                      size="sm"
                      className="h-8 px-3 text-xs"
                      type="button"
                      disabled={saving}
                      onClick={() => saveEdit(o.id)}
                    >
                      {saving ? "Saving..." : "Save"}
                    </Button>
                  </div>
                ) : (
                  <div className="flex justify-end gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-8 px-3 text-xs"
                      type="button"
                      onClick={() => startEdit(o)}
                    >
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-8 px-3 text-xs text-red-600 hover:text-red-700"
                      type="button"
                      onClick={() => deleteOrder(o.id)}
                    >
                      Delete
                    </Button>
                  </div>
                )}
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}

/* ===========================================
   Status Pill UI
=========================================== */
function StatusPill({ status }: { status: Order["status"] }) {
  const isPaid = status === "paid";
  const isRefunded = status === "refunded";

  const styles = isRefunded
    ? "bg-amber-100 text-amber-800"
    : isPaid
      ? "bg-primary/90 text-primary-foreground"
      : "bg-muted text-foreground";

  const label = isRefunded ? "Refunded" : isPaid ? "Paid" : "Pending";

  return (
    <span
      className={`inline-flex items-center justify-center rounded-full px-2.5 py-1 text-xs font-medium ${styles}`}
      aria-label={label}
    >
      {label}
    </span>
  );
}

/* ===========================================
   Payment Pill UI
=========================================== */
function PaymentPill({ method }: { method: string }) {
  const isOnline = method === "Online";

  const styles = isOnline
    ? "bg-emerald-100 text-emerald-800"
    : "bg-blue-100 text-blue-800"; // offline

  const label = isOnline ? "Online" : "Offline";

  return (
    <span
      className={`inline-flex items-center justify-center rounded-full px-2.5 py-1 text-xs font-medium ${styles}`}
    >
      {label}
    </span>
  );
}
