"use client"

import { Card } from "@/components/ui/card"
import type { Product } from "@/lib/types"
import { useCart } from "@/hooks/use-cart"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const addItem = useCart((s) => s.addItem)

  const handleAddToCart = () => {
    addItem(product)
  }

  return (
        <Card
        className="p-4 cursor-pointer bg-white rounded-xl shadow-sm hover:shadow-lg transition-shadow duration-300 ease-in-out"
        onClick={handleAddToCart}
        >
        <div className="flex flex-col space-y-2">
            {/* Product Name */}
            <Tooltip>
  <TooltipTrigger className="cursor-pointer"> <h3 className="text-gray-700 font-semibold text-base truncate">
            {product.name}
            </h3></TooltipTrigger>
  <TooltipContent>
    <p> {product.name}</p>
  </TooltipContent>
</Tooltip>
           

            {/* Product Price */}
            <p className="text-gray-900 font-bold text-lg">₹ {product.price}</p>

            {/* Optional: Add a small "Add to cart" indicator */}
            <span className="text-sm text-gray-500">Click to add to cart</span>
        </div>
        </Card>
  )
}
