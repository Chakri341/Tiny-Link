import { cookies } from "next/headers";
import prisma from "@/lib/prisma";
import jwt, { Secret, SignOptions } from "jsonwebtoken";

const ACCESS_TOKEN_COOKIE = "tinylink_access_token";
const REFRESH_TOKEN_COOKIE = "tinylink_refresh_token";

const ACCESS_TOKEN_EXPIRES_IN = process.env.JWT_ACCESS_TOKEN_EXPIRES_IN || "15m";
const REFRESH_TOKEN_EXPIRES_IN_DAYS = parseInt(
    process.env.JWT_REFRESH_TOKEN_EXPIRES_IN_DAYS || "7",
    10
);

const ACCESS_SECRET = process.env.JWT_ACCESS_TOKEN_SECRET!;
const REFRESH_SECRET = process.env.JWT_REFRESH_TOKEN_SECRET!;

if (!ACCESS_SECRET || !REFRESH_SECRET) {
    throw new Error("JWT secrets are not set in .env");
}

type JwtPayload = {
    userId: string;
    email: string;
};

// export function signAccessToken(payload: JwtPayload) {
//     return jwt.sign(payload, ACCESS_SECRET, {
//         expiresIn: ACCESS_TOKEN_EXPIRES_IN,
//     });
// }

// export function signRefreshToken(payload: JwtPayload) {
//     return jwt.sign(payload, REFRESH_SECRET, {
//         expiresIn: `${REFRESH_TOKEN_EXPIRES_IN_DAYS}d`,
//     });
// }

export function signAccessToken(payload: JwtPayload) {
    return jwt.sign(payload, ACCESS_SECRET as Secret, {
        expiresIn: ACCESS_TOKEN_EXPIRES_IN || "15m",
    } as SignOptions);
}

export function signRefreshToken(payload: JwtPayload) {
    return jwt.sign(payload, REFRESH_SECRET as Secret, {
        expiresIn: `${REFRESH_TOKEN_EXPIRES_IN_DAYS}d`,
    } as SignOptions);
}



export function verifyAccessToken(token: string): JwtPayload | null {
    try {
        return jwt.verify(token, ACCESS_SECRET) as JwtPayload;
    } catch {
        return null;
    }
}

export function verifyRefreshToken(token: string): JwtPayload | null {
    try {
        return jwt.verify(token, REFRESH_SECRET) as JwtPayload;
    } catch {
        return null;
    }
}

export async function createAndStoreRefreshToken(userId: string, email: string) {
    const token = signRefreshToken({ userId, email });

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + REFRESH_TOKEN_EXPIRES_IN_DAYS);

    await prisma.refreshToken.create({
        data: {
            token,
            userId,
            expiresAt,
        },
    });

    return token;
}

export async function revokeRefreshToken(token: string) {
    await prisma.refreshToken.updateMany({
        where: { token },
        data: { revoked: true },
    });
}

export async function isRefreshTokenValid(token: string) {
    const record = await prisma.refreshToken.findUnique({
        where: { token },
    });

    if (!record) return false;
    if (record.revoked) return false;
    if (record.expiresAt < new Date()) return false;

    return true;
}

export function setAuthCookies(accessToken: string, refreshToken: string) {
    const cookieStore = cookies();

    cookieStore.set(ACCESS_TOKEN_COOKIE, accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
    });

    cookieStore.set(REFRESH_TOKEN_COOKIE, refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
    });
}

export function clearAuthCookies() {
    const cookieStore = cookies();

    cookieStore.set(ACCESS_TOKEN_COOKIE, "", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 0,
    });

    cookieStore.set(REFRESH_TOKEN_COOKIE, "", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 0,
    });
}

export function getAccessTokenFromCookies() {
    const cookieStore = cookies();
    const token = cookieStore.get(ACCESS_TOKEN_COOKIE)?.value;
    return token || null;
}

export function getRefreshTokenFromCookies() {
    const cookieStore = cookies();
    const token = cookieStore.get(REFRESH_TOKEN_COOKIE)?.value;
    return token || null;
}
