import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth";

interface RouteParams {
  params: Promise<{ id: string }>;
}

// GET /api/reservations/[id] - Fetch a single reservation
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const user = await getAuthUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    const reservation = await prisma.reservation.findFirst({
      where: { id, userId: user.id },
      include: {
        trip: {
          select: { name: true, destination: true },
        },
      },
    });

    if (!reservation) {
      return NextResponse.json(
        { error: "Reservation not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(reservation);
  } catch (error) {
    console.error("Error fetching reservation:", error);
    return NextResponse.json(
      { error: "Failed to fetch reservation" },
      { status: 500 }
    );
  }
}

// PUT /api/reservations/[id] - Update a reservation
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const user = await getAuthUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const {
      tripId: bodyTripId,
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

    const existing = await prisma.reservation.findFirst({
      where: { id, userId: user.id },
    });

    if (!existing) {
      return NextResponse.json(
        { error: "Reservation not found" },
        { status: 404 }
      );
    }

    // Validate reservation type if provided
    if (type) {
      const validTypes = ["PARK", "RIDE", "HOTEL", "CAR", "FLIGHT"];
      if (!validTypes.includes(type)) {
        return NextResponse.json(
          { error: "Invalid reservation type" },
          { status: 400 }
        );
      }
    }

    const updateData: Record<string, unknown> = {
      ...(type && { type }),
      ...(title && { title }),
      ...(startDateTime && { startDateTime: new Date(startDateTime) }),
      ...(endDateTime && { endDateTime: new Date(endDateTime) }),
      ...(location !== undefined && { location: location || null }),
      ...(confirmationNumber !== undefined && { confirmationNumber: confirmationNumber || null }),
      ...(notes !== undefined && { notes: notes || null }),
      ...(guests !== undefined && { guests: guests || [] }),
      ...(guestCount !== undefined && { guestCount: guestCount || null }),
    };
    if (bodyTripId !== undefined) {
      if (bodyTripId === null || bodyTripId === "") {
        updateData.tripId = null;
      } else {
        const trip = await prisma.trip.findFirst({ where: { id: bodyTripId, ownerId: user.id } });
        if (!trip) return NextResponse.json({ error: "Trip not found" }, { status: 404 });
        updateData.tripId = bodyTripId;
      }
    }

    const reservation = await prisma.reservation.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json(reservation);
  } catch (error) {
    console.error("Error updating reservation:", error);
    return NextResponse.json(
      { error: "Failed to update reservation" },
      { status: 500 }
    );
  }
}

// DELETE /api/reservations/[id] - Delete a reservation
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const user = await getAuthUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    const existing = await prisma.reservation.findFirst({
      where: { id, userId: user.id },
    });

    if (!existing) {
      return NextResponse.json(
        { error: "Reservation not found" },
        { status: 404 }
      );
    }

    await prisma.reservation.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting reservation:", error);
    return NextResponse.json(
      { error: "Failed to delete reservation" },
      { status: 500 }
    );
  }
}
