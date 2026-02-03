"use client";

import Link from "next/link";
import Badge from "./Badge";
import { BadgeWithProgress, badgeProgressColors } from "@/types";

interface BadgeShowcaseProps {
  badges: BadgeWithProgress[];
  recentlyEarned?: BadgeWithProgress[];
}

export default function BadgeShowcase({ badges, recentlyEarned = [] }: BadgeShowcaseProps) {
  const earnedBadges = badges.filter((b) => b.earnedAt != null);
  const inProgressBadges = badges
    .filter((b) => b.earnedAt == null && (b.userProgress || 0) > 0)
    .sort((a, b) => {
      const progressA = ((a.userProgress || 0) / a.threshold) * 100;
      const progressB = ((b.userProgress || 0) / b.threshold) * 100;
      return progressB - progressA;
    })
    .slice(0, 3);

  // Get most recent earned badges
  const latestEarned = recentlyEarned.length > 0 
    ? recentlyEarned 
    : earnedBadges
        .filter((b) => b.earnedAt)
        .sort((a, b) => new Date(b.earnedAt!).getTime() - new Date(a.earnedAt!).getTime())
        .slice(0, 3);

  return (
    <div className="card-magical p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🎖️</span>
          <h2 className="text-lg font-bold text-[#1F2A44] dark:text-[#E5E5E5]">
            Achievements
          </h2>
        </div>
        <Link
          href="/badges"
          className="text-sm text-[#1F2A44] hover:text-[#FFB957] dark:text-[#FFB957] dark:hover:text-[#ffd175] font-medium"
        >
          View all →
        </Link>
      </div>

      {/* Stats row */}
      <div className="flex items-center gap-4 mb-5 p-3 bg-[#FAF4EF] dark:bg-slate-800 rounded-lg">
        <div className="flex items-center gap-2">
          <span className="text-xl">🏆</span>
          <div>
            <p className="text-2xl font-bold text-[#1F2A44] dark:text-[#FFB957]">
              {earnedBadges.length}
            </p>
            <p className="text-xs text-gray-600 dark:text-gray-400">Earned</p>
          </div>
        </div>
        <div className="w-px h-10 bg-[#E5E5E5] dark:bg-slate-600" />
        <div className="flex items-center gap-2">
          <span className="text-xl">⏳</span>
          <div>
            <p className="text-2xl font-bold text-amber-600 dark:text-amber-400">
              {inProgressBadges.length}
            </p>
            <p className="text-xs text-gray-600 dark:text-gray-400">In Progress</p>
          </div>
        </div>
        <div className="w-px h-10 bg-[#E5E5E5] dark:bg-slate-600" />
        <div className="flex items-center gap-2">
          <span className="text-xl">🎯</span>
          <div>
            <p className="text-2xl font-bold text-gray-600 dark:text-gray-300">
              {badges.length - earnedBadges.length}
            </p>
            <p className="text-xs text-gray-600 dark:text-gray-400">Remaining</p>
          </div>
        </div>
      </div>

      {/* Recently Earned */}
      {latestEarned.length > 0 && (
        <div className="mb-5">
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
            <span>✨</span> Recently Earned
          </h3>
          <div className="flex gap-4 justify-center">
            {latestEarned.map((badge) => (
              <Badge
                key={badge.id}
                badge={badge}
                earned={true}
                earnedAt={badge.earnedAt}
                size="sm"
              />
            ))}
          </div>
        </div>
      )}

      {/* In Progress */}
      {inProgressBadges.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
            <span>🚀</span> Almost There
          </h3>
          <div className="space-y-2">
            {inProgressBadges.map((badge) => {
              const progressPercent = Math.round(
                ((badge.userProgress || 0) / badge.threshold) * 100
              );

              return (
                <div
                  key={badge.id}
                  className="flex items-center gap-3 p-2 rounded-lg bg-gray-50 dark:bg-slate-800"
                >
                  <span className="text-xl">{badge.icon}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-800 dark:text-gray-200 truncate">
                      {badge.name}
                    </p>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-1.5 bg-gray-200 dark:bg-slate-700 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${badgeProgressColors[badge.rarity]}`}
                          style={{ width: `${progressPercent}%` }}
                        />
                      </div>
                      <span className="text-xs text-gray-500 whitespace-nowrap">
                        {badge.userProgress}/{badge.threshold}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Empty state */}
      {earnedBadges.length === 0 && inProgressBadges.length === 0 && (
        <div className="text-center py-4">
          <span className="text-3xl mb-2 block">🌟</span>
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            Start your adventure to earn badges!
          </p>
          <p className="text-[#1F2A44] dark:text-[#FFB957] text-xs mt-1">
            Create a trip or add reservations to begin
          </p>
        </div>
      )}
    </div>
  );
}

