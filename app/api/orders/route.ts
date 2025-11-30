import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabaseServer";
import { cookies } from "next/headers";

export async function GET() {
  try {
    const userId = cookies().get("user_id")?.value;

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data, error } = await supabaseServer
      .from("orders")
      .select("*")
      .eq("user_id", userId) // ⭐ only user's orders
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching orders:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (err) {
    console.error("Orders GET error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const userId = cookies().get("user_id")?.value;

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { items, total } = body as {
      items: {
        product: { id: string; name: string; price: number };
        quantity: number;
      }[];
      total: number;
    };

    if (!items || items.length === 0) {
      return NextResponse.json({ error: "No items to save" }, { status: 400 });
    }

    // 1) Insert into orders table with user_id
    const { data: order, error: orderError } = await supabaseServer
      .from("orders")
      .insert({
        user_id: userId, // ⭐ IMPORTANT
        total,
        status: "pending",
      })
      .select()
      .single();

    if (orderError || !order) {
      console.error(orderError);
      return NextResponse.json(
        { error: "Failed to create order" },
        { status: 500 }
      );
    }

    // 2) Prepare order_items rows
    const orderItems = items.map((item) => ({
      order_id: order.id,
      product_id: item.product.id,
      product_name: item.product.name,
      unit_price: item.product.price,
      quantity: item.quantity,
      line_total: item.product.price * item.quantity,
    }));

    // 3) Insert into order_items
    const { error: itemsError } = await supabaseServer
      .from("order_items")
      .insert(orderItems);

    if (itemsError) {
      console.error(itemsError);
      return NextResponse.json(
        { error: "Failed to save order items" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { success: true, orderId: order.id },
      { status: 201 }
    );
  } catch (error) {
    console.error("Order API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
