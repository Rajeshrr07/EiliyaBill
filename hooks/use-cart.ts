"use client"

import { create } from "zustand"
import type { Product, CartItem } from "@/lib/types"

// ----- Store ----- 
interface CartState {
  items: CartItem[]
  total: number
  addItem: (product: Product) => void
  removeItem: (productId: string) => void
  updateQuantity: (productId: string, quantity: number) => void
  clearCart: () => void
}

export const useCart = create<CartState>((set, get) => ({
  items: [],
  total: 0,

  addItem: (product) => {
    const items = [...get().items]
    const existingItem = items.find((item) => item.product.id === product.id)

    if (existingItem) {
      existingItem.quantity += 1
    } else {
      items.push({ product, quantity: 1 })
    }

    const total = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0)
    set({ items, total })
  },

  removeItem: (productId) => {
    const items = get().items.filter((item) => item.product.id !== productId)
    const total = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0)
    set({ items, total })
  },

  updateQuantity: (productId, quantity) => {
    let items = [...get().items]

    if (quantity <= 0) {
      items = items.filter((item) => item.product.id !== productId)
    } else {
      items = items.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    }

    const total = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0)
    set({ items, total })
  },

  clearCart: () => set({ items: [], total: 0 }),
}))
