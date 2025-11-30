"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Order, CartItem } from "@/lib/types";

interface OrdersState {
  orders: Order[];
  tempItems: CartItem[]; // items before saving
  addTempItem: (item: CartItem) => void;
  removeTempItem: (index: number) => void;
  clearTempItems: () => void;
  saveOrder: (total: number) => Order | null;
  printBill: (orderId: string) => void;
}

export const SaveOrders = create<OrdersState>()(
  persist(
    (set, get) => ({
      orders: [],
      tempItems: [],

      // Add item to temporary cart
      addTempItem: (item) => {
        set((state) => ({ tempItems: [...state.tempItems, item] }));
      },

      // Remove item from temporary cart
      removeTempItem: (index) => {
        set((state) => ({
          tempItems: state.tempItems.filter((_, i) => i !== index),
        }));
      },

      // Clear temporary cart
      clearTempItems: () => {
        set({ tempItems: [] });
      },

      // Save all temporary items as a new order
      saveOrder: (total) => {
        const tempItems = get().tempItems;
        if (tempItems.length === 0) return null;

        const newOrder: Order = {
          id: `ORD-${Date.now()}`, // generate ID here
          items: tempItems,
          total,
          createdAt: new Date(),
          status: "completed",
        };

        set((state) => ({
          orders: [newOrder, ...state.orders],
          tempItems: [], // clear temp items after saving
        }));

        return newOrder;
      },

      // Print bill for an order
      printBill: (orderId) => {
        const order = get().orders.find((o) => o.id === orderId);
        if (order) {
          console.log("🧾 Printing bill for order:", order);
          alert(`Bill printed for order ${orderId}`);
        }
      },
    }),
    {
      name: "eiliyabill-orders", // persist key
    }
  )
);
