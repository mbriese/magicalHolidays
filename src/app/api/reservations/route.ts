import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET /api/reservations - Fetch reservations (optionally by tripId)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const tripId = searchParams.get("tripId");

    const reservations = await prisma.reservation.findMany({
      where: tripId ? { tripId } : undefined,
      orderBy: { startDateTime: "asc" },
      include: {
        trip: {
          select: { name: true },
        },
      },
    });

    return NextResponse.json(reservations);
  } catch (error) {
    console.error("Error fetching reservations:", error);
    return NextResponse.json(
      { error: "Failed to fetch reservations" },
      { status: 500 }
    );
  }
}

// POST /api/reservations - Create a new reservation
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      tripId,
      type,
      title,
      startDateTime,
      endDateTime,
      location,
      confirmationNumber,
      notes,
      guests,
      guestCount,
    } = body;

    // Validation
    if (!tripId || !type || !title || !startDateTime || !endDateTime) {
      return NextResponse.json(
        { error: "Trip, type, title, start date, and end date are required" },
        { status: 400 }
      );
    }

    // Validate reservation type
    const validTypes = ["PARK", "RIDE", "HOTEL", "CAR", "FLIGHT"];
    if (!validTypes.includes(type)) {
      return NextResponse.json(
        { error: "Invalid reservation type" },
        { status: 400 }
      );
    }

    // Verify trip exists
    const trip = await prisma.trip.findUnique({
      where: { id: tripId },
    });

    if (!trip) {
      return NextResponse.json(
        { error: "Trip not found" },
        { status: 404 }
      );
    }

    const reservation = await prisma.reservation.create({
      data: {
        tripId,
        type,
        title,
        startDateTime: new Date(startDateTime),
        endDateTime: new Date(endDateTime),
        location: location || null,
        confirmationNumber: confirmationNumber || null,
        notes: notes || null,
        guests: guests || [],
        guestCount: guestCount || null,
      },
    });

    return NextResponse.json(reservation, { status: 201 });
  } catch (error) {
    console.error("Error creating reservation:", error);
    return NextResponse.json(
      { error: "Failed to create reservation" },
      { status: 500 }
    );
  }
}
