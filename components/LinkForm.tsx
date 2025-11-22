"use client"

import { useState } from "react";
import clsx from "clsx";
import { toast } from "sonner";

export default function LinkForm({ onCreate }: { onCreate: (link: any) => void }) {
  const [url, setUrl] = useState("")
  const [code, setCode] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)


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
      setError("Code must be 6–8 characters and only letters or numbers.");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/links", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url, code: code || undefined }),
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

      onCreate(data);

      setUrl("");
      setCode("");

      toast.success("Link created successfully!");

    } catch (err: any) {
      setError("Something went wrong");
      toast.error("Something went wrong!");
    } finally {
      setLoading(false);
    }
  }


  return (
    <form onSubmit={handleSubmit} className="bg-white p-4 rounded-xl shadow-sm border md:w-1/2 w-full mx-auto">
      <h2 className="text-lg font-bold mb-3 text-center">Create Short Link</h2>

      <input
        className="border rounded-lg w-full p-2 mb-3"
        placeholder="https://example.com"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
      />

      <input
        className="border rounded-lg w-full p-2 mb-3"
        placeholder="Custom code (optional)"
        value={code}
        onChange={(e) => setCode(e.target.value)}
      />

      {error && <p className="text-red-600 text-sm mb-2">{error}</p>}

      <div className="flex justify-center">
        <button
          disabled={loading}
          className={clsx(
            "px-2 py-2 rounded font-medium w-1/2",
            loading ? "opacity-60 bg-gray-300" : "bg-blue-500 text-white"
          )}
        >
          {loading ? (
            <div className="flex items-center gap-2  justify-center">
              <span>Creating..</span>
              <span className="inline-block h-4 w-4 border-b-2 border-white border-t-transparent rounded-full animate-spin"></span>
            </div>
          ) : (
            "Create"
          )}
        </button>
      </div>
    </form>
  )
}
