"use client";

import { useEffect, useState } from "react";

export default function OfflinePage() {
  const [isOnline, setIsOnline] = useState(false);

  useEffect(() => {
    setIsOnline(navigator.onLine);

    const handleOnline = () => {
      setIsOnline(true);
      // Redirect to dashboard when back online
      window.location.href = "/dashboard";
    };

    window.addEventListener("online", handleOnline);
    return () => window.removeEventListener("online", handleOnline);
  }, []);

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        {/* Offline icon */}
        <div className="mb-6">
          <div className="w-24 h-24 mx-auto bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center">
            <svg
              className="w-12 h-12 text-purple-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M18.364 5.636a9 9 0 010 12.728m0 0l-2.829-2.829m2.829 2.829L21 21M15.536 8.464a5 5 0 010 7.072m0 0l-2.829-2.829m-4.243 2.829a4.978 4.978 0 01-1.414-2.83m-1.414 5.658a9 9 0 01-2.167-9.238m7.824 2.167a1 1 0 111.414 1.414m-1.414-1.414L3 3"
              />
            </svg>
          </div>
        </div>

        {/* Title */}
        <h1 className="font-serif text-3xl font-bold text-purple-900 dark:text-white mb-4">
          You&apos;re Offline
        </h1>

        {/* Description */}
        <p className="text-slate-600 dark:text-slate-400 mb-6">
          Don&apos;t worry! Your trip data is saved locally. You can still view your 
          reservations and plans while offline.
        </p>

        {/* Actions */}
        <div className="space-y-3">
          <a
            href="/dashboard"
            className="btn-magical w-full block text-center"
          >
            View Cached Dashboard
          </a>
          <button
            onClick={() => window.location.reload()}
            className="btn-outline w-full"
          >
            Try Again
          </button>
        </div>

        {/* Status indicator */}
        <div className="mt-8 flex items-center justify-center gap-2 text-sm text-slate-500">
          <div
            className={`w-2 h-2 rounded-full ${
              isOnline ? "bg-green-500" : "bg-amber-500 animate-pulse"
            }`}
          />
          {isOnline ? "Connected" : "Waiting for connection..."}
        </div>
      </div>
    </div>
  );
}
