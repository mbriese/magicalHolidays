"use client";

export function SearchPageLayout({
  title,
  description,
  submitLabel,
  canSubmit,
  onSubmit,
  resultsNote,
  children,
}: {
  title: string;
  description: string;
  submitLabel: string;
  canSubmit: boolean;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  resultsNote: string;
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-[calc(100vh-64px)] bg-white dark:bg-[#2a3654]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <a
          href="/"
          className="text-sm text-[#1F2A44] dark:text-[#FAF4EF] hover:text-[#FFB957] transition-colors"
        >
          &larr; Back home
        </a>

        <h1 className="mt-3 font-serif text-3xl md:text-4xl font-bold text-[#1F2A44] dark:text-[#FAF4EF]">
          {title}
        </h1>
        <p className="mt-2 text-[#2B2B2B] dark:text-[#E5E5E5]">
          {description}
        </p>

        <form
          onSubmit={onSubmit}
          className="mt-6 rounded-2xl border border-[#E5E5E5] dark:border-white/10 bg-white/80 dark:bg-white/5 backdrop-blur p-5 md:p-6 shadow-sm space-y-5"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {children}
          </div>

          <button
            type="submit"
            disabled={!canSubmit}
            className={`px-6 py-3 rounded-full font-semibold shadow-lg transition ${
              canSubmit
                ? "bg-[#FFB957] text-[#1F2A44] hover:scale-[1.02]"
                : "bg-[#E5E5E5] text-[#777] cursor-not-allowed"
            }`}
          >
            {submitLabel}
          </button>
        </form>

        <div className="mt-6 rounded-2xl border border-dashed border-[#E5E5E5] dark:border-white/10 p-6 text-[#2B2B2B] dark:text-[#E5E5E5]">
          <div className="font-semibold">Results</div>
          <div className="text-sm opacity-80">{resultsNote}</div>
        </div>
      </div>
    </div>
  );
}
