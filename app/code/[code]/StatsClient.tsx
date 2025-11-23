"use client"

import { toast } from "sonner";

export default function StatsClient({ link }: { link: any }) {
  return (
    <div className="max-w-2xl mx-auto py-5">
      <h1 className="text-3xl font-bold mb-2 text-gray-900">
        Link Statistics
      </h1>

      <div className="bg-white rounded-xl shadow-sm border p-6 space-y-5">

        {/* Short URL */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Short URL</p>
            <a
              href={`/${link.code}`}
              target="_blank"
              className="text-lg font-semibold text-blue-600 hover:underline"
            >
              {link.shortUrl}
            </a>
          </div>

          <button
            className="text-sm px-3 py-1 border rounded-lg hover:bg-gray-100"
            onClick={() =>{
               navigator.clipboard.writeText(link.shortUrl);
              toast.success("Link Copied successfully!")
            }}
          >
            Copy
          </button>
        </div>

        {/* Target URL */}
        <div>
          <p className="text-sm font-medium text-gray-600">Target URL</p>
          <a
            href={link.url}
            target="_blank"
            className="text-gray-900 break-words hover:underline"
          >
            {link.url}
          </a>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 gap-4 pt-4">
          <div className="bg-gray-50 border rounded-lg p-4">
            <p className="text-sm font-medium text-gray-500">Total Clicks</p>
            <p className="text-2xl font-bold text-gray-900">{link.clicks}</p>
          </div>

          <div className="bg-gray-50 border rounded-lg p-4">
            <p className="text-sm font-medium text-gray-500">Created At</p>
            <p className="text-gray-900">{new Date(link.createdAt).toLocaleString()}</p>
          </div>

          <div className="bg-gray-50 border rounded-lg p-4 col-span-2">
            <p className="text-sm font-medium text-gray-500">Last Clicked</p>
            <p className="text-gray-900">
              {link.lastClicked ? new Date(link.lastClicked).toLocaleString() : "-"}
            </p>
          </div>
        </div>
      </div>

      <div className="mt-6">
        <a
          href="/"
          className="text-blue-600 hover:underline text-sm font-medium"
        >
          ← Back to Dashboard
        </a>
      </div>
    </div>
  )
}
