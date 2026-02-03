"use client";

import { useState, useEffect } from "react";

type ExpenseCategory =
  | "TICKETS"
  | "HOTEL"
  | "FOOD"
  | "TRANSPORTATION"
  | "SOUVENIRS"
  | "ENTERTAINMENT"
  | "TIPS"
  | "OTHER";

interface Expense {
  id: string;
  amount: number;
  description: string;
  category: ExpenseCategory;
  date: string;
  notes?: string;
  isPaid: boolean;
}

interface BudgetSummary {
  totalSpent: number;
  totalPaid: number;
  totalPlanned: number;
  remaining: number | null;
  percentUsed: number | null;
  categoryTotals: Record<string, number>;
}

interface Trip {
  id: string;
  name: string;
  budgetEnabled: boolean;
  budgetAmount: number | null;
  budgetCurrency: string;
}

interface BudgetTrackerProps {
  tripId?: string;
  onExpenseAdded?: () => void;
}

const categoryInfo: Record<ExpenseCategory, { icon: string; label: string; color: string }> = {
  TICKETS: { icon: "🎟️", label: "Tickets", color: "bg-[#FAF4EF]0" },
  HOTEL: { icon: "🏨", label: "Hotel", color: "bg-blue-500" },
  FOOD: { icon: "🍽️", label: "Food & Dining", color: "bg-orange-500" },
  TRANSPORTATION: { icon: "🚗", label: "Transportation", color: "bg-green-500" },
  SOUVENIRS: { icon: "🛍️", label: "Souvenirs", color: "bg-pink-500" },
  ENTERTAINMENT: { icon: "🎭", label: "Entertainment", color: "bg-indigo-500" },
  TIPS: { icon: "💵", label: "Tips", color: "bg-yellow-500" },
  OTHER: { icon: "📦", label: "Other", color: "bg-slate-500" },
};

const categories: ExpenseCategory[] = [
  "TICKETS",
  "HOTEL",
  "FOOD",
  "TRANSPORTATION",
  "SOUVENIRS",
  "ENTERTAINMENT",
  "TIPS",
  "OTHER",
];

