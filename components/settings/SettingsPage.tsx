"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";

type User = {
  id: string;
  name: string;
  role: string;
  avatar?: string;
};

export default function SettingsPage() {
  // Business Profile State
  const [storeName, setStoreName] = useState("Sai General Store");
  const [phone, setPhone] = useState("+91 98765 43210");
  const [email, setEmail] = useState("store@email.com");
  const [address, setAddress] = useState("Street, City, PIN");
  const [gstin, setGstin] = useState("27ABCDE1234F1Z5");
  const [currency, setCurrency] = useState("INR - ₹");

  // Billing Preferences State
  const [paymentMethod, setPaymentMethod] = useState("Cash");
  const [rounding, setRounding] = useState("Nearest 1.00");
  const [askCustomerName, setAskCustomerName] = useState(false);
  const [printReceipt, setPrintReceipt] = useState(true);
  const [enableDiscounts, setEnableDiscounts] = useState(true);

  // Tax & Invoice State
  const [taxMode, setTaxMode] = useState("Inclusive");
  const [defaultTax, setDefaultTax] = useState("18");
  const [invoicePrefix, setInvoicePrefix] = useState("RB-");
  const [footerNote, setFooterNote] = useState(
    "Thank you for shopping with us!"
  );

  // Users State
  const [users, setUsers] = useState<User[]>([
    {
      id: "1",
      name: "Rohit Sharma",
      role: "Admin",
      avatar: "/male-avatar.png",
    },
    {
      id: "2",
      name: "Aisha Khan",
      role: "Cashier",
      avatar: "/diverse-female-avatar.png",
    },
  ]);

  // Initial state for reset functionality
  const initialState = {
    storeName: "Sai General Store",
    phone: "+91 98765 43210",
    email: "store@email.com",
    address: "Street, City, PIN",
    gstin: "27ABCDE1234F1Z5",
    currency: "INR - ₹",
    paymentMethod: "Cash",
    rounding: "Nearest 1.00",
    askCustomerName: false,
    printReceipt: true,
    enableDiscounts: true,
    taxMode: "Inclusive",
    defaultTax: "18",
    invoicePrefix: "RB-",
    footerNote: "Thank you for shopping with us!",
  };

  const handleReset = () => {
    setStoreName(initialState.storeName);
    setPhone(initialState.phone);
    setEmail(initialState.email);
    setAddress(initialState.address);
    setGstin(initialState.gstin);
    setCurrency(initialState.currency);
    setPaymentMethod(initialState.paymentMethod);
    setRounding(initialState.rounding);
    setAskCustomerName(initialState.askCustomerName);
    setPrintReceipt(initialState.printReceipt);
    setEnableDiscounts(initialState.enableDiscounts);
    setTaxMode(initialState.taxMode);
    setDefaultTax(initialState.defaultTax);
    setInvoicePrefix(initialState.invoicePrefix);
    setFooterNote(initialState.footerNote);
  };

  const handleSaveChanges = () => {
    // Save logic here - could be API call
    console.log("Saving changes...");
    alert("Settings saved successfully!");
  };

  const handleAddUser = () => {
    // Add user logic - could open a dialog
    console.log("Add user clicked");
    alert("Add user functionality would open a dialog here");
  };

  const handleEditUser = (userId: string) => {
    console.log("Edit user:", userId);
    alert(`Edit user ${userId} functionality`);
  };

  const handleRemoveUser = (userId: string) => {
    setUsers(users.filter((user) => user.id !== userId));
  };

  const handleLogout = () => {
    console.log("Logout clicked");
    alert("Logout functionality");
  };

  return (
    <div className="min-h-screen bg-slate-50/50">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b bg-background px-6 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-bold">EaseBill</h1>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-orange-500">Admin</span>
            <Button
              className="bg-orange-400 hover:bg-orange-500 text-white font-medium"
              onClick={handleLogout}
            >
              Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-6">
        <div className="mx-auto max-w-7xl space-y-6">
          {/* Page Header */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <h2 className="text-2xl font-bold">Settings</h2>
              <Badge
                variant="secondary"
                className="bg-orange-100 text-orange-600 hover:bg-orange-100 border-0 rounded-full px-3"
              >
                Mobile-first
              </Badge>
            </div>
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={handleReset}
                className="bg-orange-50 text-orange-600 border-orange-100 hover:bg-orange-100 hover:text-orange-700"
              >
                Reset
              </Button>
              <Button
                onClick={handleSaveChanges}
                className="bg-orange-400 hover:bg-orange-500 text-white font-medium"
              >
                Save Changes
              </Button>
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            {/* Business Profile */}
            <Card className="border-slate-200 shadow-sm">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg font-semibold">
                  Business Profile
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="storeName" className="text-slate-600">
                    Store Name
                  </Label>
                  <Input
                    id="storeName"
                    placeholder="e.g., Sai General Store"
                    value={storeName}
                    onChange={(e) => setStoreName(e.target.value)}
                    className="bg-slate-50/50"
                  />
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-slate-600">
                      Phone
                    </Label>
                    <Input
                      id="phone"
                      placeholder="+91 98765 43210"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="bg-slate-50/50"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-slate-600">
                      Email
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="store@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="bg-slate-50/50"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address" className="text-slate-600">
                    Address
                  </Label>
                  <Input
                    id="address"
                    placeholder="Street, City, PIN"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="bg-slate-50/50"
                  />
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="gstin" className="text-slate-600">
                      GSTIN
                    </Label>
                    <Input
                      id="gstin"
                      placeholder="27ABCDE1234F1Z5"
                      value={gstin}
                      onChange={(e) => setGstin(e.target.value)}
                      className="bg-slate-50/50"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="currency" className="text-slate-600">
                      Currency
                    </Label>
                    <Select value={currency} onValueChange={setCurrency}>
                      <SelectTrigger
                        id="currency"
                        className="w-full bg-slate-50/50"
                      >
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="INR - ₹">INR - ₹</SelectItem>
                        <SelectItem value="USD - $">USD - $</SelectItem>
                        <SelectItem value="EUR - €">EUR - €</SelectItem>
                        <SelectItem value="GBP - £">GBP - £</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Billing Preferences */}
            <Card className="border-slate-200 shadow-sm">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg font-semibold">
                  Billing Preferences
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="paymentMethod" className="text-slate-600">
                      Default Payment Method
                    </Label>
                    <Select
                      value={paymentMethod}
                      onValueChange={setPaymentMethod}
                    >
                      <SelectTrigger
                        id="paymentMethod"
                        className="w-full bg-slate-50/50"
                      >
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Cash">Cash</SelectItem>
                        <SelectItem value="Card">Card</SelectItem>
                        <SelectItem value="UPI">UPI</SelectItem>
                        <SelectItem value="Net Banking">Net Banking</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="rounding" className="text-slate-600">
                      Rounding
                    </Label>
                    <Select value={rounding} onValueChange={setRounding}>
                      <SelectTrigger
                        id="rounding"
                        className="w-full bg-slate-50/50"
                      >
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Nearest 1.00">
                          Nearest 1.00
                        </SelectItem>
                        <SelectItem value="Nearest 0.50">
                          Nearest 0.50
                        </SelectItem>
                        <SelectItem value="Nearest 0.25">
                          Nearest 0.25
                        </SelectItem>
                        <SelectItem value="No Rounding">No Rounding</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-4 pt-2">
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-0.5">
                      <Label
                        htmlFor="askCustomerName"
                        className="text-base font-medium"
                      >
                        Ask for Customer Name
                      </Label>
                      <p className="text-sm text-slate-500">
                        Prompt during checkout
                      </p>
                    </div>
                    <Switch
                      id="askCustomerName"
                      checked={askCustomerName}
                      onCheckedChange={setAskCustomerName}
                    />
                  </div>
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-0.5">
                      <Label
                        htmlFor="printReceipt"
                        className="text-base font-medium"
                      >
                        Print Receipt Automatically
                      </Label>
                      <p className="text-sm text-slate-500">
                        After payment is completed
                      </p>
                    </div>
                    <Switch
                      id="printReceipt"
                      checked={printReceipt}
                      onCheckedChange={setPrintReceipt}
                    />
                  </div>
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-0.5">
                      <Label
                        htmlFor="enableDiscounts"
                        className="text-base font-medium"
                      >
                        Enable Discounts
                      </Label>
                      <p className="text-sm text-slate-500">
                        Allow line-item and bill-level discounts
                      </p>
                    </div>
                    <Switch
                      id="enableDiscounts"
                      checked={enableDiscounts}
                      onCheckedChange={setEnableDiscounts}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Tax & Invoice */}
            <Card className="border-slate-200 shadow-sm">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg font-semibold">
                  Tax & Invoice
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="taxMode" className="text-slate-600">
                      Tax Mode
                    </Label>
                    <Select value={taxMode} onValueChange={setTaxMode}>
                      <SelectTrigger
                        id="taxMode"
                        className="w-full bg-slate-50/50"
                      >
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Inclusive">Inclusive</SelectItem>
                        <SelectItem value="Exclusive">Exclusive</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="defaultTax" className="text-slate-600">
                      Default Tax %
                    </Label>
                    <Input
                      id="defaultTax"
                      type="number"
                      placeholder="18"
                      value={defaultTax}
                      onChange={(e) => setDefaultTax(e.target.value)}
                      className="bg-slate-50/50"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="invoicePrefix" className="text-slate-600">
                    Invoice Prefix
                  </Label>
                  <Input
                    id="invoicePrefix"
                    placeholder="RB-"
                    value={invoicePrefix}
                    onChange={(e) => setInvoicePrefix(e.target.value)}
                    className="bg-slate-50/50"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="footerNote" className="text-slate-600">
                    Footer Note
                  </Label>
                  <Textarea
                    id="footerNote"
                    placeholder="Thank you for shopping with us!"
                    value={footerNote}
                    onChange={(e) => setFooterNote(e.target.value)}
                    rows={3}
                    className="bg-slate-50/50 min-h-[100px]"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Users & Roles */}
            <Card className="border-slate-200 shadow-sm">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg font-semibold">
                  Users & Roles
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button
                  onClick={handleAddUser}
                  className="bg-orange-400 hover:bg-orange-500 text-white w-full sm:w-auto font-medium"
                >
                  Add User
                </Button>
                <div className="rounded-md border bg-orange-50/30">
                  <Table>
                    <TableHeader className="bg-orange-50/50">
                      <TableRow className="hover:bg-transparent border-b-orange-100">
                        <TableHead className="text-orange-400 font-semibold">
                          Name
                        </TableHead>
                        <TableHead className="text-orange-400 font-semibold">
                          Role
                        </TableHead>
                        <TableHead className="text-orange-400 font-semibold text-right">
                          Actions
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {users.map((user) => (
                        <TableRow key={user.id} className="hover:bg-slate-50">
                          <TableCell className="py-3">
                            <div className="flex items-center gap-3">
                              <Avatar className="size-9 border-2 border-white shadow-sm">
                                <AvatarImage
                                  src={user.avatar || "/placeholder.svg"}
                                  alt={user.name}
                                  className="object-cover"
                                />
                                <AvatarFallback>
                                  {user.name
                                    .split(" ")
                                    .map((n) => n[0])
                                    .join("")}
                                </AvatarFallback>
                              </Avatar>
                              <span className="font-medium text-slate-900">
                                {user.name}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell className="text-slate-600">
                            {user.role}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-orange-400 hover:text-orange-600 hover:bg-orange-50 h-8 px-3 font-medium"
                                onClick={() => handleEditUser(user.id)}
                              >
                                Edit
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-orange-400 hover:text-orange-600 hover:bg-orange-50 h-8 px-3 font-medium"
                                onClick={() => handleRemoveUser(user.id)}
                              >
                                Remove
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
