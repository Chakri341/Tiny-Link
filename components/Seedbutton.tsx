"use client";

import { toast } from "sonner";

export default function SeedButton() {
  async function handleSeed() {
    const ok = confirm("This will insert sample demo URLs & clicks. Continue?");
    if (!ok) return;

    try {
      const res = await fetch("/api/seed", { method: "POST" });

      if (!res.ok) {
        toast.error("Seeding failed");
        return;
      }

      toast.success("Demo data inserted — reload the page");
    } catch {
      toast.error("Something went wrong");
    }
  }

  return (
    <button
      onClick={handleSeed}
      className="px-3 py-1 rounded border text-sm bg-gray-200 hover:bg-gray-300
                dark:bg-slate-700 dark:hover:bg-slate-600 dark:text-white
                transition shadow-sm"
    >
      ➕ Seed Demo Data
    </button>
  );
}
