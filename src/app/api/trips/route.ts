import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth";

// GET /api/trips - Fetch all trips for the authenticated user
export async function GET() {
  try {
    const user = await getAuthUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const trips = await prisma.trip.findMany({
      where: { ownerId: user.id },
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
    const user = await getAuthUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { name, destination, startDate, endDate, notes, guests, guestDetails, budgetEnabled, budgetAmount } = body;

    if (!name || !destination || !startDate || !endDate) {
      return NextResponse.json(
        { error: "Name, destination, start date, and end date are required" },
        { status: 400 }
      );
    }

    const existingTrips = await prisma.trip.findMany({
      where: { ownerId: user.id },
      select: { name: true, startDate: true, endDate: true },
    });

    const duplicateName = existingTrips.some(
      (t) => t.name.trim().toLowerCase() === name.trim().toLowerCase()
    );
    if (duplicateName) {
      return NextResponse.json(
        { error: `You already have a trip named "${name}". Please choose a different name.` },
        { status: 409 }
      );
    }

    const details = Array.isArray(guestDetails) ? guestDetails : null;
    const guestNames = details?.length
      ? details.map((g: { firstName?: string; lastName?: string }) => `${(g.firstName ?? "").trim()} ${(g.lastName ?? "").trim()}`.trim()).filter(Boolean)
      : guests || [];

    const trip = await prisma.trip.create({
      data: {
        name,
        destination,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        notes: notes || null,
        guests: guestNames,
        guestDetails: details ?? undefined,
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
