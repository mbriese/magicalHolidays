import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth";

// GET /api/badges - Fetch all badges with user progress
export async function GET() {
  try {
    const user = await getAuthUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get all badges
    const badges = await prisma.badge.findMany({
      orderBy: [
        { category: "asc" },
        { rarity: "asc" },
        { name: "asc" },
      ],
    });

    // Get user's badge progress
    const userBadges = await prisma.userBadge.findMany({
      where: { userId: user.id },
    });

    // Merge badge data with user progress
    const badgesWithProgress = badges.map((badge) => {
      const userBadge = userBadges.find((ub) => ub.badgeId === badge.id);
      return {
        ...badge,
        userProgress: userBadge?.progress || 0,
        earnedAt: userBadge?.earnedAt || null,
      };
    });

    return NextResponse.json(badgesWithProgress);
  } catch (error) {
    console.error("Error fetching badges:", error);
    return NextResponse.json(
      { error: "Failed to fetch badges" },
      { status: 500 }
    );
  }
}

// POST /api/badges/check - Check and update badge progress for user
export async function POST(request: NextRequest) {
  try {
    const user = await getAuthUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Calculate user stats
    const [tripCount, reservationCount, parkDays] = await Promise.all([
      prisma.trip.count({ where: { ownerId: user.id } }),
      prisma.reservation.count({
        where: { userId: user.id },
      }),
      prisma.reservation.count({
        where: {
          userId: user.id,
          type: "PARK",
        },
      }),
    ]);

    // Get unique reservation types used
    const reservationTypes = await prisma.reservation.findMany({
      where: { userId: user.id },
      select: { type: true },
      distinct: ["type"],
    });

    // Get all badges
    const badges = await prisma.badge.findMany();

    // Define stat mappings for badges
    const statMappings: Record<string, number> = {
      // Adventure badges (trips)
      "first-trip": tripCount,
      "seasoned-traveler": tripCount,
      "adventure-master": tripCount,
      "world-explorer": tripCount,
      
      // Experience badges (reservations)
      "first-reservation": reservationCount,
      "planner-pro": reservationCount,
      "reservation-master": reservationCount,
      "legendary-planner": reservationCount,
      
      // Park day badges
      "park-hopper": parkDays,
      "park-enthusiast": parkDays,
      "park-champion": parkDays,
      "park-legend": parkDays,
      
      // Explorer badges (variety)
      "variety-seeker": reservationTypes.length,
      "complete-explorer": reservationTypes.length,
    };

    const newlyEarned: string[] = [];

    for (const badge of badges) {
      const progress = statMappings[badge.name.toLowerCase().replace(/\s+/g, "-")] || 0;
      const isEarned = progress >= badge.threshold;

      const existing = await prisma.userBadge.findUnique({
        where: {
          userId_badgeId: { userId: user.id, badgeId: badge.id },
        },
      });

      const wasEarned = existing?.earnedAt != null;

      const userBadge = await prisma.userBadge.upsert({
        where: {
          userId_badgeId: { userId: user.id, badgeId: badge.id },
        },
        create: {
          userId: user.id,
          badgeId: badge.id,
          progress,
          earnedAt: isEarned ? new Date() : null,
        },
        update: {
          progress,
          earnedAt: isEarned && !wasEarned ? new Date() : undefined,
        },
      });

      if (isEarned && !wasEarned) {
        newlyEarned.push(badge.name);
      }
    }

    return NextResponse.json({
      success: true,
      newlyEarned,
      stats: {
        trips: tripCount,
        reservations: reservationCount,
        parkDays,
        reservationTypes: reservationTypes.length,
      },
    });
  } catch (error) {
    console.error("Error checking badges:", error);
    return NextResponse.json(
      { error: "Failed to check badges" },
      { status: 500 }
    );
  }
}
