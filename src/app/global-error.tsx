"use client";

/**
 * Minimal global error boundary. Must not use any React context (e.g. SessionProvider)
 * so it can be prerendered and run when the root layout is replaced.
 * See: https://nextjs.org/docs/app/building-your-application/routing/error-handling#handling-errors-in-root-layouts
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body style={{ margin: 0, fontFamily: "system-ui, sans-serif", padding: "2rem", background: "#FAF4EF", color: "#1F2A44" }}>
        <div style={{ maxWidth: "480px", margin: "0 auto", textAlign: "center" }}>
          <h1 style={{ fontSize: "1.5rem", marginBottom: "0.5rem" }}>Something went wrong</h1>
          <p style={{ marginBottom: "1.5rem", color: "#666" }}>
            We encountered an error. You can try again.
          </p>
          <button
            type="button"
            onClick={() => reset()}
            style={{
              padding: "0.5rem 1rem",
              fontSize: "1rem",
              background: "#FFB957",
              color: "#1F2A44",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              fontWeight: 600,
            }}
          >
            Try again
          </button>
          <p style={{ marginTop: "1.5rem" }}>
            <a href="/" style={{ color: "#1F2A44", textDecoration: "underline" }}>
              Return home
            </a>
          </p>
        </div>
      </body>
    </html>
  );
}
