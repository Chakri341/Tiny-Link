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

  return (
    <nav className="w-full border-b bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg supports-[backdrop-filter]:bg-white/60 dark:supports-[backdrop-filter]:bg-slate-900/60 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 py-2 flex items-center justify-between">

        <Link
          href="/"
          className="font-semibold text-[20px] text-black dark:text-white tracking-tight hover:opacity-80 transition"
        >
          TinyLink <span className="text-blue-600">🔗</span>
        </Link>

        <div className="flex items-center gap-4">

          {user ? (
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-gray-800 dark:text-gray-200">
                Hi, {user.name?.split(" ")[0] || "User"}
              </span>
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium text-gray-800 dark:text-gray-200">
                  Hi, {user.name?.split(" ")[0] || "User"}
                </span>

                <LogoutButton />
              </div>

            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                href="/login"
                className="text-sm px-3 py-2 rounded-md  bg-black text-white dark:bg-white dark:text-black hover:opacity-85 transition"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="text-sm px-3 py-2 rounded-md bg-black text-white dark:bg-white dark:text-black hover:opacity-85 transition"
              >
                Sign up
              </Link>
            </div>
          )}

          <ThemeToggle />


        </div>
      </div>
    </nav>
  );
}
