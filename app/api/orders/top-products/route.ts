import { supabaseServer } from "@/lib/supabaseServer";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET() {
  try {
    const userId = cookies().get("user_id")?.value;

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // ⭐ Fetch only items => through orders belonging to this user
    const { data, error } = await supabaseServer
      .from("order_items")
      .select(
        `
        product_name,
        quantity,
        line_total,
        orders(user_id)
      `
      )
      .eq("orders.user_id", userId); // ⭐ filter by user

    if (error) {
      console.error("Top products error:", error);
      return NextResponse.json({ error }, { status: 500 });
    }

    // Aggregate stats
    const stats: Record<string, { qty: number; revenue: number }> = {};

    data.forEach((item) => {
      if (!stats[item.product_name]) {
        stats[item.product_name] = { qty: 0, revenue: 0 };
      }
      stats[item.product_name].qty += item.quantity;
      stats[item.product_name].revenue += item.line_total;
    });

    const totalRevenue = Object.values(stats).reduce(
      (acc, s) => acc + s.revenue,
      0
    );

    const formatted = Object.entries(stats).map(([name, s]) => ({
      product: name,
      qtySold: s.qty,
      revenue: s.revenue,
      share:
        totalRevenue > 0
          ? ((s.revenue / totalRevenue) * 100).toFixed(1) + "%"
          : "0%",
    }));

    return NextResponse.json(formatted);
  } catch (err) {
    console.error("Stats API Error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
