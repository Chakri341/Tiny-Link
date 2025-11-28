"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Something went wrong");
        return;
      }

      router.push("/");
    } catch (err) {
      console.error(err);
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className=" flex justify-center px-4">
      <form
        className="w-full max-w-md space-y-4 border rounded-lg p-6"
        onSubmit={handleSubmit}
      >
        <h1 className="text-2xl font-semibold text-center">Welcome back</h1>

        {error && (
          <p className="text-sm text-red-500 text-center">{error}</p>
        )}

        <div className="space-y-1">
          <label className="block text-sm font-medium">Email</label>
          <input
            className="w-full border rounded px-3 py-2 text-sm"
            type="email"
            value={form.email}
            onChange={(e) =>
              setForm((f) => ({ ...f, email: e.target.value }))
            }
          />
        </div>

        <div className="space-y-1">
          <label className="block text-sm font-medium">Password</label>
          <input
            className="w-full border rounded px-3 py-2 text-sm"
            type="password"
            value={form.password}
            onChange={(e) =>
              setForm((f) => ({ ...f, password: e.target.value }))
            }
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-md py-2 text-sm font-medium bg-black text-white dark:bg-white dark:text-black hover:opacity-85 transition"
        >
          {loading ? "Logging in..." : "Log in"}
        </button>

        <p className="text-xs text-center">
          Dont have an Account?{" "}
          <a href="/register" className="underline">
            Register
          </a>
        </p>
      </form>
    </div>
  );
}
