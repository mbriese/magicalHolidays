import prisma from "./prisma";

// Demo user data
const DEMO_USER = {
  email: "demo@magicalholidays.com",
  password: "demo-password-hash",
  name: "Demo User",
};

/**
 * Get or create the demo user for development purposes.
 * In production, this would be replaced with proper authentication.
 */
export async function getOrCreateDemoUser() {
  let user = await prisma.user.findFirst();

  if (!user) {
    user = await prisma.user.create({
      data: DEMO_USER,
    });
  }

  return user;
}
