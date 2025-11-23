// "use client";

// import { useEffect, useState } from "react";
// import Link from "next/link";
// import { toast } from "sonner";
// import LinkForm from "./LinkForm";
// import { LinkItem, LinksTableProps } from "@/lib/types";

// export default function LinksTable({
//   initialLinks,
//   pageSize,
//   initialHasMore,
// }: LinksTableProps) {
//   const [items, setItems] = useState<LinkItem[]>(initialLinks);
//   const [filter, setFilter] = useState("");
//   const [origin, setOrigin] = useState("");
//   const [page, setPage] = useState(1);
//   const [hasMore, setHasMore] = useState(initialHasMore);
//   const [loadingPage, setLoadingPage] = useState(false);
//   const [deleting, setDeleting] = useState<string | null>(null);
//   const [copiedCode, setCopiedCode] = useState<string | null>(null);

//   const [sortBy, setSortBy] = useState<"code" | "clicks" | "lastClicked">("lastClicked");
//   const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");

//   useEffect(() => {
//     setOrigin(window.location.origin);
//   }, []);

//   const addLink = (newLink: LinkItem) => {
//     setItems(prev => [newLink, ...prev]);
//   };

//   const filtered = items.filter(
//     l =>
//       l.code.toLowerCase().includes(filter.toLowerCase()) ||
//       l.url.toLowerCase().includes(filter.toLowerCase())
//   );

//   async function goToPage(newPage: number) {
//     setLoadingPage(true);
//     try {
//       const res = await fetch(`/api/links?page=${newPage}&limit=${pageSize}`);
//       if (!res.ok) return toast.error("Failed to load page");

//       const data = await res.json();
//       setItems(data.links);
//       setPage(newPage);
//       setHasMore(data.hasMore);
//     } catch {
//       toast.error("Failed to load page");
//     } finally {
//       setLoadingPage(false);
//     }
//   }

//   function copyToClipboard(text: string, code: string) {
//     navigator.clipboard.writeText(text);
//     setCopiedCode(code);
//     setTimeout(() => setCopiedCode(null), 1500);
//   }

//   async function onDelete(code: string) {
//     setDeleting(code);
//     const previous = items;
//     setItems(prev => prev.filter(l => l.code !== code));

//     try {
//       const res = await fetch(`/api/links/${code}`, { method: "DELETE" });
//       if (!res.ok) {
//         setItems(previous);
//         toast.error("Failed to delete link");
//       } else {
//         toast.success("Link deleted successfully");
//       }
//     } catch {
//       setItems(previous);
//       toast.error("Failed to delete link");
//     } finally {
//       setDeleting(null);
//     }
//   }

//   function handleSort(column: "code" | "clicks" | "lastClicked") {
//     if (sortBy === column) {
//       setSortDir(sortDir === "asc" ? "desc" : "asc");
//     } else {
//       setSortBy(column);
//       setSortDir("asc");
//     }
//   }

//   const sorted = [...filtered].sort((a, b) => {
//     let x: any = a[sortBy];
//     let y: any = b[sortBy];

//     // date compare
//     if (sortBy === "lastClicked") {
//       x = a.lastClicked ? new Date(a.lastClicked).getTime() : 0;
//       y = b.lastClicked ? new Date(b.lastClicked).getTime() : 0;
//     }

//     if (sortDir === "asc") return x > y ? 1 : -1;
//     return x > y ? -1 : 1;
//   });

//   return (
//     <div className="grid grid-cols-1 md:grid-cols-4 gap-4 h-[85vh]">
//       {/* FORM */}
//       <div className="col-span-1 bg-white rounded-xl shadow-sm border  self-start">
//         <LinkForm onCreate={addLink} />
//       </div>

//       {/* TABLE */}
//       <div className="col-span-3 bg-white rounded-xl shadow-sm border flex flex-col p-4 overflow-hidden">

//         {/* Search */}
//         <input
//           className="border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100 rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-blue-500 focus:outline-none"
//           placeholder="Search by code or URL"
//           value={filter}
//           onChange={(e) => setFilter(e.target.value)}
//         />

//         <div className="flex-1 overflow-y-auto">
//           <table className="min-w-full text-sm ">
//             <thead className="sticky top-0 bg-gray-100 border-b z-10">
//               <tr className="text-left text-gray-700 font-semibold">
//                 <th
//                   className={`py-3 px-4 cursor-pointer select-none ${sortBy === "code" ? "text-blue-700" : ""
//                     }`}
//                   onClick={() => handleSort("code")}
//                 >
//                   Code {sortBy === "code" && (sortDir === "asc" ? "↑" : "↓")}
//                 </th>
//                 <th className="py-3 px-4">Short URL</th>
//                 <th className="py-3 px-4">URL</th>
//                 <th
//                   className={`py-3 px-4 cursor-pointer select-none ${sortBy === "clicks" ? "text-blue-700" : ""
//                     }`}
//                   onClick={() => handleSort("clicks")}
//                 >
//                   Clicks {sortBy === "clicks" && (sortDir === "asc" ? "↑" : "↓")}
//                 </th>

