import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth";

// GET /api/trips/[id] - Get a single trip
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getAuthUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    const trip = await prisma.trip.findUnique({
      where: { id, ownerId: user.id },
      include: {
        _count: {
          select: { reservations: true, members: true, expenses: true },
        },
        reservations: {
          orderBy: { startDateTime: "asc" },
        },
      },
    });

    if (!trip) {
      return NextResponse.json({ error: "Trip not found" }, { status: 404 });
    }

    return NextResponse.json(trip);
  } catch (error) {
    console.error("Error fetching trip:", error);
    return NextResponse.json(
      { error: "Failed to fetch trip" },
      { status: 500 }
    );
  }
}

// PUT /api/trips/[id] - Update a trip
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getAuthUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const { name, destination, startDate, endDate, notes, guests, guestDetails, budgetEnabled, budgetAmount } = body;

    const existingTrip = await prisma.trip.findUnique({
      where: { id, ownerId: user.id },
    });

    if (!existingTrip) {
      return NextResponse.json({ error: "Trip not found" }, { status: 404 });
    }

    if (!name || !destination || !startDate || !endDate) {
      return NextResponse.json(
        { error: "Name, destination, start date, and end date are required" },
        { status: 400 }
      );
    }

    const details = Array.isArray(guestDetails) ? guestDetails : null;
    const guestNames = details && details.length > 0
      ? details.map((g: { firstName?: string; lastName?: string }) => `${(g.firstName ?? "").trim()} ${(g.lastName ?? "").trim()}`.trim()).filter(Boolean)
      : (details && details.length === 0) ? [] : (guests ?? existingTrip.guests);

    const trip = await prisma.trip.update({
      where: { id },
      data: {
        name,
        destination,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        notes: notes || null,
        guests: guestNames,
        ...(details !== undefined && { guestDetails: details }),
        budgetEnabled: budgetEnabled ?? existingTrip.budgetEnabled,
        budgetAmount: budgetEnabled && budgetAmount ? parseFloat(budgetAmount) : null,
      },
    });

    return NextResponse.json(trip);
  } catch (error) {
    console.error("Error updating trip:", error);
    return NextResponse.json(
      { error: "Failed to update trip" },
      { status: 500 }
    );
  }
}

// DELETE /api/trips/[id] - Delete a trip
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getAuthUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    const existingTrip = await prisma.trip.findUnique({
      where: { id, ownerId: user.id },
    });

    if (!existingTrip) {
      return NextResponse.json({ error: "Trip not found" }, { status: 404 });
    }

    await prisma.trip.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting trip:", error);
    return NextResponse.json(
      { error: "Failed to delete trip" },
      { status: 500 }
    );
  }
}
