import { NextResponse } from "next/server";
import argon2 from "argon2";
import { supabaseServer } from "@/lib/supabaseServer";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { firstName, lastName, storeName, email, password } = body;

    if (!firstName || !lastName || !storeName || !email || !password) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // 1️⃣ Check if email already exists
    const { data: existing, error: checkError } = await supabaseServer
      .from("users")
      .select("id")
      .eq("email", email)
      .single();

    if (existing) {
      return NextResponse.json(
        { error: "Email already exists" },
        { status: 409 }
      );
    }

    // 2️⃣ Hash password using Argon2
    const passwordHash = await argon2.hash(password);

    // 3️⃣ Insert into Supabase
    const { data, error } = await supabaseServer
      .from("users")
      .insert({
        first_name: firstName,
        last_name: lastName,
        store_name: storeName,
        email,
        password_hash: passwordHash,
      })
      .select()
      .single();

    if (error) {
      console.error("Insert error:", error);
      return NextResponse.json(
        { error: "Failed to create account" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { success: true, userId: data.id },
      { status: 201 }
    );
  } catch (err) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
