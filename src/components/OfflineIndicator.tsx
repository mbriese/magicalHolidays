"use client";

import { useState, useEffect } from "react";
import { formatLastSync, getLastSyncTime } from "@/lib/offlineStorage";

interface OfflineIndicatorProps {
  className?: string;
}

export default function OfflineIndicator({ className = "" }: OfflineIndicatorProps) {
  const [isOnline, setIsOnline] = useState(true);
  const [lastSync, setLastSync] = useState<string>("Checking...");
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    // Set initial state
    setIsOnline(navigator.onLine);
    setShowBanner(!navigator.onLine);

    // Update last sync time
    const updateLastSync = async () => {
      const tripsSync = await getLastSyncTime("trips");
      setLastSync(formatLastSync(tripsSync));
    };
    updateLastSync();

    // Listen for online/offline events
    const handleOnline = () => {
      setIsOnline(true);
      setShowBanner(true);
      // Hide the "back online" banner after 3 seconds
      setTimeout(() => setShowBanner(false), 3000);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setShowBanner(true);
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    // Update sync time periodically
    const syncInterval = setInterval(updateLastSync, 30000);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
      clearInterval(syncInterval);
    };
  }, []);

  if (!showBanner && isOnline) {
    return null;
  }

  // Theme based on online status
  const theme = isOnline
    ? {
        container: "bg-green-100 dark:bg-green-900/50 border-green-300 dark:border-green-700",
        dot: "bg-green-500",
        text: "text-green-800 dark:text-green-200",
        subtext: "text-green-600 dark:text-green-400",
        icon: "text-green-600 dark:text-green-400 hover:text-green-800 dark:hover:text-green-200",
        message: "Back online!",
      }
    : {
        container: "bg-amber-100 dark:bg-amber-900/50 border-amber-300 dark:border-amber-700",
        dot: "bg-amber-500 animate-pulse",
        text: "text-amber-800 dark:text-amber-200",
        subtext: "text-amber-600 dark:text-amber-400",
        icon: "text-amber-600 dark:text-amber-400",
        message: "You're offline",
      };

  return (
    <div
      className={`
        fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-80
        z-50 animate-fade-in
        ${className}
      `}
    >
      <div
        className={`
          flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg border
          ${theme.container}
        `}
      >
        {/* Status dot */}
        <div className={`w-3 h-3 rounded-full shrink-0 ${theme.dot}`} />

        {/* Status message */}
        <div className="flex-1 min-w-0">
          <p className={`text-sm font-medium ${theme.text}`}>
            {theme.message}
          </p>
          {!isOnline && (
            <p className={`text-xs truncate ${theme.subtext}`}>
              Viewing cached data • {lastSync}
            </p>
          )}
        </div>

        {/* Dismiss button (online) / Offline icon */}
        {isOnline ? (
          <button
            onClick={() => setShowBanner(false)}
            className={theme.icon}
            aria-label="Dismiss"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        ) : (
          <div className={theme.icon}>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636a9 9 0 010 12.728m0 0l-2.829-2.829m2.829 2.829L21 21M15.536 8.464a5 5 0 010 7.072m0 0l-2.829-2.829m-4.243 2.829a4.978 4.978 0 01-1.414-2.83m-1.414 5.658a9 9 0 01-2.167-9.238m7.824 2.167a1 1 0 111.414 1.414m-1.414-1.414L3 3" />
            </svg>
          </div>
        )}
      </div>
    </div>
  );
}

