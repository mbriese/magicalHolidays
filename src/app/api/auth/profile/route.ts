import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth";

export async function PUT(request: NextRequest) {
  try {
    const user = await getAuthUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { firstName, lastName, title, displayPreference } = body;

    const preference = displayPreference === "formal" ? "formal" : "casual";
    const fullName = [firstName, lastName].filter(Boolean).join(" ").trim() || null;

    await prisma.user.update({
      where: { id: user.id },
      data: {
        name: fullName,
        firstName: firstName != null ? String(firstName).trim() || null : undefined,
        lastName: lastName != null ? String(lastName).trim() || null : undefined,
        title: title != null ? String(title).trim() || null : undefined,
        displayPreference: preference,
      },
    });

    return NextResponse.json({ message: "Profile updated successfully" });
  } catch (error) {
    console.error("Profile update error:", error);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const user = await getAuthUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const dbUser = await prisma.user.findUnique({
      where: { id: user.id },
      select: { firstName: true, lastName: true, title: true, displayPreference: true },
    });

    if (!dbUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(dbUser);
  } catch (error) {
    console.error("Profile fetch error:", error);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
