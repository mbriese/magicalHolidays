"use client";

import { useSession, signOut } from "next-auth/react";

export default function HeaderAuth() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <div className="w-20 h-8" />;
  }

  if (session?.user) {
    return (
      <div className="flex items-center gap-1.5 sm:gap-3">
        <a
          href="/account"
          className="text-[#1F2A44] dark:text-[#FFB957] hover:text-[#FFB957] dark:hover:text-ember-300 font-medium transition-colors whitespace-nowrap"
          title="Account Settings"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 sm:hidden"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
          <span className="hidden sm:inline text-sm sm:text-base">
            {session.user.name || "Account"}
          </span>
        </a>
        <button
          type="button"
          onClick={() => signOut({ callbackUrl: "/" })}
          className="text-xs sm:text-sm py-1.5 px-3 sm:py-2 sm:px-4 rounded-xl font-semibold border border-[#E5E5E5] dark:border-white/20 text-[#1F2A44] dark:text-[#FAF4EF] hover:bg-[#FFB957]/10 transition-colors whitespace-nowrap"
          aria-label="Sign out"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 sm:hidden" aria-hidden><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
          <span className="hidden sm:inline">Sign Out</span>
        </button>
      </div>
    );
  }

  return (
    <>
      <a
        href="/login"
        className="text-[#1F2A44] dark:text-[#FFB957] hover:text-[#FFB957] dark:hover:text-ember-300 font-medium transition-colors whitespace-nowrap"
        title="Sign In"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 sm:hidden"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
        <span className="hidden sm:inline text-sm sm:text-base">Sign In</span>
      </a>
      <a
        href="/register"
        className="btn-gold text-xs sm:text-sm py-1.5 px-3 sm:py-2 sm:px-4 whitespace-nowrap"
        title="Get Started"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 sm:hidden"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" y1="8" x2="19" y2="14"/><line x1="22" y1="11" x2="16" y2="11"/></svg>
        <span className="hidden sm:inline">Get Started</span>
      </a>
    </>
  );
}
