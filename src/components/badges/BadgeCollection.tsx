"use client";

import { useState } from "react";
import Badge from "./Badge";
import {
  BadgeWithProgress,
  BadgeCategory,
  badgeCategoryLabels,
  badgeCategoryIcons,
} from "@/types";

interface BadgeCollectionProps {
  badges: BadgeWithProgress[];
  title?: string;
  showFilters?: boolean;
  compact?: boolean;
}

export default function BadgeCollection({
  badges,
  title = "Your Achievements",
  showFilters = true,
  compact = false,
}: BadgeCollectionProps) {
  const [selectedCategory, setSelectedCategory] = useState<BadgeCategory | "ALL">("ALL");
  const [showEarnedOnly, setShowEarnedOnly] = useState(false);

  const categories: (BadgeCategory | "ALL")[] = ["ALL", "ADVENTURE", "EXPERIENCE", "EXPLORER", "SPECIAL"];

  const filteredBadges = badges.filter((badge) => {
    const categoryMatch = selectedCategory === "ALL" || badge.category === selectedCategory;
    const earnedMatch = !showEarnedOnly || badge.earnedAt != null;
    return categoryMatch && earnedMatch;
  });

  const earnedCount = badges.filter((b) => b.earnedAt != null).length;
  const totalCount = badges.length;

  // Group badges by category for display
  const groupedBadges = filteredBadges.reduce((acc, badge) => {
    const category = badge.category;
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(badge);
    return acc;
  }, {} as Record<BadgeCategory, BadgeWithProgress[]>);

  return (
    <div className="card-magical p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <span className="text-3xl">🏆</span>
          <div>
            <h2 className="text-xl font-bold text-purple-900 dark:text-purple-100">
              {title}
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {earnedCount} of {totalCount} badges earned
            </p>
          </div>
        </div>

        {/* Progress bar */}
        <div className="hidden sm:flex items-center gap-3">
          <div className="w-32 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-linear-to-r from-purple-500 to-amber-500 transition-all duration-500"
              style={{ width: `${(earnedCount / totalCount) * 100}%` }}
            />
          </div>
          <span className="text-sm font-medium text-purple-600 dark:text-purple-400">
            {Math.round((earnedCount / totalCount) * 100)}%
          </span>
        </div>
      </div>

      {/* Filters */}
      {showFilters && (
        <div className="flex flex-wrap items-center gap-3 mb-6 pb-4 border-b border-purple-100 dark:border-slate-700">
          {/* Category filters */}
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`
                  px-3 py-1.5 rounded-full text-sm font-medium transition-all
                  ${selectedCategory === category
                    ? "bg-purple-600 text-white shadow-md"
                    : "bg-purple-100 dark:bg-slate-700 text-purple-700 dark:text-purple-300 hover:bg-purple-200 dark:hover:bg-slate-600"
                  }
                `}
              >
                {category === "ALL" ? "All" : (
                  <>
                    {badgeCategoryIcons[category]} {badgeCategoryLabels[category]}
                  </>
                )}
              </button>
            ))}
          </div>

          {/* Earned only toggle */}
          <label className="flex items-center gap-2 ml-auto cursor-pointer">
            <input
              type="checkbox"
              checked={showEarnedOnly}
              onChange={(e) => setShowEarnedOnly(e.target.checked)}
              className="w-4 h-4 rounded border-purple-300 text-purple-600 focus:ring-purple-500"
            />
            <span className="text-sm text-gray-600 dark:text-gray-400">
              Earned only
            </span>
          </label>
        </div>
      )}

      {/* Badge Grid */}
      {compact ? (
        // Compact view - single row
        <div className="flex flex-wrap gap-4 justify-center sm:justify-start">
          {filteredBadges.slice(0, 6).map((badge) => (
            <Badge
              key={badge.id}
              badge={badge}
              earned={badge.earnedAt != null}
              progress={badge.userProgress || 0}
              earnedAt={badge.earnedAt}
              size="sm"
              showDetails={false}
            />
          ))}
          {filteredBadges.length > 6 && (
            <div className="flex items-center justify-center w-16 h-16 rounded-full bg-purple-100 dark:bg-slate-700 text-purple-600 dark:text-purple-400 font-semibold">
              +{filteredBadges.length - 6}
            </div>
          )}
        </div>
      ) : (
        // Full view - grouped by category
        <div className="space-y-8">
          {Object.entries(groupedBadges).map(([category, categoryBadges]) => (
            <div key={category}>
              <h3 className="flex items-center gap-2 text-lg font-semibold text-purple-800 dark:text-purple-200 mb-4">
                <span>{badgeCategoryIcons[category as BadgeCategory]}</span>
                {badgeCategoryLabels[category as BadgeCategory]} Badges
                <span className="text-sm font-normal text-gray-500">
                  ({categoryBadges.filter(b => b.earnedAt != null).length}/{categoryBadges.length})
                </span>
              </h3>
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-6">
                {categoryBadges.map((badge) => (
                  <Badge
                    key={badge.id}
                    badge={badge}
                    earned={badge.earnedAt != null}
                    progress={badge.userProgress || 0}
                    earnedAt={badge.earnedAt}
                    size="md"
                  />
                ))}
              </div>
            </div>
          ))}

          {filteredBadges.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <span className="text-4xl mb-2 block">🔍</span>
              No badges found with current filters
            </div>
          )}
        </div>
      )}
    </div>
  );
}
