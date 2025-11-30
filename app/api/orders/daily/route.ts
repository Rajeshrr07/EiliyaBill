import { supabaseServer } from "@/lib/supabaseServer";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET() {
  // ⭐ 1. Get logged-in user ID from cookies
  const userId = cookies().get("user_id")?.value;

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // ⭐ 2. Fetch ONLY this user's orders
  const { data, error } = await supabaseServer
    .from("orders")
    .select("total, created_at, user_id")
    .eq("user_id", userId) // ⭐ Filter by user
    .order("created_at", { ascending: true });

  if (error) return NextResponse.json({ error }, { status: 500 });

  // ⭐ 3. Group by day
  const daily: Record<string, number> = {};

  data.forEach((order) => {
    const day = order.created_at.split("T")[0]; // e.g. "2025-06-12"
    if (!daily[day]) daily[day] = 0;
    daily[day] += order.total;
  });

  // ⭐ 4. Format for chart
  const formatted = Object.entries(daily).map(([day, total]) => ({
    date: day.slice(5), // "06-12"
    sales: total,
  }));

  return NextResponse.json(formatted);
}
