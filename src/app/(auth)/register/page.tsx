"use client";

import { Suspense, useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";

export default function RegisterPage() {
  return (
    <Suspense>
      <RegisterForm />
    </Suspense>
  );
}

function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [displayPreference, setDisplayPreference] = useState<"firstName" | "preferredName">("firstName");
  const [preferredName, setPreferredName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      setIsLoading(false);
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters long.");
      setIsLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          preferredName: displayPreference === "preferredName" ? preferredName.trim() : undefined,
          displayPreference,
          email,
          password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Something went wrong. Please try again.");
        return;
      }

      const signInResult = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (signInResult?.error) {
        router.push("/login");
      } else {
        const url = typeof callbackUrl === "string" && callbackUrl.startsWith("/") ? callbackUrl : "/dashboard";
        window.location.href = url;
        return;
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <span className="text-5xl mb-4 block">🌟</span>
          <h1 className="font-serif text-3xl font-bold text-[#1F2A44] dark:text-white mb-2">
            Start Your Journey
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            Create your free account and begin planning magical adventures
          </p>
        </div>

        {/* Form Card */}
        <div className="card-magical p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 text-red-700 dark:text-red-400 text-sm">
                {error}
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label
                  htmlFor="firstName"
                  className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2"
                >
                  Legal First Name
                </label>
                <input
                  id="firstName"
                  type="text"
                  required
                  value={firstName}
                  onChange={(e) => {
                    setFirstName(e.target.value);
                    if (displayPreference === "firstName" || !preferredName) {
                      setPreferredName(e.target.value);
                    }
                  }}
                  className="input-magical"
                  placeholder="First name"
                />
              </div>
              <div>
                <label
                  htmlFor="lastName"
                  className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2"
                >
                  Legal Last Name
                </label>
                <input
                  id="lastName"
                  type="text"
                  required
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="input-magical"
                  placeholder="Last name"
                />
              </div>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 -mt-3">
              Must match your driver&apos;s license / passport for travel documents.
            </p>

            <div>
              <p className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                How would you like us to address you?
              </p>
              <div className="space-y-3">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="radio"
                    name="displayPreference"
                    checked={displayPreference === "firstName"}
                    onChange={() => setDisplayPreference("firstName")}
                    className="mt-1 w-4 h-4 text-[#1F2A44] border-[#E5E5E5] focus:ring-[#FFB957]"
                  />
                  <span className="text-sm text-slate-700 dark:text-slate-300">
                    Address me by my first name
                  </span>
                </label>
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="radio"
                    name="displayPreference"
                    checked={displayPreference === "preferredName"}
                    onChange={() => {
                      setDisplayPreference("preferredName");
                      if (!preferredName) setPreferredName(firstName);
                    }}
                    className="mt-1 w-4 h-4 text-[#1F2A44] border-[#E5E5E5] focus:ring-[#FFB957]"
                  />
                  <span className="text-sm text-slate-700 dark:text-slate-300">
                    Address me by my preferred name
                  </span>
                </label>
                {displayPreference === "preferredName" && (
                  <div className="ml-7 mt-1">
                    <label htmlFor="preferredName" className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">
                      Preferred name
                    </label>
                    <input
                      id="preferredName"
                      type="text"
                      value={preferredName}
                      onChange={(e) => setPreferredName(e.target.value)}
                      className="input-magical"
                      placeholder={firstName || "Preferred name"}
                    />
                  </div>
                )}
              </div>

              {(firstName || preferredName) && (
                <p className="mt-3 text-sm text-[#1F2A44] dark:text-[#FFB957] font-medium">
                  Great! We&apos;ll call you &ldquo;{displayPreference === "preferredName" && preferredName ? preferredName : firstName}&rdquo;!
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2"
              >
                Email Address
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-magical"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-magical"
                placeholder="At least 8 characters"
              />
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2"
              >
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="input-magical"
                placeholder="Repeat your password"
              />
            </div>

            <div className="flex items-start">
              <input
                id="terms"
                type="checkbox"
                required
                className="w-4 h-4 mt-0.5 rounded border-[#E5E5E5] text-[#1F2A44] focus:ring-[#FFB957]"
              />
              <label
                htmlFor="terms"
                className="ml-2 text-sm text-slate-600 dark:text-slate-400"
              >
                I agree to the{" "}
                <a href="/terms" className="text-[#1F2A44] hover:text-[#FFB957]">
                  Terms of Service
                </a>{" "}
                and{" "}
                <a href="/privacy" className="text-[#1F2A44] hover:text-purple-700">
                  Privacy Policy
                </a>
              </label>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full btn-magical py-3 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Creating account...
                </span>
              ) : (
                "Create Account ✨"
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Already have an account?{" "}
              <a
                href="/login"
                className="text-[#1F2A44] hover:text-[#FFB957] dark:text-[#FFB957] font-medium"
              >
                Sign in
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

