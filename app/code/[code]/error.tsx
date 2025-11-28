"use client";

export default function CodeError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  console.error("Error in /code/[code]:", error);

  return (
    <div className="h-[70vh] flex flex-col items-center justify-center text-center px-4">
      <h1 className="text-2xl font-bold mb-2">Unable to load link stats</h1>
      <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
        Something went wrong while loading this short link.
      </p>

      <div className="flex gap-3">
        <button
          onClick={() => reset()}
          className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium"
        >
          🔁 Try again
        </button>
        <a
          href="/"
          className="px-4 py-2 rounded-lg border border-gray-300 dark:border-slate-600 text-sm font-medium hover:bg-gray-100 dark:hover:bg-slate-700"
        >
          ⬅ Back to dashboard
        </a>
      </div>
    </div>
  );
}
