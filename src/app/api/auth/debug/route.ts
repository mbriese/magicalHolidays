import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
  const session = await getServerSession(authOptions);

  return NextResponse.json({
    env: {
      NEXTAUTH_URL: process.env.NEXTAUTH_URL ? `${process.env.NEXTAUTH_URL.substring(0, 30)}...` : "NOT SET",
      NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET ? "SET (hidden)" : "NOT SET",
      NODE_ENV: process.env.NODE_ENV,
    },
    cookieConfig: {
      sessionTokenName: authOptions.cookies?.sessionToken
        ? (authOptions.cookies.sessionToken as { name: string }).name
        : "default",
      isSecure: authOptions.cookies?.sessionToken
        ? (authOptions.cookies.sessionToken as { options: { secure: boolean } }).options.secure
        : "default",
    },
    session: session
      ? { hasUser: !!session.user, name: session.user?.name ?? null, email: session.user?.email ? "SET" : "NOT SET" }
      : null,
    timestamp: new Date().toISOString(),
  });
}
