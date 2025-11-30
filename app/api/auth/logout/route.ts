import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST() {
  // Remove cookies
  cookies().delete("auth_token");
  cookies().delete("user_id");

  return NextResponse.json(
    { success: true, message: "Logged out successfully" },
    { status: 200 }
  );
}
