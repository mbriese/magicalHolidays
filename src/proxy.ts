import { withAuth } from "next-auth/middleware";

export const proxy = withAuth({
  pages: {
    signIn: "/login",
  },
});

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/trips/:path*",
    "/account/:path*",
    "/api/trips/:path*",
    "/api/reservations/:path*",
    "/api/expenses/:path*",
    "/api/badges/:path*",
    "/api/auth/password/:path*",
    "/api/auth/email/:path*",
  ],
};
