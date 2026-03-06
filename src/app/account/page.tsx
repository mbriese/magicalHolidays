"use client";

import { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";

function SectionCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-[#E5E5E5] dark:border-white/10 bg-white/80 dark:bg-white/5 backdrop-blur p-6 md:p-8 shadow-sm">
      <h2 className="text-lg font-semibold text-[#1F2A44] dark:text-[#FAF4EF] mb-5">
        {title}
      </h2>
      {children}
    </div>
  );
}

function StatusMessage({ message, isError }: { message: string; isError: boolean }) {
  if (!message) return null;
  return (
    <div
      className={`rounded-lg p-3 text-sm ${
        isError
          ? "bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400"
          : "bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-400"
      }`}
    >
      {message}
    </div>
  );
}

function PreferredNameSection() {
  const { update } = useSession();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [title, setTitle] = useState("");
  const [displayPreference, setDisplayPreference] = useState<"casual" | "formal">("formal");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [fetched, setFetched] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/auth/profile")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (!cancelled && data) {
          setFirstName(data.firstName ?? "");
          setLastName(data.lastName ?? "");
          setTitle(data.title ?? "");
          setDisplayPreference(data.displayPreference === "formal" ? "formal" : "casual");
        }
        setFetched(true);
      })
      .catch(() => setFetched(true));
    return () => { cancelled = true; };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    setIsLoading(true);
    try {
      const res = await fetch("/api/auth/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          title: displayPreference === "formal" ? title : "",
          displayPreference,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setMessage(data.error ?? "Update failed.");
        setIsError(true);
      } else {
        setMessage("Saved. We’ll use this when we address you.");
        setIsError(false);
        await update();
      }
    } catch {
      setMessage("Something went wrong. Please try again.");
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };

  if (!fetched) {
    return (
      <SectionCard title="How we address you">
        <p className="text-sm text-slate-500 dark:text-slate-400">Loading…</p>
      </SectionCard>
    );
  }

  return (
    <SectionCard title="How we address you">
      <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
        Choose how you’d like to be addressed: casual (first name) or formal (title + last name).
      </p>
      <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
        <StatusMessage message={message} isError={isError} />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="profileFirstName" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              First name
            </label>
            <input
              id="profileFirstName"
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="input-magical"
              placeholder="First name"
            />
          </div>
          <div>
            <label htmlFor="profileLastName" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Last name
            </label>
            <input
              id="profileLastName"
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="input-magical"
              placeholder="Last name"
            />
          </div>
        </div>
        <div>
          <p className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            Address style
          </p>
          <div className="space-y-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="accountDisplayPreference"
                checked={displayPreference === "casual"}
                onChange={() => setDisplayPreference("casual")}
                className="w-4 h-4 text-[#1F2A44] border-[#E5E5E5] focus:ring-[#FFB957]"
              />
              <span className="text-sm">Casual: Can I call you {firstName || "First name"}?</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="accountDisplayPreference"
                checked={displayPreference === "formal"}
                onChange={() => setDisplayPreference("formal")}
                className="w-4 h-4 text-[#1F2A44] border-[#E5E5E5] focus:ring-[#FFB957]"
              />
              <span className="text-sm">Formal: {title ? `${title} ` : ""}{lastName || "Last name"}</span>
            </label>
            {displayPreference === "formal" && (
              <div className="ml-6 mt-2">
                <label htmlFor="profileTitle" className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">
                  Title
                </label>
                <select
                  id="profileTitle"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="input-magical"
                >
                  <option value="">No title</option>
                  <option value="Mr.">Mr.</option>
                  <option value="Ms.">Ms.</option>
                  <option value="Mrs.">Mrs.</option>
                  <option value="Mx.">Mx.</option>
                  <option value="Dr.">Dr.</option>
                </select>
              </div>
            )}
          </div>
        </div>
        <button
          type="submit"
          disabled={isLoading}
          className="btn-magical py-2.5 px-6 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? "Saving…" : "Save"}
        </button>
      </form>
    </SectionCard>
  );
}