//                 <th
//                   className={`py-3 px-4 cursor-pointer select-none ${sortBy === "lastClicked" ? "text-blue-700" : ""
//                     }`}
//                   onClick={() => handleSort("lastClicked")}
//                 >
//                   Last Clicked {sortBy === "lastClicked" && (sortDir === "asc" ? "↑" : "↓")}
//                 </th>

//                 <th className="py-3 px-4 text-right">Actions</th>
//               </tr>
//             </thead>
//             <tbody>
//               {loadingPage ? (
//                 Array.from({ length: 10 }).map((_, i) => (
//                   <tr key={`sk-${i}`} className="animate-pulse">
//                     <td className="py-3 px-4">
//                       <div className="h-3  bg-gray-300 rounded"></div>
//                     </td>
//                     <td className="py-3 px-4">
//                       <div className="h-3  bg-gray-300 rounded"></div>
//                     </td>
//                     <td className="py-3 px-4">
//                       <div className="h-3  bg-gray-300 rounded"></div>
//                     </td>
//                     <td className="py-3 px-4">
//                       <div className="h-3  bg-gray-300 rounded"></div>
//                     </td>
//                     <td className="py-3 px-4">
//                       <div className="h-3  bg-gray-300 rounded"></div>
//                     </td>
//                     <td className="py-3 px-4 text-right">
//                       <div className="h-3  bg-gray-300 rounded"></div>
//                     </td>
//                   </tr>
//                 ))
//               ) : filtered.length === 0 ? (
//                 <tr>
//                   <td colSpan={6} className="text-center py-6 text-gray-500 italic">
//                     No links found
//                   </td>
//                 </tr>
//               ) : (
//                 sorted.map(l => {
//                   const shortUrl = `${origin}/${l.code}`;
//                   return (
//                     <tr key={l.code} className="border-b hover:bg-gray-50 transition">
//                       <td className="py-3 px-4">
//                         <Link href={`/code/${l.code}`} className="text-blue-600 font-medium hover:underline">
//                           {l.code}
//                         </Link>
//                       </td>

//                       <td className="py-3 px-4">
//                         <button
//                           onClick={() => copyToClipboard(shortUrl, l.code)}
//                           className="text-gray-600 hover:text-black text-xs border px-2 py-1 rounded transition"
//                         >
//                           {copiedCode === l.code ? "Copied!" : "Copy"}
//                         </button>
//                       </td>

//                       <td className="py-3 px-4 max-w-[350px] truncate">
//                         <a href={l.url} target="_blank" className="hover:underline">
//                           {l.url}
//                         </a>
//                       </td>

//                       <td className="py-3 px-4">{l.clicks}</td>

//                       <td className="py-3 px-4">
//                         {l.lastClicked ? new Date(l.lastClicked).toLocaleString() : "-"}
//                       </td>

//                       <td className="py-3 px-4 text-right">
//                         <button
//                           onClick={() => onDelete(l.code)}
//                           disabled={deleting === l.code}
//                           className="text-red-600 hover:text-red-700 font-medium disabled:opacity-50 transition"
//                         >
//                           {deleting === l.code ? "Deleting…" : "Delete"}
//                         </button>
//                       </td>
//                     </tr>
//                   );
//                 })
//               )}
//             </tbody>
//           </table>
//         </div>


//         {/* Pagination Footer */}
//         <div className="flex items-center justify-between py-3 border-t text-sm text-gray-700">
//           <button
//             disabled={page === 1 || loadingPage}
//             onClick={() => goToPage(page - 1)}
//             className="px-3 py-1 rounded border hover:bg-gray-100 disabled:opacity-50 shadow-md"
//           >
//             ← Previous
//           </button>

//           <span className="text-xs">
//             Page {page} {hasMore ? "" : " (last page)"}
//           </span>

//           <button
//             disabled={!hasMore || loadingPage}
//             onClick={() => goToPage(page + 1)}
//             className="px-3 py-1 rounded border hover:bg-gray-100 disabled:opacity-50 shadow-md"
//           >
//             Next →
//           </button>
//         </div>

