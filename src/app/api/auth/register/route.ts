import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, password, firstName, lastName, title, preferredName, displayPreference } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 },
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: "Password must be at least 8 characters" },
        { status: 400 },
      );
    }

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "An account with this email already exists" },
        { status: 409 },
      );
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const fullName = name ?? ([firstName, lastName].filter(Boolean).join(" ").trim() || null);
    const preference = displayPreference === "preferredName" ? "preferredName" : "firstName";

    await prisma.user.create({
      data: {
        name: fullName || null,
        firstName: firstName ? String(firstName).trim() || null : null,
        lastName: lastName ? String(lastName).trim() || null : null,
        title: title ? String(title).trim() || null : null,
        preferredName: preferredName ? String(preferredName).trim() || null : null,
        displayPreference: preference,
        email,
        password: hashedPassword,
        favoriteCharacters: [],
      },
    });

    return NextResponse.json(
      { message: "Account created successfully" },
      { status: 201 },
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("Registration error:", error);
    return NextResponse.json(
      {
        error: process.env.NODE_ENV === "development" ? message : "Something went wrong. Please try again.",
      },
      { status: 500 },
    );
  }
}
