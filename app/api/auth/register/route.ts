export const dynamic = 'force-dynamic';

import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import {
  signAccessToken,
  createAndStoreRefreshToken,
  setAuthCookies,
} from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const { email, password, name } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    const existing = await prisma.user.findUnique({
      where: { email },
    });

    if (existing) {
      return NextResponse.json(
        { error: "User with this email already exists" },
        { status: 409 }
      );
    }

    const hashed = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        email,
        password: hashed,
        name: name || "",
      },
    });

    const accessToken = signAccessToken({ userId: user.id, email: user.email });
    const refreshToken = await createAndStoreRefreshToken(user.id, user.email);

    setAuthCookies(accessToken, refreshToken);

    return NextResponse.json(
      {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
        },
      },
      { status: 201 }
    );
  } catch (err) {
    console.error("Register error", err);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
