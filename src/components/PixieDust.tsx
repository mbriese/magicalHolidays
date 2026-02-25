"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import {
  getRandomPixieDust,
  categoryConfig,
  type PixieDustItem,
} from "@/data/pixieDust";

export default function PixieDust() {
  const [isOpen, setIsOpen] = useState(false);
  const [pixieDust, setPixieDust] = useState<PixieDustItem | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);

  const handleClick = () => {
    setIsAnimating(true);
    // Small delay for the sparkle animation before showing content
    setTimeout(() => {
      setPixieDust(getRandomPixieDust());
      setIsOpen(true);
      setIsAnimating(false);
    }, 300);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleNewSurprise = () => {
    setPixieDust(getRandomPixieDust());
  };

  // Close on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
    };
    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
    }
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen]);

  const config = pixieDust ? categoryConfig[pixieDust.category] : null;

  return (
    <>
      {/* Pixie Dust Button */}
      <button
        onClick={handleClick}
        className={`
          relative flex items-center gap-1.5 px-3 py-1.5 
          bg-linear-to-r from-purple-500/20 to-pink-500/20 
          hover:from-purple-500/30 hover:to-pink-500/30
          border border-purple-300/50 dark:border-purple-500/50
          rounded-full text-sm font-medium
          text-purple-700 dark:text-purple-300
          transition-all duration-300 
          hover:scale-105 hover:shadow-lg hover:shadow-purple-500/20
          ${isAnimating ? "animate-pulse scale-110" : ""}
        `}
        title="Click for a Disney surprise!"
      >
        <span className={`text-base ${isAnimating ? "animate-spin" : "animate-pulse"}`}>
          🔮
        </span>
        <span className="hidden sm:inline">Pixie Dust</span>
        
        {/* Sparkle effects */}
        <span className="absolute -top-1 -right-1 text-xs animate-ping">✨</span>
      </button>

      {/* Modal — portalled to body so it escapes the header's backdrop-blur stacking context */}
      {isOpen && createPortal(
        <div
          className="fixed inset-0 z-100 flex items-center justify-center p-4"
          onClick={handleClose}
        >
          {/* Backdrop with sparkles */}
          <div className="absolute inset-0 bg-midnight-900/60 backdrop-blur-sm">
            {[...Array(12)].map((_, i) => (
              <span
                key={i}
                className="absolute text-xl animate-float-drift opacity-60"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 2}s`,
                  animationDuration: `${3 + Math.random() * 2}s`,
                }}
              >
                ✨
              </span>
            ))}
          </div>

          {/* Modal Content */}
          <div
            className="relative w-full max-w-md transform animate-scale-in"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="absolute -top-8 left-1/2 -translate-x-1/2 text-4xl animate-bounce">
              🪄
            </div>

            <div className="bg-linear-to-br from-white to-purple-50 dark:from-midnight-700 dark:to-purple-900/30 rounded-2xl shadow-2xl shadow-purple-500/20 overflow-hidden border border-purple-200 dark:border-purple-700">
              {/* Header */}
              <div className="bg-linear-to-r from-purple-600 to-pink-500 px-6 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{config?.emoji}</span>
                    <span className="text-white font-semibold">
                      {config?.label}
                    </span>
                  </div>
                  <button
                    onClick={handleClose}
                    className="text-white/70 hover:text-white transition-colors"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="px-6 py-5">
                <h3 className="text-xl font-serif font-bold text-midnight-700 dark:text-white mb-3">
                  {pixieDust?.title}
                </h3>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                  {pixieDust?.content}
                </p>

                {pixieDust?.location && (
                  <div className="mt-4 inline-flex items-center gap-2 px-3 py-1.5 bg-purple-100 dark:bg-purple-900/30 rounded-full text-sm text-purple-700 dark:text-purple-300">
                    <span>📍</span>
                    <span>{pixieDust.location}</span>
                  </div>
                )}

                {pixieDust?.source && (
                  <p className="mt-4 text-sm text-slate-500 dark:text-slate-400 italic">
                    — {pixieDust.source}
                  </p>
                )}
              </div>

              {/* Footer */}
              <div className="px-6 py-4 bg-purple-50 dark:bg-midnight-800/50 flex items-center justify-between">
                <button
                  onClick={handleNewSurprise}
                  className="flex items-center gap-2 text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 font-medium transition-colors"
                >
                  <span className="text-lg">✨</span>
                  More Magic
                </button>
                <button
                  onClick={handleClose}
                  className="px-4 py-2 bg-linear-to-r from-purple-600 to-pink-500 text-white rounded-lg font-medium hover:from-purple-700 hover:to-pink-600 transition-all hover:scale-105"
                >
                  Got it!
                </button>
              </div>
            </div>

            <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
              <span className="text-xl animate-twinkle" style={{ animationDelay: "0s" }}>⭐</span>
              <span className="text-xl animate-twinkle" style={{ animationDelay: "0.3s" }}>✨</span>
              <span className="text-xl animate-twinkle" style={{ animationDelay: "0.6s" }}>⭐</span>
            </div>
          </div>
        </div>,
        document.body,
      )}
    </>
  );
}
