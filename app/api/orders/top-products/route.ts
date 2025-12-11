import { supabaseServer } from "@/lib/supabaseServer";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET(req: Request) {
  try {
    const userId = cookies().get("user_id")?.value;
    if (!userId)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const month = Number(searchParams.get("month"));
    const year = Number(searchParams.get("year"));

    const applyFilter = month > 0 && year > 0;

    const { data, error } = await supabaseServer
      .from("order_items")
      .select(
        `
        product_name,
        quantity,
        line_total,
        orders!inner(user_id, created_at)
      `
      )
      .eq("orders.user_id", userId);

    if (error)
      return NextResponse.json({ error: error.message }, { status: 500 });

    // Filter by month/year
    const filtered = applyFilter
      ? data.filter((row: any) => {
          const d = new Date(row.orders.created_at);
          return d.getFullYear() === year && d.getMonth() + 1 === month;
        })
      : data;

    const stats: Record<string, { qty: number; revenue: number }> = {};

    filtered.forEach((item: any) => {
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

    const response = Object.entries(stats).map(([name, s]) => ({
      product: name,
      qtySold: s.qty,
      revenue: s.revenue,
      share:
        totalRevenue > 0
          ? ((s.revenue / totalRevenue) * 100).toFixed(1) + "%"
          : "0%",
    }));

    return NextResponse.json(response);
  } catch (err) {
    console.error("Top Products Error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
