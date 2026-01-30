import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getOrCreateDemoUser } from "@/lib/user";

// GET /api/trips - Fetch all trips (for demo, no auth check)
export async function GET() {
  try {
    const trips = await prisma.trip.findMany({
      orderBy: { startDate: "asc" },
      include: {
        _count: {
          select: { reservations: true, members: true },
        },
      },
    });

    return NextResponse.json(trips);
  } catch (error) {
    console.error("Error fetching trips:", error);
    return NextResponse.json(
      { error: "Failed to fetch trips" },
      { status: 500 }
    );
  }
}

// POST /api/trips - Create a new trip
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, destination, startDate, endDate, notes, budgetEnabled, budgetAmount } = body;

    // Validation
    if (!name || !destination || !startDate || !endDate) {
      return NextResponse.json(
        { error: "Name, destination, start date, and end date are required" },
        { status: 400 }
      );
    }

    const user = await getOrCreateDemoUser();

    const trip = await prisma.trip.create({
      data: {
        name,
        destination,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        notes: notes || null,
        budgetEnabled: budgetEnabled || false,
        budgetAmount: budgetEnabled && budgetAmount ? parseFloat(budgetAmount) : null,
        ownerId: user.id,
      },
    });

    return NextResponse.json(trip, { status: 201 });
  } catch (error) {
    console.error("Error creating trip:", error);
    return NextResponse.json(
      { error: "Failed to create trip" },
      { status: 500 }
    );
  }
}
