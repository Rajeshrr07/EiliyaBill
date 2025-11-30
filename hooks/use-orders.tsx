"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Order, CartItem } from "@/lib/types";

interface OrdersState {
  orders: Order[];
  addOrder: (items: CartItem[], total: number) => Order;
  printBill: (orderId: string) => void;
}

export const useOrders = create<OrdersState>()(
  persist(
    (set, get) => ({
      orders: [],

      addOrder: (items, total) => {
        const newOrder: Order = {
          id: `ORD-${Date.now()}`,
          items,
          total,
          createdAt: new Date(),
          status: "completed",
        };

        set((state) => ({ orders: [newOrder, ...state.orders] }));
        return newOrder;
      },

      printBill: (orderId) => {
        const order = get().orders.find((o) => o.id === orderId);
        if (order) {
          console.log("🧾 Printing bill for order:", order);
          alert(`Bill printed for order ${orderId}`);
        }
      },
    }),
    {
      name: "eiliyabill-orders", // key in localStorage
      // getStorage: () => localStorage, // persist in localStorage
    }
  )
);
