export const dynamic = "force-dynamic";
export const revalidate = 0;

import Link from "next/link";
import ThemeToggle from "./ThemeToggle";
import { getAccessTokenFromCookies, verifyAccessToken } from "@/lib/auth";
import prisma from "@/lib/prisma";
import LogoutButton from "./LogoutButton ";

export default async function Navbar() {
  const token = getAccessTokenFromCookies();
  let user = null;

  if (token) {
    const payload = verifyAccessToken(token);
    if (payload) {
      user = await prisma.user.findUnique({
        where: { id: payload.userId },
        select: { name: true, email: true },
      });
    }
  }
  console.log()

  return (
    <nav className="w-full border-b bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg shadow-sm">
      <div className="max-w-6xl mx-auto px-4 py-2 flex items-center justify-between">
        <Link href="/" className="font-semibold text-[20px]">
          TinyLink 🔗
        </Link>

        <div className="flex items-center gap-4">
          {user ? (
            <>
              <span className="text-sm font-medium">
                Hi, {user.name?.split(" ")[0] || "User"}
              </span>
              <LogoutButton />
            </>
          ) : (
            <>
              <Link href="/login" className="text-sm px-3 py-2 rounded-md bg-black text-white">
                Login
              </Link>
              <Link href="/register" className="text-sm px-3 py-2 rounded-md bg-black text-white">
                Sign up
              </Link>
            </>
          )}
          <ThemeToggle />
        </div>
      </div>
    </nav>
  );
}
