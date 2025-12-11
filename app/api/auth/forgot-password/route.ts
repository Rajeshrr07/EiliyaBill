import { NextResponse } from "next/server";
import argon2 from "argon2";
import { supabaseServer } from "@/lib/supabaseServer";

export async function POST(req: Request) {
  try {
    const { email, newPassword } = await req.json();

    if (!email || !newPassword) {
      return NextResponse.json(
        { error: "Email and new password are required" },
        { status: 400 }
      );
    }

    const { data: user } = await supabaseServer
      .from("users")
      .select("*")
      .eq("email", email)
      .single();

    if (!user) {
      return NextResponse.json({ error: "Email not found" }, { status: 404 });
    }

    const hashedPassword = await argon2.hash(newPassword);

    const { error: updateError } = await supabaseServer
      .from("users")
      .update({
        password_hash: hashedPassword,
      })
      .eq("email", email);

    if (updateError) {
      return NextResponse.json(
        { error: "Failed to update password" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { success: true, message: "Password updated successfully" },
      { status: 200 }
    );
  } catch (err) {
    console.error("FORGOT PASSWORD ERROR:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
