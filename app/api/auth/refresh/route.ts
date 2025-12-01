export const dynamic = 'force-dynamic';

import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import {
  verifyRefreshToken,
  isRefreshTokenValid,
  createAndStoreRefreshToken,
  revokeRefreshToken,
  signAccessToken,
  getRefreshTokenFromCookies,
  setAuthCookies,
} from "@/lib/auth";

export async function POST() {
  try {
    const refreshToken = getRefreshTokenFromCookies();

    if (!refreshToken) {
      return NextResponse.json(
        { error: "No refresh token" },
        { status: 401 }
      );
    }

    const jwtPayload = verifyRefreshToken(refreshToken);
    if (!jwtPayload) {
      return NextResponse.json(
        { error: "Invalid refresh token" },
        { status: 401 }
      );
    }

    const valid = await isRefreshTokenValid(refreshToken);
    if (!valid) {
      return NextResponse.json(
        { error: "Refresh token expired or revoked" },
        { status: 401 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: jwtPayload.userId },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Rotate refresh token: revoke old, create new
    await revokeRefreshToken(refreshToken);

    const newAccessToken = signAccessToken({
      userId: user.id,
      email: user.email,
    });

    const newRefreshToken = await createAndStoreRefreshToken(
      user.id,
      user.email
    );

    setAuthCookies(newAccessToken, newRefreshToken);

    return NextResponse.json({ message: "Token refreshed" }, { status: 200 });
  } catch (err) {
    console.error("Refresh error", err);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
