import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
  const cookieStore = cookies();

  // Delete all cookies
  cookieStore.getAll().forEach((cookie) => {
    cookieStore.set(cookie.name, "", { maxAge: 0 });
  });

  // Redirect to login
  return NextResponse.redirect(new URL("/login", process.env.NEXT_PUBLIC_URL));
}
