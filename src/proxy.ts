import { withAuth } from "next-auth/middleware";

export const proxy = withAuth({
  pages: {
    signIn: "/login",
  },
});

export const config = {
  matcher: [
    "/trips/:path*",
    "/account/:path*",
    "/api/expenses/:path*",
    "/api/auth/password/:path*",
    "/api/auth/email/:path*",
    "/api/auth/profile/:path*",
  ],
};
