// app/api/products/[id]/route.ts
import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabaseServer";
import { cookies } from "next/headers";

interface Params {
  params: { id: string };
}

// ⭐ Utility: check product ownership
async function isOwner(productId: string, userId: string) {
  const { data, error } = await supabaseServer
    .from("products")
    .select("id, user_id")
    .eq("id", productId)
    .single();

  if (error || !data) return false;
  return data.user_id === userId;
}

export async function PUT(req: Request, { params }: Params) {
  const { id } = params;

  // ⭐ get user from cookie
  const userId = await cookies().get("user_id")?.value;
  if (!userId)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  // ⭐ ensure user owns this product
  const owner = await isOwner(id, userId);
  if (!owner) {
    return NextResponse.json(
      { error: "You are not allowed to update this product" },
      { status: 403 }
    );
  }

  const body = await req.json();

  const { data, error } = await supabaseServer
    .from("products")
    .update({
      name: body.name,
      price: body.price,
      stock: body.stock,
      status: body.status,
      category: body.category,
      cost: body.cost,
      description: body.description,
      image: body.image,
    })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

export async function DELETE(_req: Request, { params }: Params) {
  const { id } = params;

  // ⭐ get user from cookie
  const userId = await cookies().get("user_id")?.value;
  if (!userId)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  // ⭐ ensure user owns this product
  const owner = await isOwner(id, userId);
  if (!owner) {
    return NextResponse.json(
      { error: "You are not allowed to delete this product" },
      { status: 403 }
    );
  }

  const { error } = await supabaseServer.from("products").delete().eq("id", id);

  if (error) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
