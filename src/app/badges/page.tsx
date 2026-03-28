"use client";

import { useState, useEffect, useMemo } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { BadgeCollection, Badge } from "@/components/badges";
import type { BadgeWithProgress } from "@/types";
import { badgeProgressColors } from "@/types";

export default function BadgesPage() {
  const { data: session } = useSession();
  const [badges, setBadges] = useState<BadgeWithProgress[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchBadges() {
      try {
        await fetch("/api/badges", { method: "POST" });
        const res = await fetch("/api/badges");
        if (res.ok) {
          setBadges(await res.json());
        }
      } catch (err) {
        console.error("Error fetching badges:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchBadges();
  }, []);

  const earned = useMemo(() => badges.filter((b) => b.earnedAt != null), [badges]);

  const almostThere = useMemo(() => {
    return badges
      .filter((b) => b.earnedAt == null && (b.userProgress || 0) > 0)
      .sort((a, b) => {
        const pA = ((a.userProgress || 0) / a.threshold) * 100;
        const pB = ((b.userProgress || 0) / b.threshold) * 100;
        return pB - pA;
      });
  }, [badges]);

  const notStarted = useMemo(
    () => badges.filter((b) => b.earnedAt == null && (b.userProgress || 0) === 0),
    [badges]
  );

  const pageTitle = session?.user?.name
    ? `${session.user.name}'s Achievements`
    : "Your Achievements";

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <span className="text-5xl block mb-3 animate-bounce">🏆</span>
          <p className="text-slate-500 dark:text-slate-400">Loading achievements...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      {/* Page Header */}
      <div className="bg-linear-to-r from-[#1F2A44] to-midnight-600 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            href="/dashboard"
            className="text-sm text-[#E5E5E5]/70 hover:text-[#FFB957] transition-colors"
          >
            &larr; Back to Dashboard
          </Link>
          <h1 className="mt-3 font-serif text-3xl md:text-4xl font-bold text-white mb-2">
            {pageTitle}
          </h1>
          <p className="text-[#E5E5E5]">
            {earned.length} of {badges.length} badges earned — keep exploring to unlock more!
          </p>

          {/* Overall progress bar */}
          {badges.length > 0 && (
            <div className="mt-4 flex items-center gap-3 max-w-md">
              <div className="flex-1 h-3 bg-white/20 rounded-full overflow-hidden">
                <div
                  className="h-full bg-linear-to-r from-[#FFB957] to-[#F8AFA6] transition-all duration-700"
                  style={{ width: `${Math.round((earned.length / badges.length) * 100)}%` }}
                />
              </div>
              <span className="text-white font-bold text-sm">
                {Math.round((earned.length / badges.length) * 100)}%
              </span>
            </div>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Almost There section */}
        {almostThere.length > 0 && (
          <div className="card-magical p-6">
            <div className="flex items-center gap-3 mb-5">
              <span className="text-2xl">🚀</span>
              <div>
                <h2 className="text-xl font-bold text-[#1F2A44] dark:text-[#E5E5E5]">
                  Almost There!
                </h2>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  You&apos;re making progress on these — keep going!
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {almostThere.map((badge) => {
                const progress = badge.userProgress || 0;
                const percent = Math.round((progress / badge.threshold) * 100);

                return (
                  <div
                    key={badge.id}
                    className="flex items-center gap-4 p-4 rounded-xl bg-[#FAF4EF] dark:bg-slate-800/50 border border-[#E5E5E5] dark:border-slate-700"
                  >
                    <Badge
                      badge={badge}
                      earned={false}
                      progress={progress}
                      size="sm"
                      showDetails={false}
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-[#1F2A44] dark:text-[#E5E5E5] truncate">
                        {badge.name}
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mb-2 truncate">
                        {badge.requirement}
                      </p>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-500 ${badgeProgressColors[badge.rarity]}`}
                            style={{ width: `${percent}%` }}
                          />
                        </div>
                        <span className="text-xs font-medium text-slate-600 dark:text-slate-400 whitespace-nowrap">
                          {progress}/{badge.threshold}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Not started hint */}
        {notStarted.length > 0 && almostThere.length === 0 && earned.length === 0 && (
          <div className="card-magical p-8 text-center">
            <span className="text-5xl block mb-3">🌟</span>
            <h2 className="text-xl font-bold text-[#1F2A44] dark:text-[#E5E5E5] mb-2">
              Your adventure awaits!
            </h2>
            <p className="text-slate-600 dark:text-slate-400 mb-4">
              Create trips and add reservations to start earning badges.
            </p>
            <Link href="/trips/new" className="btn-gold inline-block">
              ✨ Create Your First Trip ✨
            </Link>
          </div>
        )}

        {/* Full badge collection */}
        <BadgeCollection badges={badges} title="All Achievements" />
      </div>
    </div>
  );
}
