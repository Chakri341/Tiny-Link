"use client";

import Image from "next/image";

interface ShareModalProps {
  shortUrl: string;
  onClose: () => void;
}

export default function ShareModal({ shortUrl, onClose }: ShareModalProps) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg w-[320px] text-center border dark:border-slate-700">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">
          Share Short Link
        </h3>

        <div className="flex justify-center gap-6 mb-4">
          <a href={`https://api.whatsapp.com/send?text=${shortUrl}`} target="_blank">
            <Image src="/whatsapp.png" alt="WhatsApp" width={34} height={34}
              className="hover:scale-110 transition cursor-pointer" />
          </a>

          <a href={`https://twitter.com/intent/tweet?url=${shortUrl}`} target="_blank">
            <Image src="/twitter.png" alt="X" width={34} height={34}
              className="hover:scale-110 transition cursor-pointer" />
          </a>

          <a href={`https://www.linkedin.com/sharing/share-offsite/?url=${shortUrl}`} target="_blank">
            <Image src="/linkedin.png" alt="LinkedIn" width={34} height={34}
              className="hover:scale-110 transition cursor-pointer" />
          </a>
        </div>

        <button
          onClick={onClose}
          className="mt-2 text-sm px-4 py-2 rounded bg-gray-200 dark:bg-slate-700 dark:text-gray-100 hover:bg-gray-300 dark:hover:bg-slate-600 transition"
        >
          Close
        </button>
      </div>
    </div>
  );
}
