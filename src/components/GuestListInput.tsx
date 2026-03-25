"use client";

import { useState } from "react";

export function GuestListInput({
  guests,
  onAdd,
  onRemove,
  placeholder = "Enter guest name...",
  label,
  compact = false,
}: {
  guests: string[];
  onAdd: (name: string) => void;
  onRemove: (name: string) => void;
  placeholder?: string;
  label?: string;
  compact?: boolean;
}) {
  const [name, setName] = useState("");

  const handleAdd = () => {
    const trimmed = name.trim();
    if (trimmed && !guests.includes(trimmed)) {
      onAdd(trimmed);
      setName("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAdd();
    }
  };

  return (
    <div>
      {label && (
        <label className="block text-xs text-slate-600 dark:text-slate-400 mb-1">{label}</label>
      )}
      <div className="flex gap-2">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className={`input-magical flex-1 ${compact ? "text-sm" : ""}`}
        />
        <button
          type="button"
          onClick={handleAdd}
          disabled={!name.trim()}
          className={`rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors ${
            compact
              ? "px-3 py-1 bg-[#FFB957]/30 dark:bg-[#FFB957]/20 text-[#1F2A44] dark:text-[#FFB957] text-sm hover:bg-[#FFB957]/50 dark:hover:bg-[#FFB957]/30"
              : "px-4 py-2 bg-[#1F2A44]/10 dark:bg-[#1F2A44]/30 text-[#1F2A44] dark:text-[#FFB957] hover:bg-[#FFB957]/30 dark:hover:bg-[#FFB957]/30"
          }`}
        >
          Add
        </button>
      </div>
      {guests.length > 0 && (
        <div className={`flex flex-wrap gap-${compact ? "1" : "2"} mt-${compact ? "2" : "3"}`}>
          {guests.map((guest) => (
            <span
              key={guest}
              className={`inline-flex items-center gap-1 rounded-full ${
                compact
                  ? "px-2 py-0.5 bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs"
                  : "px-3 py-1 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 text-sm"
              }`}
            >
              {!compact && "👤 "}{guest}
              <button
                type="button"
                onClick={() => onRemove(guest)}
                className="text-slate-400 hover:text-red-500 transition-colors"
              >
                {compact ? "×" : (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                )}
              </button>
            </span>
          ))}
        </div>
      )}
      {!compact && (
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Press Enter or click Add to add guests
        </p>
      )}
    </div>
  );
}
