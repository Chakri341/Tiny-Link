"use client";

import { useState } from "react";
import {useRouter } from "next/navigation";

export default function RegisterClient() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
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
      router.refresh();
    } catch (err) {
      console.error(err);
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  }


  return (
    <div className=" flex  justify-center px-4">
      <form
        className="w-full max-w-md space-y-4 border rounded-lg p-6"
        onSubmit={handleSubmit}
      >
        <h1 className="text-2xl font-semibold text-center">Create account</h1>

        {error && (
          <p className="text-sm text-red-500 text-center">{error}</p>
        )}

        <div className="space-y-1">
          <label className="block text-sm font-medium">Name</label>
          <input
            className="w-full border rounded px-3 py-2 text-sm"
            value={form.name}
            onChange={(e) =>
              setForm((f) => ({ ...f, name: e.target.value }))
            }
          />
        </div>

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
          className="w-full rounded-md py-2 text-sm font-medium  bg-black text-white dark:bg-white dark:text-black hover:opacity-85 transition"
        >
          {loading ? "Creating..." : "Sign up"}
        </button>

        <p className="text-xs text-center">
          Already have an account?{" "}
          <a href="/login" className="underline">
            Log in
          </a>
        </p>
      </form>
    </div>
  );
}

