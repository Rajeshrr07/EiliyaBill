"use client";

import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { categories } from "@/lib/data";

interface ProductSearchProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  selectedCategory: string;
  onCategoryChange: (value: string) => void;
}

export function ProductSearch({
  searchTerm,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
}: ProductSearchProps) {
  return (
    <div className="flex gap-4 mb-6">
      <div className="flex-1">
        <Input
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="h-12"
        />
      </div>
      <div className="w-48">
        <Select value={selectedCategory} onValueChange={onCategoryChange}>
          <SelectTrigger className="!h-12">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            {/* {categories.map((category) => (
              <SelectItem key={category} value={category}>
                {category}
              </SelectItem>
            ))} */}
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="Momos">Momos</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
