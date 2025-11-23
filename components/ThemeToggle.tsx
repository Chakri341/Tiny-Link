"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  // Reserve space to prevent layout shift
  const placeholder = (
    <div className="w-[42px] h-[38px] rounded-md border border-transparent" />
  );
  if (!mounted) return placeholder;

  const isDark = theme === "dark";

  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="flex items-center justify-center w-[42px] h-[38px]
        rounded-md border border-gray-300 dark:border-slate-600
        bg-gray-200 dark:bg-slate-700 text-gray-800 dark:text-gray-100
        hover:bg-gray-300 dark:hover:bg-slate-600 transition shadow-sm active:scale-[0.97]"
      aria-label="Toggle Theme"
    >
      {isDark ? "☀️" : "🌙"}
    </button>
  );
}
