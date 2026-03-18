import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);
  const cookieHeader = request.headers.get("cookie") ?? "";
  const cookieNames = cookieHeader
    .split(";")
    .map((c) => c.trim().split("=")[0])
    .filter(Boolean);

  return NextResponse.json({
    env: {
      NEXTAUTH_URL: process.env.NEXTAUTH_URL
        ? `${process.env.NEXTAUTH_URL.substring(0, 40)}...`
        : "NOT SET",
      NODE_ENV: process.env.NODE_ENV,
    },
    cookieConfig: {
      sessionTokenName: (authOptions.cookies?.sessionToken as { name: string })?.name ?? "default",
      isSecure: (authOptions.cookies?.sessionToken as { options: { secure: boolean } })?.options?.secure ?? "default",
    },
    receivedCookieNames: cookieNames,
    hasSessionCookie: cookieNames.includes("next-auth.session-token"),
    hasSecurePrefixCookie: cookieNames.includes("__Secure-next-auth.session-token"),
    session: session
      ? { hasUser: !!session.user, name: session.user?.name ?? null }
      : null,
    userAgent: request.headers.get("user-agent")?.substring(0, 80) ?? "unknown",
  });
}
