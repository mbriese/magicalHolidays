"use client";

import { Suspense, useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { PasswordToggle } from "@/components/PasswordToggle";
import { MIN_PASSWORD_LENGTH } from "@/lib/constants";
import { Spinner } from "@/components/Spinner";
import { StatusMessage } from "@/components/StatusMessage";
import { PreferredNameFields } from "@/components/PreferredNameFields";

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
  const [usePreferredName, setUsePreferredName] = useState(false);
  const [preferredName, setPreferredName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
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

    if (password.length < MIN_PASSWORD_LENGTH) {
      setError(`Password must be at least ${MIN_PASSWORD_LENGTH} characters long.`);
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
          preferredName: usePreferredName ? preferredName.trim() : undefined,
          displayPreference: usePreferredName ? "preferredName" : "firstName",
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

      if (!signInResult?.ok) {
        setError("Account created! Please sign in.");
        router.push(`/login?callbackUrl=${encodeURIComponent(callbackUrl)}`);
        return;
      }

      const url = typeof callbackUrl === "string" && callbackUrl.startsWith("/") ? callbackUrl : "/dashboard";
      window.location.href = url;
      return;
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
            <StatusMessage message={error} isError />

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
                  onChange={(e) => setFirstName(e.target.value)}
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

            <PreferredNameFields
              firstName={firstName}
              usePreferredName={usePreferredName}
              onUsePreferredNameChange={setUsePreferredName}
              preferredName={preferredName}
              onPreferredNameChange={setPreferredName}
            />

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
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input-magical pr-10"
                  placeholder="At least 8 characters"
                />
                <PasswordToggle show={showPassword} onToggle={() => setShowPassword(!showPassword)} />
              </div>
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2"
              >
                Confirm Password
              </label>
              <div className="relative">
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="input-magical pr-10"
                  placeholder="Repeat your password"
                />
                <PasswordToggle show={showConfirmPassword} onToggle={() => setShowConfirmPassword(!showConfirmPassword)} />
              </div>
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
                  <Spinner className="-ml-1 mr-3 h-5 w-5 text-white" />
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

