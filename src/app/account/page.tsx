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
  const [preferredName, setPreferredName] = useState("");
  const [usePreferredName, setUsePreferredName] = useState(false);
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
          setPreferredName(data.preferredName ?? "");
          setUsePreferredName(data.displayPreference === "preferredName");
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
          preferredName: usePreferredName ? preferredName.trim() : "",
          displayPreference: usePreferredName ? "preferredName" : "firstName",
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setMessage(data.error ?? "Update failed.");
        setIsError(true);
      } else {
        const name = usePreferredName && preferredName.trim()
          ? preferredName.trim()
          : firstName.trim();
        setMessage(`Saved! We'll call you "${name}".`);
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
        <p className="text-sm text-slate-500 dark:text-slate-400">Loading...</p>
      </SectionCard>
    );
  }

  return (
    <SectionCard title="How we address you">
      <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
        Your legal name is used for travel documents and must match your driver&apos;s license / passport.
      </p>
      <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
        <StatusMessage message={message} isError={isError} />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="profileFirstName" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Legal First Name
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
              Legal Last Name
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
            How would you like us to address you?
          </p>

          {firstName && (
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
              We&apos;ll call you <span className="font-medium text-[#1F2A44] dark:text-[#FAF4EF]">{usePreferredName && preferredName ? preferredName : firstName}</span>
            </p>
          )}

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={usePreferredName}
              onChange={(e) => {
                setUsePreferredName(e.target.checked);
                if (e.target.checked && !preferredName) {
                  setPreferredName(firstName);
                }
              }}
              className="w-4 h-4 rounded border-[#E5E5E5] text-[#1F2A44] focus:ring-[#FFB957]"
            />
            <span className="text-sm text-slate-700 dark:text-slate-300">
              Use a preferred name for communications
            </span>
          </label>

          {usePreferredName && (
            <div className="mt-3 ml-6">
              <label htmlFor="profilePreferredName" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Preferred name
              </label>
              <input
                id="profilePreferredName"
                type="text"
                value={preferredName}
                onChange={(e) => setPreferredName(e.target.value)}
                className="input-magical"
                placeholder={firstName || "Preferred name"}
              />
              <p className="mt-1.5 text-xs text-slate-500 dark:text-slate-400">
                Travel documents will still use your legal name.
              </p>

              {preferredName && (
                <p className="mt-2 text-sm text-[#1F2A44] dark:text-[#FFB957] font-medium">
                  Great! We&apos;ll call you &ldquo;{preferredName}&rdquo;!
                </p>
              )}
            </div>
          )}
        </div>
        <button
          type="submit"
          disabled={isLoading}
          className="btn-magical py-2.5 px-6 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? "Saving..." : "Save"}
        </button>
      </form>
    </SectionCard>
  );
}

function PasswordToggle({ show, onToggle }: { show: boolean; onToggle: () => void }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
      aria-label={show ? "Hide password" : "Show password"}
    >
      {show ? (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/><path d="M14.12 14.12a3 3 0 1 1-4.24-4.24"/></svg>
      ) : (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
      )}
    </button>
  );
}

function ChangePasswordSection() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
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
          <div className="relative">
            <input
              id="currentPassword"
              type={showCurrentPassword ? "text" : "password"}
              required
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="input-magical pr-10"
            />
            <PasswordToggle show={showCurrentPassword} onToggle={() => setShowCurrentPassword(!showCurrentPassword)} />
          </div>
        </div>
        <div>
          <label htmlFor="newPassword" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
            New Password
          </label>
          <div className="relative">
            <input
              id="newPassword"
              type={showNewPassword ? "text" : "password"}
              required
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="input-magical pr-10"
              placeholder="At least 8 characters"
            />
            <PasswordToggle show={showNewPassword} onToggle={() => setShowNewPassword(!showNewPassword)} />
          </div>
        </div>
        <div>
          <label htmlFor="confirmNewPassword" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
            Confirm New Password
          </label>
          <div className="relative">
            <input
              id="confirmNewPassword"
              type={showConfirmPassword ? "text" : "password"}
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="input-magical pr-10"
            />
            <PasswordToggle show={showConfirmPassword} onToggle={() => setShowConfirmPassword(!showConfirmPassword)} />
          </div>
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
  const [showPassword, setShowPassword] = useState(false);
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
          <div className="relative">
            <input
              id="emailPassword"
              type={showPassword ? "text" : "password"}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input-magical pr-10"
              placeholder="Enter your password to confirm"
            />
            <PasswordToggle show={showPassword} onToggle={() => setShowPassword(!showPassword)} />
          </div>
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
          &larr; Back to dashboard
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
