"use client";

import { useRouter } from "next/navigation";

export default function LogoutButton() {
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/auth/logout", {
      method: "POST",
    });

    router.push("/login"); 
    router.refresh(); 
  }

  return (
    <button
      onClick={handleLogout}
      className="text-xs bg-red-500 text-white px-3 py-1 rounded-md hover:opacity-85 transition"
    >
      Logout
    </button>
  );
}
