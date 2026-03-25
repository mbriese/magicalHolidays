"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { PasswordToggle } from "@/components/PasswordToggle";
import { StatusMessage } from "@/components/StatusMessage";
import { Spinner } from "@/components/Spinner";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError("Invalid email or password. Please try again.");
      } else {
        window.location.href = "/dashboard";
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
          <span className="text-5xl mb-4 block">✨</span>
          <h1 className="font-serif text-3xl font-bold text-[#1F2A44] dark:text-white mb-2">
            Welcome Back
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            Sign in to continue planning your magical adventure
          </p>
        </div>

        {/* Form Card */}
        <div className="card-magical p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <StatusMessage message={error} isError />

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
                  placeholder="••••••••"
                />
                <PasswordToggle show={showPassword} onToggle={() => setShowPassword(!showPassword)} />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded border-[#E5E5E5] text-[#1F2A44] focus:ring-[#FFB957]"
                />
                <span className="ml-2 text-sm text-slate-600 dark:text-slate-400">
                  Remember me
                </span>
              </label>
              <a
                href="/forgot-password"
                className="text-sm text-[#1F2A44] hover:text-purple-700 dark:text-[#FFB957]"
              >
                Forgot password?
              </a>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full btn-magical py-3 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <Spinner className="-ml-1 mr-3 h-5 w-5 text-white" />
                  Signing in...
                </span>
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Don&apos;t have an account?{" "}
              <a
                href="/register"
                className="text-[#1F2A44] hover:text-[#FFB957] dark:text-[#FFB957] font-medium"
              >
                Create one free
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

