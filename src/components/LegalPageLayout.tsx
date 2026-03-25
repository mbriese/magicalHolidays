export function LegalPageLayout({
  title,
  lastUpdated,
  children,
}: {
  title: string;
  lastUpdated: string;
  children: React.ReactNode;
}) {
  return (
    <div className="animate-fade-in">
      <div className="bg-linear-to-r from-[#1F2A44] to-midnight-600 py-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="font-serif text-3xl md:text-4xl font-bold text-white mb-2">
            {title}
          </h1>
          <p className="text-[#E5E5E5] text-sm">
            Last updated: {lastUpdated}
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <article className="prose prose-lg max-w-none text-slate-600 dark:text-slate-300 leading-relaxed space-y-8">
          {children}
        </article>

        <div className="mt-12 pt-8 border-t border-[#E5E5E5] dark:border-slate-700">
          <a href="/register" className="text-[#1F2A44] dark:text-[#FFB957] hover:text-[#FFB957] font-medium text-sm">
            &larr; Back to Registration
          </a>
        </div>
      </div>
    </div>
  );
}
