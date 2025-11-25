"use client";

import { useState } from "react";
import { toast } from "sonner";

export default function LinkForm({ onCreate }: { onCreate: (link: any) => void }) {
  const [url, setUrl] = useState("");
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [expiresAt, setExpiresAt] = useState<string>("");


  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    if (!url.startsWith("http://") && !url.startsWith("https://")) {
      setError("URL must start with http:// or https://");
      setLoading(false);
      return;
    }

    if (code && !/^[A-Za-z0-9]{6,8}$/.test(code)) {
      setError("Code must be 6–8 characters and only letters or numbers");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/links", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          url, code: code || undefined,
          expiresAt: expiresAt ? new Date(expiresAt).toISOString() : null
        }),
      });

      const data = await res.json();

      if (res.status === 409) {
        setError("Code already exists");
        toast.error("Code already exists");
        setLoading(false);
        return;
      }

      if (!res.ok) {
        setError(data.error || "Failed to create link");
        toast.error(data.error || "Failed to create link");
        setLoading(false);
        return;
      }

      onCreate(data); // update table instantly
      setUrl("");
      setCode("");
      setExpiresAt("");
      toast.success("Link created successfully!");
    } catch {
      setError("Something went wrong");
      toast.error("Something went wrong!");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-5 rounded-xl p-6 shadow-sm border
                 bg-white dark:bg-slate-800
                 border-gray-200 dark:border-slate-700"
    >
      <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 text-center">
        Create Short Link
      </h2>

      <div className="flex flex-col gap-4">
        <input
          className="border border-gray-300 dark:border-slate-600
                     bg-white dark:bg-slate-700
                     text-gray-900 dark:text-gray-100
                     rounded-lg px-3 py-2 w-full
                     focus:ring-2 focus:ring-blue-500 focus:outline-none"
          placeholder="https://example.com"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />

        <input
          className="border border-gray-300 dark:border-slate-600
                     bg-white dark:bg-slate-700
                     text-gray-900 dark:text-gray-100
                     rounded-lg px-3 py-2 w-full
                     focus:ring-2 focus:ring-blue-500 focus:outline-none"
          placeholder="Custom code (optional)"
          value={code}
          onChange={(e) => setCode(e.target.value)}
        />

        <input
          type="date"
          className="border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100 rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-blue-500 focus:outline-none"
          value={expiresAt}
          onChange={(e) => setExpiresAt(e.target.value)}
        />
      </div>

      {error && (
        <p className="text-red-500 dark:text-red-400 text-sm text-center">
          {error}
        </p>
      )}

      <button
        disabled={loading}
        className="bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-medium
                   transition shadow disabled:opacity-60 disabled:cursor-not-allowed
                   dark:shadow-none"
      >
        {loading ? (
          <div className="flex justify-center items-center gap-2">
            <span>Creating...</span>
            <span className="inline-block h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
          </div>
        ) : (
          "Create"
        )}
      </button>
    </form>
  );
}
