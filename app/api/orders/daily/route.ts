import { supabaseServer } from "@/lib/supabaseServer";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET() {
  try {
    const userId = cookies().get("user_id")?.value;

    if (!userId)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { data, error } = await supabaseServer
      .from("orders")
      .select("total, created_at")
      .eq("user_id", userId)
      .order("created_at");

    if (error)
      return NextResponse.json({ error: error.message }, { status: 500 });

    // Group by full date (YYYY-MM-DD)
    const map: Record<string, number> = {};

    data.forEach((o) => {
      const fullDate = o.created_at.split("T")[0];
      map[fullDate] = (map[fullDate] || 0) + o.total;
    });

    const formatted = Object.entries(map).map(([date, sales]) => ({
      date, // full: 2025-12-08
      sales,
    }));

    return NextResponse.json(formatted);
  } catch (err) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
