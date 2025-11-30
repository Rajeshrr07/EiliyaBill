"use client";

import { useEffect, useState } from "react";
import {
  Search,
  Plus,
  Download,
  Save,
  AlertTriangle,
  PauseCircle,
  CheckCircle2,
  Package,
  Pencil,
  Trash2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import Image from "next/image";
import { toast } from "sonner";

interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
  status: "Active" | "Inactive" | "Low stock";
  category: string;
  cost?: number;
  description?: string;
  image?: string;
}

export default function ProductManage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(false);

  // Form State
  const [formData, setFormData] = useState<Partial<Product>>({
    category: "Momos",
    status: "Active",
  });

  // FILTER STATES
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortFilter, setSortFilter] = useState("newest");

  // Load products from backend
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("/api/products");
        const data = await res.json();
        setProducts(data || []);
      } catch (error) {
        console.error("Error fetching products", error);
      }
    };
    fetchProducts();
  }, []);

  // RESET FORM
  const resetForm = () => {
    setSelectedProduct(null);
    setFormData({
      category: "Momos",
      status: "Active",
    });
  };

  // ADD NEW
  const handleAddNew = () => {
    resetForm();
  };

  // EDIT
  const handleEdit = (product: Product) => {
    setSelectedProduct(product);
    setFormData(product);
  };

  // DELETE
  const handleDelete = async (product: Product) => {
    try {
      setLoading(true);
      await fetch(`/api/products/${product.id}`, {
        method: "DELETE",
      });

      setProducts((prev) => prev.filter((p) => p.id !== product.id));
      if (selectedProduct?.id === product.id) resetForm();
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  // SAVE / UPDATE
  const handleSave = async () => {
    if (!formData.name || !formData.category) return;

    const payload = {
      name: formData.name,
      price: Number(formData.price) || 0,
      stock: Number(formData.stock) || 0,
      status: formData.status,
      category: formData.category,
      cost: Number(formData.cost) || 0,
      description: formData.description || "",
      image: formData.image || "",
    };

    setLoading(true);

    try {
      if (selectedProduct) {
        // UPDATE
        const res = await fetch(`/api/products/${selectedProduct.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const updated = await res.json();

        setProducts((prev) =>
          prev.map((p) => (p.id === updated.id ? updated : p))
        );

        setSelectedProduct(updated);
        setFormData(updated);
      } else {
        // CREATE
        const res = await fetch("/api/products", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const created = await res.json();
        setProducts((prev) => [created, ...prev]);
        setSelectedProduct(created);
        setFormData(created);
        toast.success("Product Added Successfully");
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  // -------------------------------
  // 👉 FULL FILTER LOGIC
  // -------------------------------

  const filteredProducts = (products || [])
    .filter((p) => {
      if (!p?.name || typeof p.name !== "string") return false;
      return p.name.toLowerCase().includes(searchQuery.toLowerCase());
    })
    .filter((p) =>
      categoryFilter === "all" ? true : p.category === categoryFilter
    )
    .filter((p) => (statusFilter === "all" ? true : p.status === statusFilter))
    .sort((a, b) => {
      if (sortFilter === "price-asc") return a.price - b.price;
      if (sortFilter === "price-desc") return b.price - a.price;
      if (sortFilter === "stock-asc") return a.stock - b.stock;
      if (sortFilter === "stock-desc") return b.stock - a.stock;
      return 0;
    });

  // ---------------- END FILTER LOGIC ------------------

  return (
    <div className="min-h-screen bg-gray-50/50 p-6 space-y-6">
      <Card className="border-none shadow-sm bg-white">
        <CardContent className="p-6">
          <div className="space-y-6">
            {/* TOP BAR */}
            <div className="flex flex-col md:flex-row justify-between gap-4">
              <div className="flex items-center gap-3">
                <h1 className="text-xl font-bold">Products</h1>
                <Badge className="bg-orange-100 text-orange-700 border-none rounded-full px-3">
                  <Package className="h-3 w-3 mr-1" />
                  {filteredProducts.length} items
                </Badge>
              </div>

              {/* FILTERS */}
              <div className="flex flex-wrap gap-3 w-full md:w-auto">
                {/* 🔍 SEARCH */}
                <div className="relative w-full md:w-64">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                  <Input
                    placeholder="Search products..."
                    className="pl-9 bg-gray-50 border-gray-200"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>

                {/* CATEGORY */}
                <Select
                  value={categoryFilter}
                  onValueChange={setCategoryFilter}
                >
                  <SelectTrigger className="bg-gray-50 border-gray-200 w-[140px]">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="Momos">Momos</SelectItem>
                  </SelectContent>
                </Select>

                {/* STATUS */}
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="bg-gray-50 border-gray-200 w-[140px]">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="Active">Active</SelectItem>
                    <SelectItem value="Inactive">Inactive</SelectItem>
                    <SelectItem value="Low stock">Low stock</SelectItem>
                  </SelectContent>
                </Select>

                {/* SORT */}
                <Select value={sortFilter} onValueChange={setSortFilter}>
                  <SelectTrigger className="bg-gray-50 border-gray-200 w-[140px]">
                    <SelectValue placeholder="Sort" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">Newest</SelectItem>
                    <SelectItem value="price-asc">Price: Low → High</SelectItem>
                    <SelectItem value="price-desc">
                      Price: High → Low
                    </SelectItem>
                    <SelectItem value="stock-asc">Stock: Low → High</SelectItem>
                    <SelectItem value="stock-desc">
                      Stock: High → Low
                    </SelectItem>
                  </SelectContent>
                </Select>

                {/* ADD PRODUCT BUTTON */}
                <Button
                  className="bg-orange-400 text-white"
                  onClick={handleAddNew}
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add Product
                </Button>
              </div>
            </div>

            {/* MAIN GRID */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* PRODUCT LIST */}
              <div className="lg:col-span-2 border rounded-xl bg-white overflow-hidden">
                <Table>
                  <TableHeader className="bg-orange-50/50">
                    <TableRow>
                      <TableHead>Product</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Stock</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>

                  <TableBody>
                    {filteredProducts.map((product) => (
                      <TableRow
                        key={product.id}
                        className="hover:bg-gray-50 cursor-pointer"
                        onClick={() => handleEdit(product)}
                      >
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gray-100 overflow-hidden">
                              {product.image ? (
                                <Image
                                  src={product.image}
                                  alt={product.name}
                                  width={40}
                                  height={40}
                                  className="object-cover w-full h-full"
                                />
                              ) : (
                                <div className="flex items-center justify-center w-full h-full text-xs text-gray-400">
                                  {product.name.slice(0, 2).toUpperCase()}
                                </div>
                              )}
                            </div>
                            <div>
                              <div>{product.name}</div>
                              <div className="text-xs text-gray-400">
                                {product.category}
                              </div>
                            </div>
                          </div>
                        </TableCell>

                        <TableCell>₹ {product.price}</TableCell>
                        <TableCell>{product.stock}</TableCell>

                        <TableCell>
                          <StatusBadge status={product.status} />
                        </TableCell>

                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEdit(product);
                            }}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>

                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDelete(product);
                            }}
                          >
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* FORM PANEL */}
              <div className="border rounded-xl p-5 space-y-4 bg-white">
                <h2 className="text-lg font-bold">
                  {selectedProduct ? "Edit Product" : "New Product"}
                </h2>

                {/* NAME */}
                <Input
                  placeholder="Product Name"
                  value={formData.name || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                />

                {/* CATEGORY */}
                <Select
                  value={formData.category}
                  onValueChange={(v) =>
                    setFormData({ ...formData, category: v })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Momos">Momos</SelectItem>
                  </SelectContent>
                </Select>

                {/* IMAGE URL */}
                <Input
                  placeholder="Image URL"
                  value={formData.image || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, image: e.target.value })
                  }
                />

                {/* PRICE / COST */}
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    type="number"
                    placeholder="Price"
                    value={formData.price || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        price: Number(e.target.value),
                      })
                    }
                  />
                  <Input
                    type="number"
                    placeholder="Cost"
                    value={formData.cost || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        cost: Number(e.target.value),
                      })
                    }
                  />
                </div>

                {/* STOCK / STATUS */}
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    type="number"
                    placeholder="Stock"
                    value={formData.stock || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        stock: Number(e.target.value),
                      })
                    }
                  />

                  <Select
                    value={formData.status}
                    onValueChange={(v: any) =>
                      setFormData({ ...formData, status: v })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Active">Active</SelectItem>
                      <SelectItem value="Inactive">Inactive</SelectItem>
                      <SelectItem value="Low stock">Low stock</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* DESCRIPTION */}
                <Textarea
                  placeholder="Description"
                  value={formData.description || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                />

                {/* SAVE BUTTON */}
                <Button
                  className="bg-orange-500 text-white w-full cursor-pointer"
                  onClick={handleSave}
                >
                  <Save className="h-4 w-4 mr-2" />
                  Save Product
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  if (status === "Active")
    return (
      <Badge className="bg-green-100 text-green-600 border-none">
        <CheckCircle2 className="h-3 w-3 mr-1" />
        Active
      </Badge>
    );

  if (status === "Inactive")
    return (
      <Badge className="bg-gray-200 text-gray-600 border-none">
        <PauseCircle className="h-3 w-3 mr-1" />
        Inactive
      </Badge>
    );

  return (
    <Badge className="bg-yellow-100 text-yellow-700 border-none">
      <AlertTriangle className="h-3 w-3 mr-1" />
      Low stock
    </Badge>
  );
}
