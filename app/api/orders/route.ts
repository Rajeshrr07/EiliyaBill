import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabaseServer";
import { cookies } from "next/headers";

/* ===========================================
   GET → Get all orders of logged-in user
=========================================== */

export async function GET() {
  try {
    const userId = cookies().get("user_id")?.value;

    if (!userId)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { data, error } = await supabaseServer
      .from("orders")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error)
      return NextResponse.json({ error: error.message }, { status: 500 });

    const mapped = data.map((o) => ({
      ...o,
      date: o.created_at,
      dateTime: new Date(o.created_at).toLocaleString(),
      receipt: "#ORD-" + o.id.slice(0, 6).toUpperCase(),
      items: o.items_count ?? "—",
    }));

    return NextResponse.json(mapped);
  } catch (err) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

/* ===========================================
   POST → Create order + order_items
=========================================== */
export async function POST(req: Request) {
  try {
    const cookieStore = await cookies();
    const userId = cookieStore.get("user_id")?.value;

    if (!userId)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();

    const { items, total } = body as {
      items: {
        product: { id: string; name: string; price: number };
        quantity: number;
        paymentMethod: "Offline" | "Online";
      }[];
      total: number;
    };

    if (!items?.length)
      return NextResponse.json({ error: "No items to save" }, { status: 400 });

    /* ---------------------------------
       1) Insert parent order
    ----------------------------------*/
    const mainPaymentMethod = items[0]?.paymentMethod ?? "Offline"; // if multiple payment types

    const { data: order, error: orderError } = await supabaseServer
      .from("orders")
      .insert({
        user_id: userId,
        total,
        status: "paid",
        payment_method: mainPaymentMethod,
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

    /* ---------------------------------
       2) Insert order_items
    ----------------------------------*/
    const orderItems = items.map((item) => ({
      order_id: order.id,
      product_id: item.product.id,
      product_name: item.product.name,
      unit_price: item.product.price,
      quantity: item.quantity,
      line_total: item.product.price * item.quantity,
      payment_method: item.paymentMethod, // ⭐ Save per item
    }));

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

/* ===========================================
   PATCH → Update order (total, status, payment)
=========================================== */
export async function PATCH(req: Request) {
  try {
    const cookieStore = await cookies();
    const userId = cookieStore.get("user_id")?.value;

    if (!userId)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();

    const { orderId, total, status, payment_method } = body as {
      orderId: string;
      total?: number;
      status?: string;
      payment_method?: "Online" | "Offline";
    };

    if (!orderId)
      return NextResponse.json(
        { error: "orderId is required" },
        { status: 400 }
      );

    const updatePayload: Record<string, any> = {};
    if (typeof total === "number") updatePayload.total = total;
    if (status) updatePayload.status = status;
    if (payment_method) updatePayload.payment_method = payment_method;

    if (Object.keys(updatePayload).length === 0)
      return NextResponse.json({ error: "Nothing to update" }, { status: 400 });

    const { data, error } = await supabaseServer
      .from("orders")
      .update(updatePayload)
      .eq("id", orderId)
      .eq("user_id", userId)
      .select()
      .single();

    if (error) {
      console.error("Order update error:", error);
      return NextResponse.json(
        { error: "Failed to update order" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, order: data });
  } catch (err) {
    console.error("Orders PATCH error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

/* ===========================================
   DELETE → Remove order + its items
=========================================== */
export async function DELETE(req: Request) {
  try {
    const cookieStore = await cookies();
    const userId = cookieStore.get("user_id")?.value;

    if (!userId)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { orderId } = await req.json();

    if (!orderId)
      return NextResponse.json(
        { error: "orderId is required" },
        { status: 400 }
      );

    // Delete child items
    const { error: itemsError } = await supabaseServer
      .from("order_items")
      .delete()
      .eq("order_id", orderId);

    if (itemsError) {
      console.error("Delete order_items error:", itemsError);
      return NextResponse.json(
        { error: "Failed to delete order items" },
        { status: 500 }
      );
    }

    // Delete main order
    const { error: orderError } = await supabaseServer
      .from("orders")
      .delete()
      .eq("id", orderId)
      .eq("user_id", userId);

    if (orderError) {
      console.error("Delete order error:", orderError);
      return NextResponse.json(
        { error: "Failed to delete order" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Orders DELETE error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
