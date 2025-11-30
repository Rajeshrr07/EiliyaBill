import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { supabaseServer } from "@/lib/supabaseServer";

export async function GET() {
  try {
    const userId = cookies().get("user_id")?.value;

    if (!userId) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const { data: user, error } = await supabaseServer
      .from("users")
      .select("*")
      .eq("id", userId)
      .single();

    if (error) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(
      {
        id: user.id,
        firstName: user.first_name,
        lastName: user.last_name,
        storeName: user.store_name,
        email: user.email,
        createdAt: user.created_at,
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("PROFILE ERROR:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
