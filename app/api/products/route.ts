// app/api/products/route.ts
import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabaseServer";
import { cookies } from "next/headers";

export async function GET() {
  const userId = await cookies().get("user_id")?.value;

  if (!userId) {
    return NextResponse.json([], { status: 401 });
  }

  const { data, error } = await supabaseServer
    .from("products")
    .select("*")
    .eq("user_id", userId) // ⭐ only this user's products
    .order("created_at", { ascending: false });

  if (error) {
    console.error(error);
    return NextResponse.json([], { status: 500 });
  }

  return NextResponse.json(data);
}

export async function POST(req: Request) {
  const userId = await cookies().get("user_id")?.value;
  console.log("userId: ", userId);

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { name, price, stock, status, category, cost, description, image } =
    body;

  const { data, error } = await supabaseServer
    .from("products")
    .insert({
      name,
      price,
      stock,
      status,
      category,
      cost,
      description,
      image,
      user_id: userId, // ⭐ store user_id in DB
    })
    .select()
    .single();

  if (error) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data, { status: 201 });
}
