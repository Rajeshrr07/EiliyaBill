export interface Product {
  id: string
  name: string
  price: number
  category: string
  image?: string
}

export interface CartItem {
  product: Product
  quantity: number
}

export interface Order {
  id: string
  items: CartItem[]
  total: number
  createdAt: Date
  status: "pending" | "completed" | "cancelled"
}

export interface User {
  id: string
  name: string
  email: string
}
