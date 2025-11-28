"use client";

import React from "react";
import QRCode from "react-qr-code";

interface QRCodeModalProps {
  shortUrl: string;
  code: string;
  onClose: () => void;
}

export default function QRCodeModal({ shortUrl, code, onClose }: QRCodeModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 w-[320px] max-w-[90%] border border-gray-200 dark:border-slate-700">
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-semibold text-lg text-gray-900 dark:text-gray-100">
            QR Code – {code}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-800 dark:text-gray-300 dark:hover:text-white text-xl leading-none"
            aria-label="Close"
          >
            X
          </button>
        </div>

        <div className="flex flex-col items-center gap-3">
          <div className="bg-white p-3 rounded-lg shadow-sm">
            <QRCode value={shortUrl} size={180} />
          </div>
          <p className="text-xs text-center text-gray-600 dark:text-gray-300 break-all">
            {shortUrl}
          </p>
         
        </div>
      </div>
    </div>
  );
}