function ChangePasswordSection() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");

    if (newPassword !== confirmPassword) {
      setMessage("New passwords do not match.");
      setIsError(true);
      return;
    }

    if (newPassword.length < 8) {
      setMessage("New password must be at least 8 characters.");
      setIsError(true);
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch("/api/auth/password", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      const data = await res.json();

      if (!res.ok) {
        setMessage(data.error);
        setIsError(true);
      } else {
        setMessage("Password updated successfully.");
        setIsError(false);
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      }
    } catch {
      setMessage("Something went wrong. Please try again.");
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SectionCard title="Change Password">
      <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
        <StatusMessage message={message} isError={isError} />
        <div>
          <label htmlFor="currentPassword" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
            Current Password
          </label>
          <input
            id="currentPassword"
            type="password"
            required
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            className="input-magical"
          />
        </div>
        <div>
          <label htmlFor="newPassword" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
            New Password
          </label>
          <input
            id="newPassword"
            type="password"
            required
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="input-magical"
            placeholder="At least 8 characters"
          />
        </div>
        <div>
          <label htmlFor="confirmNewPassword" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
            Confirm New Password
          </label>
          <input
            id="confirmNewPassword"
            type="password"
            required
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="input-magical"
          />
        </div>
        <button
          type="submit"
          disabled={isLoading}
          className="btn-magical py-2.5 px-6 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? "Updating..." : "Update Password"}
        </button>
      </form>
    </SectionCard>
  );
}

function ChangeEmailSection() {
  const { data: session, update } = useSession();
  const [newEmail, setNewEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/auth/email", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ newEmail, password }),
      });
      const data = await res.json();

      if (!res.ok) {
        setMessage(data.error);
        setIsError(true);
      } else {
        setMessage("Email updated successfully. Please sign in again with your new email.");
        setIsError(false);
        setNewEmail("");
        setPassword("");
        await update();
      }
    } catch {
      setMessage("Something went wrong. Please try again.");
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SectionCard title="Update Email">
      <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
        Current email: <span className="font-medium text-[#1F2A44] dark:text-[#FAF4EF]">{session?.user?.email}</span>
      </p>
      <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
        <StatusMessage message={message} isError={isError} />
        <div>
          <label htmlFor="newEmail" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
            New Email Address
          </label>
          <input
            id="newEmail"
            type="email"
            required
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
            className="input-magical"
            placeholder="you@example.com"
          />
        </div>
        <div>
          <label htmlFor="emailPassword" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
            Confirm Password
          </label>
          <input
            id="emailPassword"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="input-magical"
            placeholder="Enter your password to confirm"
          />
        </div>
        <button
          type="submit"
          disabled={isLoading}
          className="btn-magical py-2.5 px-6 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? "Updating..." : "Update Email"}
        </button>
      </form>
    </SectionCard>
  );
}

function PaymentMethodsSection() {
  return (
    <SectionCard title="Payment Methods">
      <div className="flex items-start gap-4 p-4 rounded-xl bg-[#FFF8ED] dark:bg-[#FFB957]/10 border border-[#FFB957]/30">
        <span className="text-2xl shrink-0">🔒</span>
        <div>
          <p className="font-medium text-[#1F2A44] dark:text-[#FAF4EF]">
            Coming Soon
          </p>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
            Secure payment methods for booking hotels, flights, and car rentals
            directly through Lamplight Holidays. Your payment details will be
            encrypted and stored safely.
          </p>
        </div>
      </div>
    </SectionCard>
  );
}

export default function AccountPage() {
  const { data: session } = useSession();

  return (
    <div className="min-h-[calc(100vh-64px)] bg-[#FAF4EF] dark:bg-[#1F2A44]">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <a
          href="/dashboard"
          className="text-sm text-[#1F2A44] dark:text-[#FAF4EF] hover:text-[#FFB957] transition-colors"
        >
          ← Back to dashboard
        </a>

        <div className="mt-3 flex items-center justify-between">
          <div>
            <h1 className="font-serif text-3xl md:text-4xl font-bold text-[#1F2A44] dark:text-[#FAF4EF]">
              Account Settings
            </h1>
            {session?.user?.name && (
              <p className="mt-1 text-[#2B2B2B] dark:text-[#E5E5E5]">
                {session.user.name}
              </p>
            )}
          </div>
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="text-sm font-medium text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 transition-colors"
          >
            Sign Out
          </button>
        </div>

        <div className="mt-8 space-y-6">
          <PreferredNameSection />
          <ChangePasswordSection />
          <ChangeEmailSection />
          <PaymentMethodsSection />
        </div>
      </div>
    </div>
  );
}
