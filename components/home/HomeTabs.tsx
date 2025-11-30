"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
  SidebarFooter,
} from "@/components/ui/sidebar";

import {
  LayoutDashboard,
  CreditCard,
  Package,
  BarChart3,
  Settings as SettingsIcon,
  LogOut,
} from "lucide-react";
import Logo from "@/public/assets/common/logo.jpeg";
import Image from "next/image";
import { ProductGrid } from "../billing/ProductGrid";
import { OrderCart } from "../billing/OrderCart";
import Dashboard from "../dashboard/DashBoard";
import ProductManage from "../product/ProductManage";
import ReportsPage from "../report/Reports";
import SettingsPage from "../settings/SettingsPage";

type TabType =
  | "dashboard"
  | "billing"
  | "products"
  | "reports"
  | "settings"
  | "logout";

export default function HomeTabs() {
  const [activeTab, setActiveTab] = useState<TabType>("dashboard");

  const menuItems = [
    { key: "dashboard" as TabType, label: "Dashboard", icon: LayoutDashboard },
    { key: "billing" as TabType, label: "Billing (POS)", icon: CreditCard },
    { key: "products" as TabType, label: "Products", icon: Package },
    { key: "reports" as TabType, label: "Reports", icon: BarChart3 },
    // { key: "settings" as TabType, label: "Settings", icon: SettingsIcon },
    { key: "logout" as TabType, label: "Logout", icon: LogOut },
  ];

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });

    // Clear local storage
    localStorage.removeItem("auth_token");
    localStorage.removeItem("user_id");

    // Redirect to login
    window.location.href = "/login";
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "dashboard":
        return (
          <>
            <Dashboard />
          </>
        );

      case "billing":
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 justify-end">
            <div className="flex-1 p-6">
              <ProductGrid />
            </div>
            <OrderCart />
          </div>
        );

      case "products":
        return (
          <div className="space-y-6">
            <ProductManage />
          </div>
        );

      case "reports":
        return (
          <div className="space-y-6">
            <ReportsPage />
          </div>
        );

      case "settings":
        return (
          <div className="space-y-6">
            <SettingsPage />
          </div>
        );
      case "logout":
        handleLogout();
        return null;
    }
  };

  return (
    <SidebarProvider>
      <div className="flex w-full">
        {/* --- Sidebar --- */}
        <Sidebar className="border-r border-gray-200">
          <SidebarHeader className="flex items-center justify-between px-4 py-3 border-b">
            <Image src={Logo} width={150} height={50} alt="ease bill logo" />
          </SidebarHeader>

          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Application</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {menuItems.map((item) => (
                    <SidebarMenuItem key={item.key}>
                      <SidebarMenuButton
                        onClick={() => {
                          if (item.key === "logout") {
                            handleLogout();
                          } else {
                            setActiveTab(item.key);
                          }
                        }}
                        className={`flex items-center gap-2 w-full px-3 py-2 rounded-md font-medium cursor-pointer transition-colors ${
                          activeTab === item.key
                            ? "bg-blue-50 text-blue-700"
                            : "text-gray-700 hover:bg-gray-50"
                        }`}
                      >
                        <item.icon
                          className={`h-4 w-4 ${
                            activeTab === item.key
                              ? "text-blue-700"
                              : "text-gray-500"
                          }`}
                        />
                        <span>{item.label}</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
          <SidebarFooter>
            <span className="text-sm">
              copyrights @ {new Date().getFullYear()} Eiliya Bill
            </span>
          </SidebarFooter>
        </Sidebar>

        {/* --- Main --- */}
        <SidebarInset className="flex-1">
          <header className="flex items-center justify-between border-b px-6 py-4">
            <SidebarTrigger />
            <h1 className="text-xl font-semibold capitalize">{activeTab}</h1>
          </header>

          <main className="container">{renderTabContent()}</main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
