"use client";

import { Button } from "@/components/ui/button";
import { Minus, Plus } from "lucide-react";
import type { CartItem } from "@/lib/types";
import { useCart } from "@/hooks/use-cart";
import { TableRow, TableCell } from "@/components/ui/table";

interface CartItemProps {
  item: CartItem;
}

export function CartItemComponent({ item }: CartItemProps) {
  const updateQuantity = useCart((s) => s.updateQuantity);
  const removeItem = useCart((s) => s.removeItem);

  const handleIncrease = () =>
    updateQuantity(item.product.id, item.quantity + 1);
  const handleDecrease = () =>
    updateQuantity(item.product.id, item.quantity - 1);
  const handleRemove = () => removeItem(item.product.id);

  return (
    <TableRow>
      <TableCell>{item.product.name}</TableCell>
      <TableCell className="text-center">
        <div className="flex items-center justify-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleDecrease}
            className="h-6 w-6 p-0 cursor-pointer"
          >
            <Minus className="h-3 w-3" />
          </Button>
          <span className="w-8 text-center text-sm font-medium">
            {item.quantity}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={handleIncrease}
            className="h-6 w-6 p-0 cursor-pointer"
          >
            <Plus className="h-3 w-3" />
          </Button>
        </div>
      </TableCell>
      <TableCell className="text-right">₹ {item.product.price}</TableCell>
      <TableCell className="text-right">
        ₹ {item.product.price * item.quantity}
      </TableCell>
      <TableCell className="text-center">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleRemove}
          className="h-6 w-6 p-0 bg-red-500 hover:bg-red-600 text-white rounded-full hover:text-white cursor-pointer"
        >
          X
        </Button>
      </TableCell>
    </TableRow>
  );
}
