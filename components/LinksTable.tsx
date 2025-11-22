"use client"

import { useEffect, useState } from "react"
import Link from "next/link"

export default function LinksTable({
  links,
}: {
  links: any[]
}) {
  const [filter, setFilter] = useState("")
  const [origin, setOrigin] = useState("");


  useEffect(() => {
    setOrigin(window.location.origin);
  }, []);


  const filtered = links.filter(
    (l) =>
      l.code.toLowerCase().includes(filter.toLowerCase()) ||
      l.url.toLowerCase().includes(filter.toLowerCase())
  )

  async function onDelete(code: string) {
    await fetch(`/api/links/${code}`, { method: "DELETE" })
    window.location.reload()
  }

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border">

      <p className="text-xs text-gray-600 mb-3">
        <span className="font-semibold text-gray-800">Note:</span> Reload the page to see updated statistics.
      </p>


      <input
        className="border border-gray-300 rounded-lg px-3 py-2 w-full mb-4 focus:ring-2 focus:ring-blue-500 focus:outline-none"
        placeholder="Search by code or URL"
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
      />

      <div className="overflow-x-auto max-h-56 overflow-y-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="bg-gray-50 text-left text-gray-700 font-semibold border-b">
              <th className="py-3 px-4">Code</th>
              <th className="py-3 px-4">Short URL</th>
              <th className="py-3 px-4">URL</th>
              <th className="py-3 px-4">Clicks</th>
              <th className="py-3 px-4">Last Clicked</th>
              <th className="py-3 px-4 text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {filtered.length === 0 && (
              <tr>
                <td colSpan={6} className="text-center py-6 text-gray-500 italic">
                  No links found
                </td>
              </tr>
            )}

            {filtered.map((l) => {
              const shortUrl = origin ? `${origin}/${l.code}` : "";

              return (
                <tr key={l.code} className="border-b hover:bg-gray-50 transition">
                  <td className="py-3 px-4">
                    <Link
                      href={`/code/${l.code}`}
                      className="text-blue-600 font-medium hover:underline"
                    >
                      {l.code}
                    </Link>
                  </td>

                  <td className="py-3 px-4">
                    <a
                      href={`/${l.code}`}
                      target="_blank"
                      className="text-blue-600 underline"
                    >
                      {shortUrl || `/${l.code}`}
                    </a>
                  </td>

                  <td className="py-3 px-4 max-w-[280px] truncate">
                    <a href={l.url} target="_blank" className="hover:underline">
                      {l.url}
                    </a>
                  </td>

                  <td className="py-3 px-4">{l.clicks}</td>

                  <td className="py-3 px-4">
                    {l.lastClicked
                      ? new Date(l.lastClicked).toLocaleString()
                      : "-"}
                  </td>

                  <td className="py-3 px-4">
                    <button
                      className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-4 py-2 rounded-lg shadow-sm transition-all duration-200 active:scale-95"
                      onClick={() => onDelete(l.code)}
                    >
                      Delete
                    </button>

                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
