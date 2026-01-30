import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// PUT /api/trips/[id]/budget - Update trip budget settings
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { budgetEnabled, budgetAmount, budgetCurrency } = body;

    const trip = await prisma.trip.update({
      where: { id },
      data: {
        budgetEnabled: budgetEnabled ?? false,
        budgetAmount: budgetEnabled && budgetAmount ? parseFloat(budgetAmount) : null,
        budgetCurrency: budgetCurrency || "USD",
      },
    });

    return NextResponse.json(trip);
  } catch (error) {
    console.error("Error updating budget:", error);
    return NextResponse.json(
      { error: "Failed to update budget" },
      { status: 500 }
    );
  }
}

// GET /api/trips/[id]/budget - Get trip budget with expense summary
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const trip = await prisma.trip.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        budgetEnabled: true,
        budgetAmount: true,
        budgetCurrency: true,
        expenses: {
          orderBy: { date: "desc" },
        },
      },
    });

    if (!trip) {
      return NextResponse.json({ error: "Trip not found" }, { status: 404 });
    }

    const totalSpent = trip.expenses.reduce((sum, e) => sum + e.amount, 0);
    const paidExpenses = trip.expenses.filter((e) => e.isPaid);
    const plannedExpenses = trip.expenses.filter((e) => !e.isPaid);

    // Calculate category breakdown
    const categoryTotals = trip.expenses.reduce((acc, expense) => {
      acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
      return acc;
    }, {} as Record<string, number>);

    return NextResponse.json({
      ...trip,
      summary: {
        totalSpent,
        totalPaid: paidExpenses.reduce((sum, e) => sum + e.amount, 0),
        totalPlanned: plannedExpenses.reduce((sum, e) => sum + e.amount, 0),
        remaining: trip.budgetAmount ? trip.budgetAmount - totalSpent : null,
        percentUsed: trip.budgetAmount
          ? Math.round((totalSpent / trip.budgetAmount) * 100)
          : null,
        categoryTotals,
        expenseCount: trip.expenses.length,
      },
    });
  } catch (error) {
    console.error("Error fetching budget:", error);
    return NextResponse.json(
      { error: "Failed to fetch budget" },
      { status: 500 }
    );
  }
}
