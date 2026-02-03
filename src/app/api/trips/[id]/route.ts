import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET /api/trips/[id] - Get a single trip
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const trip = await prisma.trip.findUnique({
      where: { id },
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
    const { id } = await params;
    const body = await request.json();
    const { name, destination, startDate, endDate, notes, guests, budgetEnabled, budgetAmount } = body;

    // Check if trip exists
    const existingTrip = await prisma.trip.findUnique({
      where: { id },
    });

    if (!existingTrip) {
      return NextResponse.json({ error: "Trip not found" }, { status: 404 });
    }

    // Validation
    if (!name || !destination || !startDate || !endDate) {
      return NextResponse.json(
        { error: "Name, destination, start date, and end date are required" },
        { status: 400 }
      );
    }

    const trip = await prisma.trip.update({
      where: { id },
      data: {
        name,
        destination,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        notes: notes || null,
        guests: guests || [],
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
    const { id } = await params;

    // Check if trip exists
    const existingTrip = await prisma.trip.findUnique({
      where: { id },
    });

    if (!existingTrip) {
      return NextResponse.json({ error: "Trip not found" }, { status: 404 });
    }

    // Delete trip (cascades to reservations, members, expenses)
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
