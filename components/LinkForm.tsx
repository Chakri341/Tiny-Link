"use client"

import { useState } from "react";
import clsx from "clsx";

export default function LinkForm() {
  const [url, setUrl] = useState("")
  const [code, setCode] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)

    if (!url.startsWith("http://") && !url.startsWith("https://")) {
      setError("URL must start with http:// or https://")
      setLoading(false)
      return
    }

    if (code && !/^[A-Za-z0-9]{6,8}$/.test(code)) {
      setError("Code must be 6–8 characters and only letters or numbers.")
      setLoading(false)
      return
    }

    try {
      const res = await fetch("/api/links", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url, code: code || undefined }),
      })

      const data = await res.json()

      if (res.status === 409) {
        setError("Code already exists")
        setLoading(false)
        return;
      }

      if (!res.ok) {
        setError(data.error || "Failed to create link")
        setLoading(false)
        return;
      }

      // const shortUrl = `${window.location.origin}/${data.code}`
      // alert(`Short URL created:\n${shortUrl}`)

      setUrl("");
      setCode("");
      setLoading(false);
      window.location.reload()
    } catch (err: any) {
      setError(err.message || "Something went wrong")
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-sm border w-1/2 mx-auto">
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
            "px-4 py-2 rounded font-medium w-full",
            loading ? "opacity-60 bg-gray-300" : "bg-blue-500 text-white"
          )}
        >
          {loading ? "Creating…" : "Create"}
        </button>
      </div>


    </form>
  )
}
