"use client";

import { useEffect } from "react";
import { useServiceWorker } from "@/hooks/useServiceWorker";
import OfflineIndicator from "./OfflineIndicator";

interface PWAProviderProps {
  children: React.ReactNode;
}

export default function PWAProvider({ children }: PWAProviderProps) {
  const { isUpdateAvailable, updateServiceWorker } = useServiceWorker();

  return (
    <>
      {children}
      
      {/* Offline indicator */}
      <OfflineIndicator />

      {/* Update available banner */}
      {isUpdateAvailable && (
        <div className="fixed top-20 left-4 right-4 md:left-auto md:right-4 md:w-80 z-50 animate-fade-in">
          <div className="bg-purple-100 dark:bg-purple-900/50 border border-purple-300 dark:border-purple-700 rounded-lg shadow-lg p-4">
            <div className="flex items-start gap-3">
              <div className="text-purple-600 dark:text-purple-400">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-purple-800 dark:text-purple-200">
                  Update available!
                </p>
                <p className="text-xs text-purple-600 dark:text-purple-400 mt-1">
                  A new version of Magical Holidays is ready.
                </p>
                <button
                  onClick={updateServiceWorker}
                  className="mt-2 text-sm font-medium text-purple-700 dark:text-purple-300 hover:text-purple-900 dark:hover:text-purple-100 underline"
                >
                  Update now
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
