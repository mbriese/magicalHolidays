"use client";

export function StatusMessage({ message, isError = true }: { message: string; isError?: boolean }) {
  if (!message) return null;
  return (
    <div
      className={`rounded-lg p-3 text-sm ${
        isError
          ? "bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400"
          : "bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-400"
      }`}
    >
      {message}
    </div>
  );
}
