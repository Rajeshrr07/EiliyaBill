import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabaseServer";

export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const { id, productName, price } = body;

    if (!id)
      return NextResponse.json(
        { error: "Missing grocery id" },
        { status: 400 }
      );

    const { data, error } = await supabaseServer
      .from("groceries")
      .update({
        product_name: productName,
        price,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single();

    if (error)
      return NextResponse.json({ error: error.message }, { status: 500 });

    return NextResponse.json({ success: true, data });
  } catch (err) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
