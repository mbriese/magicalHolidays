import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth";

// GET /api/expenses?tripId=xxx - Get all expenses for a trip
export async function GET(request: NextRequest) {
  try {
    const user = await getAuthUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const tripId = searchParams.get("tripId");

    if (!tripId) {
      return NextResponse.json(
        { error: "Trip ID is required" },
        { status: 400 }
      );
    }

    const trip = await prisma.trip.findUnique({
      where: { id: tripId, ownerId: user.id },
    });
    if (!trip) {
      return NextResponse.json({ error: "Trip not found" }, { status: 404 });
    }

    const expenses = await prisma.expense.findMany({
      where: { tripId },
      orderBy: { date: "desc" },
    });

    // Also get the trip's budget info
    const trip = await prisma.trip.findUnique({
      where: { id: tripId },
      select: {
        id: true,
        budgetEnabled: true,
        budgetAmount: true,
        budgetCurrency: true,
      },
    });

    // Calculate totals by category
    const categoryTotals = expenses.reduce((acc, expense) => {
      acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
      return acc;
    }, {} as Record<string, number>);

    const totalSpent = expenses.reduce((sum, e) => sum + e.amount, 0);
    const paidExpenses = expenses.filter((e) => e.isPaid);
    const plannedExpenses = expenses.filter((e) => !e.isPaid);
    const totalPaid = paidExpenses.reduce((sum, e) => sum + e.amount, 0);
    const totalPlanned = plannedExpenses.reduce((sum, e) => sum + e.amount, 0);

    return NextResponse.json({
      expenses,
      budget: trip,
      summary: {
        totalSpent,
        totalPaid,
        totalPlanned,
        categoryTotals,
        remaining: trip?.budgetAmount ? trip.budgetAmount - totalSpent : null,
        percentUsed: trip?.budgetAmount
          ? Math.round((totalSpent / trip.budgetAmount) * 100)
          : null,
      },
    });
  } catch (error) {
    console.error("Error fetching expenses:", error);
    return NextResponse.json(
      { error: "Failed to fetch expenses" },
      { status: 500 }
    );
  }
}

// POST /api/expenses - Create a new expense
export async function POST(request: NextRequest) {
  try {
    const user = await getAuthUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { tripId, amount, description, category, date, notes, isPaid } = body;

    if (!tripId || !amount || !description || !category) {
      return NextResponse.json(
        { error: "Trip ID, amount, description, and category are required" },
        { status: 400 }
      );
    }

    const trip = await prisma.trip.findUnique({
      where: { id: tripId, ownerId: user.id },
    });

    if (!trip) {
      return NextResponse.json({ error: "Trip not found" }, { status: 404 });
    }

    const expense = await prisma.expense.create({
      data: {
        tripId,
        amount: parseFloat(amount),
        description,
        category,
        date: date ? new Date(date) : new Date(),
        notes: notes || null,
        isPaid: isPaid !== undefined ? isPaid : true,
      },
    });

    return NextResponse.json(expense, { status: 201 });
  } catch (error) {
    console.error("Error creating expense:", error);
    return NextResponse.json(
      { error: "Failed to create expense" },
      { status: 500 }
    );
  }
}
