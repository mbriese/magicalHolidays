import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth";

// GET /api/newsletter/subscribe - subscription status for current user (logged-in only)
export async function GET() {
  try {
    const user = await getAuthUser();
    if (!user?.email) {
      return NextResponse.json({ subscribed: false });
    }
    const record = await prisma.newsletterSubscriber.findUnique({
      where: { email: user.email.toLowerCase() },
    });
    return NextResponse.json({ subscribed: !!record });
  } catch (error) {
    console.error("Newsletter status error:", error);
    return NextResponse.json({ subscribed: false });
  }
}

// POST /api/newsletter/subscribe - public; supports guests and logged-in users
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";

    if (!email) {
      return NextResponse.json(
        { error: "Email is required." },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Please enter a valid email address." },
        { status: 400 }
      );
    }

    const user = await getAuthUser();

    await prisma.newsletterSubscriber.upsert({
      where: { email },
      create: {
        email,
        userId: user?.id ?? null,
      },
      update: {
        subscribedAt: new Date(),
        userId: user?.id ?? undefined,
      },
    });

    return NextResponse.json({ message: "Subscribed successfully." }, { status: 201 });
  } catch (error) {
    console.error("Newsletter subscribe error:", error);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