export default function BudgetTracker({ tripId, onExpenseAdded }: BudgetTrackerProps) {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [selectedTripId, setSelectedTripId] = useState<string>(tripId || "");
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [summary, setSummary] = useState<BudgetSummary | null>(null);
  const [budget, setBudget] = useState<{ enabled: boolean; amount: number | null }>({
    enabled: false,
    amount: null,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showAddExpense, setShowAddExpense] = useState(false);
  const [showBudgetSetup, setShowBudgetSetup] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);

  // Form state
  const [expenseForm, setExpenseForm] = useState({
    amount: "",
    description: "",
    category: "FOOD" as ExpenseCategory,
    date: new Date().toISOString().split("T")[0],
    notes: "",
    isPaid: true,
  });

  const [budgetForm, setBudgetForm] = useState({
    enabled: false,
    amount: "",
  });

  // Fetch trips on mount
  useEffect(() => {
    fetchTrips();
  }, []);

  // Fetch expenses when trip changes
  useEffect(() => {
    if (selectedTripId) {
      fetchExpenses();
    }
  }, [selectedTripId]);

  const fetchTrips = async () => {
    try {
      const response = await fetch("/api/trips");
      if (response.ok) {
        const data = await response.json();
        setTrips(data);
        if (!tripId && data.length > 0) {
          setSelectedTripId(data[0].id);
        }
      }
    } catch (error) {
      console.error("Error fetching trips:", error);
    }
  };

  const fetchExpenses = async () => {
    if (!selectedTripId) return;
    setIsLoading(true);
    try {
      const response = await fetch(`/api/expenses?tripId=${selectedTripId}`);
      if (response.ok) {
        const data = await response.json();
        setExpenses(data.expenses);
        setSummary(data.summary);
        setBudget({
          enabled: data.budget?.budgetEnabled || false,
          amount: data.budget?.budgetAmount || null,
        });
        setBudgetForm({
          enabled: data.budget?.budgetEnabled || false,
          amount: data.budget?.budgetAmount?.toString() || "",
        });
      }
    } catch (error) {
      console.error("Error fetching expenses:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveBudget = async () => {
    try {
      const response = await fetch(`/api/trips/${selectedTripId}/budget`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          budgetEnabled: budgetForm.enabled,
          budgetAmount: budgetForm.amount ? parseFloat(budgetForm.amount) : null,
        }),
      });

      if (response.ok) {
        setBudget({
          enabled: budgetForm.enabled,
          amount: budgetForm.amount ? parseFloat(budgetForm.amount) : null,
        });
        setShowBudgetSetup(false);
        fetchExpenses();
      }
    } catch (error) {
      console.error("Error saving budget:", error);
    }
  };

  const handleAddExpense = async () => {
    if (!expenseForm.amount || !expenseForm.description) return;

    try {
      const url = editingExpense
        ? `/api/expenses/${editingExpense.id}`
        : "/api/expenses";
      const method = editingExpense ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tripId: selectedTripId,
          ...expenseForm,
        }),
      });

      if (response.ok) {
        setShowAddExpense(false);
        setEditingExpense(null);
        setExpenseForm({
          amount: "",
          description: "",
          category: "FOOD",
          date: new Date().toISOString().split("T")[0],
          notes: "",
          isPaid: true,
        });
        fetchExpenses();
        onExpenseAdded?.();
      }
    } catch (error) {
      console.error("Error saving expense:", error);
    }
  };

  const handleDeleteExpense = async (id: string) => {
    if (!confirm("Delete this expense?")) return;

    try {
      const response = await fetch(`/api/expenses/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        fetchExpenses();
      }
    } catch (error) {
      console.error("Error deleting expense:", error);
    }
  };

  const handleEditExpense = (expense: Expense) => {
    setEditingExpense(expense);
    setExpenseForm({
      amount: expense.amount.toString(),
      description: expense.description,
      category: expense.category,
      date: new Date(expense.date).toISOString().split("T")[0],
      notes: expense.notes || "",
      isPaid: expense.isPaid,
    });
    setShowAddExpense(true);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const getBudgetStatus = () => {
    if (!budget.enabled || !budget.amount || !summary) return null;
    const percent = summary.percentUsed || 0;
    if (percent >= 100) return { color: "text-red-600", bg: "bg-red-500", label: "Over Budget!" };
    if (percent >= 80) return { color: "text-amber-600", bg: "bg-amber-500", label: "Almost There" };
    if (percent >= 50) return { color: "text-yellow-600", bg: "bg-yellow-500", label: "Halfway" };
    return { color: "text-green-600", bg: "bg-green-500", label: "On Track" };
  };

  const budgetStatus = getBudgetStatus();

  return (
    <div className="card-magical p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <span className="text-3xl">💰</span>
          <div>
            <h2 className="text-xl font-bold text-[#1F2A44] dark:text-[#E5E5E5]">
              Budget Tracker
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Track your trip expenses
            </p>
          </div>
        </div>
        {selectedTripId && (
          <button
            onClick={() => setShowBudgetSetup(true)}
            className="text-sm text-[#1F2A44] hover:text-[#FFB957] dark:text-[#FFB957]"
          >
            ⚙️ {budget.enabled ? "Edit Budget" : "Set Budget"}
          </button>
        )}
      </div>

      {/* Trip Selector */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
          Select Trip
        </label>
        <select
          value={selectedTripId}
          onChange={(e) => setSelectedTripId(e.target.value)}
          className="input-magical w-full"
        >
          {trips.length === 0 ? (
            <option value="">No trips - create one first</option>
          ) : (
            trips.map((trip) => (
              <option key={trip.id} value={trip.id}>
                {trip.name}
              </option>
            ))
          )}
        </select>
      </div>

      {selectedTripId && (
        <>
          {/* Budget Overview */}
          {budget.enabled && budget.amount && summary && (
            <div className="mb-6 p-4 rounded-xl bg-linear-to-r from-[#FAF4EF] to-[#F8AFA6]/20 dark:from-[#1F2A44]/20 dark:to-[#F8AFA6]/10 border border-[#E5E5E5] dark:border-[#41537b]">
              <div className="flex items-center justify-between mb-3">
                <span className="font-semibold text-[#1F2A44] dark:text-[#E5E5E5]">
                  Trip Budget
                </span>
                {budgetStatus && (
                  <span className={`text-sm font-medium ${budgetStatus.color}`}>
                    {budgetStatus.label}
                  </span>
                )}
              </div>

              {/* Progress Bar */}
              <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden mb-3">
                <div
                  className={`h-full transition-all duration-500 ${budgetStatus?.bg || "bg-green-500"}`}
                  style={{ width: `${Math.min(summary.percentUsed || 0, 100)}%` }}
                />
              </div>

              <div className="flex justify-between text-sm">
                <span className="text-slate-600 dark:text-slate-400">
                  Spent: <span className="font-semibold text-slate-800 dark:text-slate-200">{formatCurrency(summary.totalSpent)}</span>
                </span>
                <span className="text-slate-600 dark:text-slate-400">
                  Budget: <span className="font-semibold text-slate-800 dark:text-slate-200">{formatCurrency(budget.amount)}</span>
                </span>
              </div>

              {summary.remaining !== null && (
                <div className="mt-2 text-center">
                  <span className={`text-lg font-bold ${summary.remaining >= 0 ? "text-green-600" : "text-red-600"}`}>
                    {summary.remaining >= 0 ? `${formatCurrency(summary.remaining)} remaining` : `${formatCurrency(Math.abs(summary.remaining))} over budget`}
                  </span>
                </div>
              )}
            </div>
          )}

          {/* Category Breakdown */}
          {summary && Object.keys(summary.categoryTotals).length > 0 && (
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">
                Spending by Category
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {Object.entries(summary.categoryTotals)
                  .sort(([, a], [, b]) => b - a)
                  .map(([category, amount]) => {
                    const info = categoryInfo[category as ExpenseCategory];
                    return (
                      <div
                        key={category}
                        className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800/50 text-center"
                      >
                        <span className="text-lg">{info?.icon || "📦"}</span>
                        <p className="text-xs text-slate-500 mt-1">{info?.label || category}</p>
                        <p className="font-semibold text-slate-800 dark:text-slate-200 text-sm">
                          {formatCurrency(amount)}
                        </p>
                      </div>
                    );
                  })}
              </div>
            </div>
          )}

          {/* Add Expense Button */}
          <button
            onClick={() => {
              setEditingExpense(null);
              setExpenseForm({
                amount: "",
                description: "",
                category: "FOOD",
                date: new Date().toISOString().split("T")[0],
                notes: "",
                isPaid: true,
              });
              setShowAddExpense(true);
            }}
            className="w-full mb-4 py-3 rounded-xl border-2 border-dashed border-purple-300 dark:border-purple-700 text-[#1F2A44] dark:text-[#FFB957] hover:bg-[#FAF4EF] dark:hover:bg-purple-900/20 transition-colors flex items-center justify-center gap-2"
          >
            <span>➕</span> Add Expense
          </button>

          {/* Recent Expenses */}
          <div>
            <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">
              Recent Expenses
            </h3>
            {isLoading ? (
              <div className="text-center py-4 text-slate-500">Loading...</div>
            ) : expenses.length === 0 ? (
              <div className="text-center py-8 text-slate-500">
                <span className="text-3xl block mb-2">📝</span>
                No expenses yet. Start tracking!
              </div>
            ) : (
              <div className="space-y-2 max-h-[300px] overflow-y-auto">
                {expenses.slice(0, 10).map((expense) => {
                  const info = categoryInfo[expense.category];
                  return (
                    <div
                      key={expense.id}
                      className="flex items-center gap-3 p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50 group"
                    >
                      <div className={`w-10 h-10 rounded-lg ${info?.color || "bg-slate-500"} flex items-center justify-center text-white text-lg`}>
                        {info?.icon || "📦"}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-slate-800 dark:text-slate-200 truncate">
                            {expense.description}
                          </span>
                          {!expense.isPaid && (
                            <span className="text-xs px-2 py-0.5 rounded-full bg-amber-100 text-amber-700">
                              Planned
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-500">
                          {new Date(expense.date).toLocaleDateString()}
                        </p>
                      </div>
                      <span className="font-semibold text-slate-800 dark:text-slate-200">
                        {formatCurrency(expense.amount)}
                      </span>
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => handleEditExpense(expense)}
                          className="p-1.5 text-slate-400 hover:text-[#1F2A44] hover:bg-[#FAF4EF] dark:hover:bg-[#1F2A44]/20 rounded"
                        >
                          ✏️
                        </button>
                        <button
                          onClick={() => handleDeleteExpense(expense.id)}
                          className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded"
                        >
                          🗑️
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </>
      )}

      {/* Budget Setup Modal */}
      {showBudgetSetup && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 w-full max-w-md">
            <h3 className="text-xl font-bold text-[#1F2A44] dark:text-[#E5E5E5] mb-4">
              💰 Set Trip Budget
            </h3>

            <div className="space-y-4">
              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={budgetForm.enabled}
                  onChange={(e) => setBudgetForm({ ...budgetForm, enabled: e.target.checked })}
                  className="w-5 h-5 rounded border-slate-300 text-[#1F2A44] focus:ring-purple-500"
                />
                <span className="text-slate-700 dark:text-slate-300">
                  Enable budget tracking for this trip
                </span>
              </label>

              {budgetForm.enabled && (
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Total Budget Amount
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">$</span>
                    <input
                      type="number"
                      value={budgetForm.amount}
                      onChange={(e) => setBudgetForm({ ...budgetForm, amount: e.target.value })}
                      placeholder="0.00"
                      className="input-magical pl-8"
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowBudgetSetup(false)}
                className="flex-1 py-2 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveBudget}
                className="flex-1 py-2 rounded-lg bg-[#1F2A44] text-white hover:bg-[#344262]"
              >
                Save Budget
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add/Edit Expense Modal */}
      {showAddExpense && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-bold text-[#1F2A44] dark:text-[#E5E5E5] mb-4">
              {editingExpense ? "✏️ Edit Expense" : "➕ Add Expense"}
            </h3>

            <div className="space-y-4">
              {/* Amount */}
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Amount *
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">$</span>
                  <input
                    type="number"
                    step="0.01"
                    value={expenseForm.amount}
                    onChange={(e) => setExpenseForm({ ...expenseForm, amount: e.target.value })}
                    placeholder="0.00"
                    className="input-magical pl-8"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Description *
                </label>
                <input
                  type="text"
                  value={expenseForm.description}
                  onChange={(e) => setExpenseForm({ ...expenseForm, description: e.target.value })}
                  placeholder="What did you spend on?"
                  className="input-magical"
                />
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Category
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {categories.map((cat) => {
                    const info = categoryInfo[cat];
                    const isSelected = expenseForm.category === cat;
                    return (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => setExpenseForm({ ...expenseForm, category: cat })}
                        className={`p-2 rounded-lg text-center transition-all ${
                          isSelected
                            ? "bg-[#1F2A44]/10 dark:bg-[#1F2A44]/30 border-2 border-purple-500"
                            : "bg-slate-50 dark:bg-slate-700 border-2 border-transparent hover:border-slate-300"
                        }`}
                      >
                        <span className="text-xl block">{info.icon}</span>
                        <span className="text-xs text-slate-600 dark:text-slate-400">{info.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Date */}
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Date
                </label>
                <input
                  type="date"
                  value={expenseForm.date}
                  onChange={(e) => setExpenseForm({ ...expenseForm, date: e.target.value })}
                  className="input-magical"
                />
              </div>

              {/* Paid/Planned Toggle */}
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    checked={expenseForm.isPaid}
                    onChange={() => setExpenseForm({ ...expenseForm, isPaid: true })}
                    className="w-4 h-4 text-[#1F2A44]"
                  />
                  <span className="text-slate-700 dark:text-slate-300">💳 Paid</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    checked={!expenseForm.isPaid}
                    onChange={() => setExpenseForm({ ...expenseForm, isPaid: false })}
                    className="w-4 h-4 text-[#1F2A44]"
                  />
                  <span className="text-slate-700 dark:text-slate-300">📋 Planned</span>
                </label>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Notes (optional)
                </label>
                <textarea
                  value={expenseForm.notes}
                  onChange={(e) => setExpenseForm({ ...expenseForm, notes: e.target.value })}
                  placeholder="Any additional details..."
                  rows={2}
                  className="input-magical resize-none"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => {
                  setShowAddExpense(false);
                  setEditingExpense(null);
                }}
                className="flex-1 py-2 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                onClick={handleAddExpense}
                disabled={!expenseForm.amount || !expenseForm.description}
                className="flex-1 py-2 rounded-lg bg-[#1F2A44] text-white hover:bg-[#344262] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {editingExpense ? "Save Changes" : "Add Expense"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

