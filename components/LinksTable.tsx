"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import LinkForm from "./LinkForm";
import { LinkItem, LinksTableProps } from "@/lib/types";

export default function LinksTable({
  initialLinks,
  pageSize,
  initialHasMore,
}: LinksTableProps) {
  const [items, setItems] = useState<LinkItem[]>(initialLinks);
  const [filter, setFilter] = useState("");
  const [origin, setOrigin] = useState("");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(initialHasMore);
  const [loadingPage, setLoadingPage] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  useEffect(() => {
    setOrigin(window.location.origin);
  }, []);

  const addLink = (newLink: LinkItem) => {
    setItems(prev => [newLink, ...prev]);
  };

  const filtered = items.filter(
    l =>
      l.code.toLowerCase().includes(filter.toLowerCase()) ||
      l.url.toLowerCase().includes(filter.toLowerCase())
  );

  async function goToPage(newPage: number) {
    setLoadingPage(true);
    try {
      const res = await fetch(`/api/links?page=${newPage}&limit=${pageSize}`);
      if (!res.ok) return toast.error("Failed to load page");

      const data = await res.json();
      setItems(data.links);
      setPage(newPage);
      setHasMore(data.hasMore);
    } catch {
      toast.error("Failed to load page");
    } finally {
      setLoadingPage(false);
    }
  }

  function copyToClipboard(text: string, code: string) {
    navigator.clipboard.writeText(text);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 1500);
  }

  async function onDelete(code: string) {
    setDeleting(code);
    const previous = items;
    setItems(prev => prev.filter(l => l.code !== code));

    try {
      const res = await fetch(`/api/links/${code}`, { method: "DELETE" });
      if (!res.ok) {
        setItems(previous);
        toast.error("Failed to delete link");
      } else {
        toast.success("Link deleted successfully");
      }
    } catch {
      setItems(previous);
      toast.error("Failed to delete link");
    } finally {
      setDeleting(null);
    }
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 h-[85vh]">
      {/* FORM */}
      <div className="col-span-1 bg-white rounded-xl shadow-sm border  self-start">
        <LinkForm onCreate={addLink} />
      </div>

      {/* TABLE */}
      <div className="col-span-3 bg-white rounded-xl shadow-sm border flex flex-col p-4 overflow-hidden">

        {/* Search */}
        <input
          className="border border-gray-300 rounded-lg px-3 py-2 mb-4 w-full focus:ring-2 focus:ring-blue-500 outline-none"
          placeholder="Search by code or URL"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        />

        <div className="flex-1 overflow-y-auto">
          <table className="min-w-full text-sm ">
            <thead className="sticky top-0 bg-gray-100 border-b z-10">
              <tr className="text-left text-gray-700 font-semibold">
                <th className="py-3 px-4">Code</th>
                <th className="py-3 px-4">Short URL</th>
                <th className="py-3 px-4">URL</th>
                <th className="py-3 px-4">Clicks</th>
                <th className="py-3 px-4">Last Clicked</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>

            <tbody>
              {loadingPage ? (
                Array.from({ length: 10 }).map((_, i) => (
                  <tr key={`sk-${i}`} className="animate-pulse">
                    <td className="py-3 px-4">
                      <div className="h-3  bg-gray-300 rounded"></div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="h-3  bg-gray-300 rounded"></div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="h-3  bg-gray-300 rounded"></div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="h-3  bg-gray-300 rounded"></div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="h-3  bg-gray-300 rounded"></div>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="h-3  bg-gray-300 rounded"></div>
                    </td>
                  </tr>
                ))
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-6 text-gray-500 italic">
                    No links found
                  </td>
                </tr>
              ) : (
                filtered.map(l => {
                  const shortUrl = `${origin}/${l.code}`;
                  return (
                    <tr key={l.code} className="border-b hover:bg-gray-50 transition">
                      <td className="py-3 px-4">
                        <Link href={`/code/${l.code}`} className="text-blue-600 font-medium hover:underline">
                          {l.code}
                        </Link>
                      </td>

                      <td className="py-3 px-4">
                        <button
                          onClick={() => copyToClipboard(shortUrl, l.code)}
                          className="text-gray-600 hover:text-black text-xs border px-2 py-1 rounded transition"
                        >
                          {copiedCode === l.code ? "Copied!" : "Copy"}
                        </button>
                      </td>

                      <td className="py-3 px-4 max-w-[350px] truncate">
                        <a href={l.url} target="_blank" className="hover:underline">
                          {l.url}
                        </a>
                      </td>

                      <td className="py-3 px-4">{l.clicks}</td>

                      <td className="py-3 px-4">
                        {l.lastClicked ? new Date(l.lastClicked).toLocaleString() : "-"}
                      </td>

                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => onDelete(l.code)}
                          disabled={deleting === l.code}
                          className="text-red-600 hover:text-red-700 font-medium disabled:opacity-50 transition"
                        >
                          {deleting === l.code ? "Deleting…" : "Delete"}
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>


        {/* Pagination Footer */}
        <div className="flex items-center justify-between py-3 border-t text-sm text-gray-700">
          <button
            disabled={page === 1 || loadingPage}
            onClick={() => goToPage(page - 1)}
            className="px-3 py-1 rounded border hover:bg-gray-100 disabled:opacity-50 shadow-md"
          >
            ← Previous
          </button>

          <span className="text-xs">
            Page {page} {hasMore ? "" : " (last page)"}
          </span>

          <button
            disabled={!hasMore || loadingPage}
            onClick={() => goToPage(page + 1)}
            className="px-3 py-1 rounded border hover:bg-gray-100 disabled:opacity-50 shadow-md"
          >
            Next →
          </button>
        </div>

      </div>
    </div>
  );
}
