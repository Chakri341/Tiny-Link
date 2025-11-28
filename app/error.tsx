"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const router = useRouter();

  useEffect(() => {
    console.error("Global error:", error);
  }, [error]);

  return (
    <html>
      <body className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-slate-900 text-gray-900 dark:text-gray-100">
        <div className="max-w-md w-full mx-auto bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-2xl shadow-lg p-6 space-y-4 text-center">
          <h1 className="text-2xl font-bold">Something went wrong</h1>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            An unexpected error occurred. You can try again or go back to the
            dashboard.
          </p>

          <div className="flex gap-3 justify-center">
            <button
              onClick={() => reset()}
              className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium"
            >
              🔁 Try again
            </button>

            <button
              onClick={() => router.push("/")}
              className="px-4 py-2 rounded-lg border border-gray-300 dark:border-slate-600 text-sm font-medium hover:bg-gray-100 dark:hover:bg-slate-700"
            >
              ⬅ Back to home
            </button>
          </div>

          {/* optional debug id */}
          {error.digest && (
            <p className="text-[11px] text-gray-400">Error id: {error.digest}</p>
          )}
        </div>
      </body>
    </html>
  );
}
