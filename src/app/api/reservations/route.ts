import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth";

// GET /api/reservations - Fetch reservations (optionally by tripId)
export async function GET(request: NextRequest) {
  try {
    const user = await getAuthUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const tripId = searchParams.get("tripId");

    const reservations = await prisma.reservation.findMany({
      where: tripId
        ? { tripId, userId: user.id }
        : { userId: user.id },
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
    const user = await getAuthUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

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

    if (!type || !title || !startDateTime || !endDateTime) {
      return NextResponse.json(
        { error: "Type, title, start date, and end date are required" },
        { status: 400 }
      );
    }

    const validTypes = ["PARK", "RIDE", "HOTEL", "CAR", "FLIGHT"];
    if (!validTypes.includes(type)) {
      return NextResponse.json(
        { error: "Invalid reservation type" },
        { status: 400 }
      );
    }

    if (tripId) {
      const trip = await prisma.trip.findUnique({
        where: { id: tripId, ownerId: user.id },
      });
      if (!trip) {
        return NextResponse.json(
          { error: "Trip not found" },
          { status: 404 }
        );
      }
    }

    const reservation = await prisma.reservation.create({
      data: {
        userId: user.id,
        tripId: tripId || null,
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
