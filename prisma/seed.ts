import { PrismaClient, BadgeCategory, BadgeRarity } from "@prisma/client";

const prisma = new PrismaClient();

// Adventure and Experience Badges
const badges = [
  // ============================================
  // ADVENTURE BADGES (Trip milestones)
  // ============================================
  {
    name: "First Trip",
    description: "Embarked on your first magical journey!",
    icon: "🏰",
    category: BadgeCategory.ADVENTURE,
    rarity: BadgeRarity.COMMON,
    requirement: "Create your first trip",
    threshold: 1,
  },
  {
    name: "Seasoned Traveler",
    description: "You've planned 5 magical adventures!",
    icon: "🎒",
    category: BadgeCategory.ADVENTURE,
    rarity: BadgeRarity.UNCOMMON,
    requirement: "Plan 5 trips",
    threshold: 5,
  },
  {
    name: "Adventure Master",
    description: "10 trips and counting! You're a planning pro.",
    icon: "🗺️",
    category: BadgeCategory.ADVENTURE,
    rarity: BadgeRarity.RARE,
    requirement: "Plan 10 trips",
    threshold: 10,
  },
  {
    name: "World Explorer",
    description: "25 trips planned! You're a true adventurer.",
    icon: "🌍",
    category: BadgeCategory.ADVENTURE,
    rarity: BadgeRarity.LEGENDARY,
    requirement: "Plan 25 trips",
    threshold: 25,
  },

  // ============================================
  // EXPERIENCE BADGES (Reservation milestones)
  // ============================================
  {
    name: "First Reservation",
    description: "Made your very first reservation!",
    icon: "⭐",
    category: BadgeCategory.EXPERIENCE,
    rarity: BadgeRarity.COMMON,
    requirement: "Add your first reservation",
    threshold: 1,
  },
  {
    name: "Planner Pro",
    description: "10 reservations! You're getting organized.",
    icon: "📋",
    category: BadgeCategory.EXPERIENCE,
    rarity: BadgeRarity.UNCOMMON,
    requirement: "Add 10 reservations",
    threshold: 10,
  },
  {
    name: "Reservation Master",
    description: "50 reservations! Nothing escapes your planning.",
    icon: "🎯",
    category: BadgeCategory.EXPERIENCE,
    rarity: BadgeRarity.RARE,
    requirement: "Add 50 reservations",
    threshold: 50,
  },
  {
    name: "Legendary Planner",
    description: "100 reservations! You're a planning legend.",
    icon: "👑",
    category: BadgeCategory.EXPERIENCE,
    rarity: BadgeRarity.LEGENDARY,
    requirement: "Add 100 reservations",
    threshold: 100,
  },

  // ============================================
  // EXPLORER BADGES (Park day milestones)
  // ============================================
  {
    name: "Park Hopper",
    description: "Your first park day reservation!",
    icon: "🎢",
    category: BadgeCategory.EXPLORER,
    rarity: BadgeRarity.COMMON,
    requirement: "Plan your first park day",
    threshold: 1,
  },
  {
    name: "Park Enthusiast",
    description: "5 park days planned! The magic awaits.",
    icon: "🎠",
    category: BadgeCategory.EXPLORER,
    rarity: BadgeRarity.UNCOMMON,
    requirement: "Plan 5 park days",
    threshold: 5,
  },
  {
    name: "Park Champion",
    description: "15 park days! You know every corner of the parks.",
    icon: "🏆",
    category: BadgeCategory.EXPLORER,
    rarity: BadgeRarity.RARE,
    requirement: "Plan 15 park days",
    threshold: 15,
  },
  {
    name: "Park Legend",
    description: "30 park days! The parks are your second home.",
    icon: "🌟",
    category: BadgeCategory.EXPLORER,
    rarity: BadgeRarity.LEGENDARY,
    requirement: "Plan 30 park days",
    threshold: 30,
  },

  // ============================================
  // EXPLORER BADGES (Variety)
  // ============================================
  {
    name: "Variety Seeker",
    description: "Used 3 different reservation types!",
    icon: "🧭",
    category: BadgeCategory.EXPLORER,
    rarity: BadgeRarity.UNCOMMON,
    requirement: "Use 3 different reservation types",
    threshold: 3,
  },
  {
    name: "Complete Explorer",
    description: "Master of all 5 reservation types!",
    icon: "🎖️",
    category: BadgeCategory.EXPLORER,
    rarity: BadgeRarity.EPIC,
    requirement: "Use all 5 reservation types",
    threshold: 5,
  },

  // ============================================
  // SPECIAL BADGES (Bonus achievements)
  // ============================================
  {
    name: "Early Bird",
    description: "Planning ahead pays off!",
    icon: "🐣",
    category: BadgeCategory.SPECIAL,
    rarity: BadgeRarity.RARE,
    requirement: "Book a reservation at least 30 days in advance",
    threshold: 1,
  },
  {
    name: "Sunrise Traveler",
    description: "The early bird catches the ride!",
    icon: "🌅",
    category: BadgeCategory.SPECIAL,
    rarity: BadgeRarity.UNCOMMON,
    requirement: "Have a reservation for an event or ride before 9 AM",
    threshold: 1,
  },
  {
    name: "Magic Maker",
    description: "Created the perfect vacation plan!",
    icon: "✨",
    category: BadgeCategory.SPECIAL,
    rarity: BadgeRarity.EPIC,
    requirement: "Complete a trip with 10+ reservations",
    threshold: 1,
  },
];

async function main() {
  console.log("🌟 Seeding LamplightHolidays database...\n");

  // Create demo user if not exists
  const existingUser = await prisma.user.findFirst();
  let user;
  
  if (!existingUser) {
    user = await prisma.user.create({
      data: {
        email: "demo@magicalholidays.com",
        password: "demo-password-hash",
        name: "Demo User",
        favoriteCharacters: ["Mickey Mouse", "Cinderella"],
      },
    });
    console.log("✅ Created demo user");
  } else {
    user = existingUser;
    console.log("ℹ️  Demo user already exists");
  }

  // Seed badges
  console.log("\n🎖️  Seeding badges...");
  
  for (const badge of badges) {
    await prisma.badge.upsert({
      where: { name: badge.name },
      create: badge,
      update: {
        description: badge.description,
        icon: badge.icon,
        category: badge.category,
        rarity: badge.rarity,
        requirement: badge.requirement,
        threshold: badge.threshold,
      },
    });
    console.log(`  ✅ ${badge.icon} ${badge.name}`);
  }

  // Early Bird and Sunrise Traveler are earned at runtime via /api/badges POST

  console.log("\n✨ Seeding completed!");
}

main()
  .catch((e) => {
    console.error("Error seeding database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
