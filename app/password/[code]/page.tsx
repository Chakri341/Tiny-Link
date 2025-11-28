"use client";

import { useState } from "react";

export default function PasswordPage({ params }: { params: { code: string } }) {
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch(`/api/password/verify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: params.code, password }),
      });

      const data = await res.json();
      if (!data.ok) {
        setError("Invalid password");
      } else {
        window.location.href = data.url;
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="h-[70vh] flex flex-col items-center justify-center text-center px-4">
      <h1 className="text-3xl font-bold mb-4">Password Required</h1>

      <p className="text-gray-600 mb-4">
        This short link is protected. Enter password to continue.
      </p>

      <form
        onSubmit={handleSubmit}
        className="bg-white dark:bg-slate-800 border dark:border-slate-700 p-6 rounded-xl shadow-sm w-full max-w-xs space-y-4"
      >
        {/* Password Input */}
        <div className="relative">
          <input
            type={show ? "text" : "password"}
            className="w-full px-3 py-2 border rounded-lg dark:bg-slate-700 dark:border-slate-600 
                       text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {/* 👁️ Eye Toggle */}
          <button
            type="button"
            onClick={() => setShow(!show)}
            className="absolute right-3 top-2.5 text-gray-600 dark:text-gray-300 hover:opacity-80"
          >
            {show ? "🙈" : "👁️"}
          </button>
        </div>

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <button
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg 
                     font-medium transition disabled:opacity-60"
        >
          {loading ? "Verifying..." : "Unlock"}
        </button>
      </form>
    </div>
  );
}
