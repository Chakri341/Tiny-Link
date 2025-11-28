// app/api/auth/logout/route.ts
import { NextResponse } from "next/server";
import {
  getRefreshTokenFromCookies,
  revokeRefreshToken,
  clearAuthCookies,
} from "@/lib/auth";

export async function POST() {
  try {
    const refreshToken = getRefreshTokenFromCookies();

    if (refreshToken) {
      await revokeRefreshToken(refreshToken);
    }

    clearAuthCookies();

    return NextResponse.json({ message: "Logged out" }, { status: 200 });
  } catch (err) {
    console.error("Logout error", err);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
