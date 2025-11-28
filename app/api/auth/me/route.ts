// app/api/auth/me/route.ts
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import {
  getAccessTokenFromCookies,
  verifyAccessToken,
} from "@/lib/auth";

export async function GET() {
  try {
    const token = getAccessTokenFromCookies();

    if (!token) {
      return NextResponse.json(
        { user: null, error: "Not authenticated" },
        { status: 401 }
      );
    }

    const payload = verifyAccessToken(token);

    if (!payload) {
      return NextResponse.json(
        { user: null, error: "Invalid token" },
        { status: 401 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      select: {
        id: true,
        email: true,
        name: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { user: null, error: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ user }, { status: 200 });
  } catch (err) {
    console.error("Me error", err);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