//       </div>
//     </div>
//   );
// }

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import LinkForm from "./LinkForm";
import { LinkItem, LinksTableProps } from "@/lib/types";
import AnalyticsChart from "./AnalyticsChart";

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

  const [sortBy, setSortBy] = useState<"code" | "clicks" | "lastClicked">("lastClicked");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");

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
    const prev = items;
    setItems(prev => prev.filter(l => l.code !== code));

    try {
      const res = await fetch(`/api/links/${code}`, { method: "DELETE" });
      if (!res.ok) {
        setItems(prev);
        toast.error("Failed to delete");
      } else {
        toast.success("Link deleted");
      }
    } catch {
      setItems(prev);
      toast.error("Failed to delete");
    } finally {
      setDeleting(null);
    }
  }

  function handleSort(column: "code" | "clicks" | "lastClicked") {
    if (sortBy === column) setSortDir(sortDir === "asc" ? "desc" : "asc");
    else {
      setSortBy(column);
      setSortDir("asc");
    }
  }

  const sorted = [...filtered].sort((a, b) => {
    let x: any = a[sortBy];
    let y: any = b[sortBy];

    if (sortBy === "lastClicked") {
      x = a.lastClicked ? new Date(a.lastClicked).getTime() : 0;
      y = b.lastClicked ? new Date(b.lastClicked).getTime() : 0;
    }

    if (sortDir === "asc") return x > y ? 1 : -1;
    return x > y ? -1 : 1;
  });

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 h-[85vh]">

      {/* FORM */}
      <div className="col-span-1 rounded-xl shadow-sm border  dark:bg-slate-800 dark:border-slate-700 self-start">
       <div className="flex flex-col gap-3">
        <LinkForm onCreate={addLink} />
        <AnalyticsChart/>
       </div>
      </div>

      {/* TABLE */}
      <div className="col-span-3 flex flex-col rounded-xl shadow-sm border bg-white dark:bg-slate-800 dark:border-slate-700 px-4 py-2 overflow-hidden">

        {/* Search */}
        <input
          className="border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100 rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-blue-500 focus:outline-none mb-3"
          placeholder="Search by code or URL"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        />

        <div className="flex-1 overflow-y-auto">
          <table className="min-w-full text-sm">
            <thead className="sticky top-0 z-10 bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-200 border-b dark:border-slate-600">
              <tr>
                {[
                  { label: "Code", col: "code" },
                  { label: "Clicks", col: "clicks" },
                  { label: "Last Clicked", col: "lastClicked" },
                ].map(({ label, col }) => (
                  <th
                    key={col}
                    className="py-3 px-4 cursor-pointer select-none"
                    onClick={() => handleSort(col as any)}
                  >
                    <span className={sortBy === col ? "text-blue-600 dark:text-blue-400 text-center" : "text-center"}>
                      {label} {sortBy === col && (sortDir === "asc" ? "↑" : "↓")}
                    </span>
                  </th>
                ))}
                <th className="py-3 px-4 text-center">URL</th>
                <th className="py-3 px-4 text-center">Actions</th>
              </tr>
            </thead>

            <tbody>
              {loadingPage ? (
                Array.from({ length: 8 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td colSpan={5} className="py-3 px-4">
                      <div className="h-3 w-full bg-gray-300 dark:bg-slate-600 rounded" />
                    </td>
                  </tr>
                ))
              ) : sorted.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-6 text-center text-gray-500 dark:text-gray-300">
                    No links found
                  </td>
                </tr>
              ) : (
                sorted.map(l => {
                  const shortUrl = `${origin}/${l.code}`;
                  return (
                    <tr key={l.code} className="border-b dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-700 transition">
                      <td className="py-3 px-4 text-center">
                        <Link href={`/code/${l.code}`} className="text-blue-600 dark:text-blue-400 hover:underline">
                          {l.code}
                        </Link>
                      </td>

                      <td className="py-3 px-4 text-center">{l.clicks}</td>

                      <td className="py-3 px-4 text-center">
                        {l.lastClicked ? new Date(l.lastClicked).toLocaleString() : "-"}
                      </td>

                      <td className="py-3 px-4 max-w-[350px] truncate">
                        <a href={l.url} target="_blank" className="hover:underline text-gray-600 dark:text-gray-300 text-center">
                          {l.url}
                        </a>
                      </td>

                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => copyToClipboard(shortUrl, l.code)}
                          className="mr-3 border px-2 py-1 rounded text-xs text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-slate-600 transition w-20"
                        >
                          {copiedCode === l.code ? "Copied!" : "Copy"}
                        </button>

                        <button
                          onClick={() => onDelete(l.code)}
                          disabled={deleting === l.code}
                          className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 disabled:opacity-50 transition"
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

        {/* Pagination */}
        <div className="flex items-center justify-between py-2 border-t dark:border-slate-700 text-sm text-gray-700 dark:text-gray-300">
          <button
            disabled={page === 1 || loadingPage}
            onClick={() => goToPage(page - 1)}
            // className="px-3 py-1 rounded border dark:border-slate-600 hover:bg-gray-100 dark:hover:bg-slate-600 disabled:opacity-50"
            className="bg-blue-600 hover:bg-blue-700 text-white py-1 px-2 rounded-lg font-medium transition shadow disabled:opacity-60 disabled:cursor-not-allowed dark:shadow-none">
            ← Previous
          </button>

          <span className="text-xs">
            Page {page} {hasMore ? "" : "(last page)"}
          </span>

          <button
            disabled={!hasMore || loadingPage}
            onClick={() => goToPage(page + 1)}
            className="bg-blue-600 hover:bg-blue-700 text-white py-1 px-2 rounded-lg font-medium transition shadow disabled:opacity-60 disabled:cursor-not-allowed dark:shadow-none">
            Next →
          </button>
        </div>
      </div>
    </div>
  );
}
