"use client";

import { Badge as BadgeType, badgeRarityColors, badgeRarityLabels } from "@/types";

interface BadgeProps {
  badge: BadgeType;
  earned: boolean;
  progress?: number;
  earnedAt?: Date | null;
  size?: "sm" | "md" | "lg";
  showDetails?: boolean;
}

export default function Badge({
  badge,
  earned,
  progress = 0,
  earnedAt,
  size = "md",
  showDetails = true,
}: BadgeProps) {
  const rarityStyle = badgeRarityColors[badge.rarity];
  const progressPercent = Math.min((progress / badge.threshold) * 100, 100);

  const sizeClasses = {
    sm: {
      container: "w-16 h-16",
      icon: "text-2xl",
      padding: "p-2",
    },
    md: {
      container: "w-20 h-20",
      icon: "text-3xl",
      padding: "p-3",
    },
    lg: {
      container: "w-24 h-24",
      icon: "text-4xl",
      padding: "p-4",
    },
  };

  const currentSize = sizeClasses[size];

  return (
    <div className="flex flex-col items-center gap-2 group">
      {/* Badge Icon */}
      <div
        className={`
          relative ${currentSize.container} ${currentSize.padding}
          rounded-full border-2 
          ${earned ? rarityStyle.bg : "bg-gray-200 dark:bg-gray-700"}
          ${earned ? rarityStyle.border : "border-gray-300 dark:border-gray-600"}
          ${earned && (badge.rarity === "RARE" || badge.rarity === "EPIC" || badge.rarity === "LEGENDARY") 
            ? `shadow-lg ${rarityStyle.glow}` 
            : ""}
          transition-all duration-300
          ${earned ? "hover:scale-110" : "opacity-50"}
          flex items-center justify-center
        `}
      >
        {/* Icon */}
        <span
          className={`
            ${currentSize.icon}
            ${earned ? "" : "grayscale"}
            transition-all duration-300
          `}
        >
          {badge.icon}
        </span>

        {/* Sparkle effect for legendary badges */}
        {earned && badge.rarity === "LEGENDARY" && (
          <div className="absolute inset-0 rounded-full animate-sparkle pointer-events-none">
            <span className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1 text-xs text-amber-400">✦</span>
            <span className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1 text-xs text-amber-400">✦</span>
            <span className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1 text-xs text-amber-400">✦</span>
            <span className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1 text-xs text-amber-400">✦</span>
          </div>
        )}

        {/* Progress ring for unearned badges */}
        {!earned && progress > 0 && (
          <svg
            className="absolute inset-0 w-full h-full -rotate-90"
            viewBox="0 0 100 100"
          >
            <circle
              cx="50"
              cy="50"
              r="46"
              fill="none"
              stroke="currentColor"
              strokeWidth="4"
              className="text-[#FFB957] dark:text-[#FFB957]/50"
              strokeDasharray={`${progressPercent * 2.89} 289`}
            />
          </svg>
        )}
      </div>

      {/* Badge Details */}
      {showDetails && (
        <div className="text-center max-w-[140px]">
          <h4
            className={`
              text-sm font-semibold leading-tight
              ${earned ? rarityStyle.text : "text-gray-400 dark:text-gray-500"}
            `}
          >
            {badge.name}
          </h4>
          
          {/* Rarity tag */}
          <span
            className={`
              text-xs px-2 py-0.5 rounded-full
              ${earned ? rarityStyle.bg : "bg-gray-100 dark:bg-gray-800"}
              ${earned ? rarityStyle.text : "text-gray-400"}
            `}
          >
            {badgeRarityLabels[badge.rarity]}
          </span>

          {/* Progress or earned date */}
          {!earned && progress > 0 && (
            <p className="text-xs text-gray-500 mt-1">
              {progress} / {badge.threshold}
            </p>
          )}
          {earned && earnedAt && (
            <p className="text-xs text-gray-500 mt-1">
              {new Date(earnedAt).toLocaleDateString()}
            </p>
          )}
        </div>
      )}

      {/* Tooltip on hover */}
      <div
        className={`
          absolute z-50 bottom-full mb-2 px-3 py-2
          bg-white dark:bg-slate-800 
          rounded-lg shadow-xl border border-[#E5E5E5] dark:border-slate-700
          opacity-0 group-hover:opacity-100 
          transition-opacity duration-200 pointer-events-none
          max-w-[200px] text-center
          hidden group-hover:block
        `}
      >
        <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
          {badge.name}
        </p>
        <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
          {badge.description}
        </p>
        <p className="text-xs text-[#1F2A44] dark:text-[#FFB957] mt-1 italic">
          {badge.requirement}
        </p>
      </div>
    </div>
  );
}

