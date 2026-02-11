// Pixie Dust - Fun Disney facts, Hidden Mickeys, quotes, and secrets

export type PixieDustCategory = 
  | "hidden_mickey" 
  | "fun_fact" 
  | "walt_quote" 
  | "park_secret" 
  | "trivia";

export interface PixieDustItem {
  id: string;
  category: PixieDustCategory;
  title: string;
  content: string;
  location?: string; // For Hidden Mickeys or park-specific items
  source?: string;
}

export const categoryConfig: Record<PixieDustCategory, { emoji: string; label: string; color: string }> = {
  hidden_mickey: { emoji: "🐭", label: "Hidden Mickey", color: "text-rose-500" },
  fun_fact: { emoji: "✨", label: "Fun Fact", color: "text-ember-500" },
  walt_quote: { emoji: "💬", label: "Walt's Words", color: "text-midnight-500" },
  park_secret: { emoji: "🔮", label: "Park Secret", color: "text-purple-500" },
  trivia: { emoji: "🎯", label: "Disney Trivia", color: "text-sage-500" },
};

export const pixieDustItems: PixieDustItem[] = [
  // Hidden Mickeys
  {
    id: "hm-1",
    category: "hidden_mickey",
    title: "Haunted Mansion Ballroom",
    content: "Look at the table settings in the ballroom scene - the plates and saucers form a Hidden Mickey!",
    location: "Magic Kingdom - Haunted Mansion",
  },
  {
    id: "hm-2",
    category: "hidden_mickey",
    title: "Spaceship Earth Murals",
    content: "In the Renaissance scene, look for Mickey hiding in the paint splotches on the floor near the artist.",
    location: "EPCOT - Spaceship Earth",
  },
  {
    id: "hm-3",
    category: "hidden_mickey",
    title: "Tower of Terror Lobby",
    content: "Check out the book on the front desk - there's a Hidden Mickey formed by water rings!",
    location: "Hollywood Studios - Tower of Terror",
  },
  {
    id: "hm-4",
    category: "hidden_mickey",
    title: "Pirates Queue",
    content: "In the jail cell scene queue area, look for three cannon balls stacked to form Mickey's head.",
    location: "Magic Kingdom - Pirates of the Caribbean",
  },
  {
    id: "hm-5",
    category: "hidden_mickey",
    title: "Expedition Everest",
    content: "Look at the mural near the entrance - Mickey is hidden in the snow-capped mountains!",
    location: "Animal Kingdom - Expedition Everest",
  },
  {
    id: "hm-6",
    category: "hidden_mickey",
    title: "Splash Mountain Finale",
    content: "In the riverboat finale scene, look for Mickey formed by the clouds in the painted sky.",
    location: "Magic Kingdom - Splash Mountain",
  },
  {
    id: "hm-7",
    category: "hidden_mickey",
    title: "Flight of Passage Queue",
    content: "In the lab area, examine the blue liquid tanks - one has floating bubbles forming Mickey!",
    location: "Animal Kingdom - Pandora",
  },

  // Fun Facts
  {
    id: "ff-1",
    category: "fun_fact",
    title: "Smellitizers",
    content: "Disney uses 'Smellitizers' to pump specific scents throughout the parks. Main Street USA smells like vanilla and fresh-baked cookies!",
  },
  {
    id: "ff-2",
    category: "fun_fact",
    title: "Forced Perspective",
    content: "Cinderella Castle uses forced perspective - the higher stones are actually smaller, making it appear 189 feet tall when it's really 100 feet.",
  },
  {
    id: "ff-3",
    category: "fun_fact",
    title: "Underground Tunnels",
    content: "Magic Kingdom sits on the second floor! Below it is a network of 'utilidors' (utility tunnels) where cast members travel unseen.",
  },
  {
    id: "ff-4",
    category: "fun_fact",
    title: "No Gum Sold",
    content: "Disney parks don't sell chewing gum anywhere on property to help keep the parks clean!",
  },
  {
    id: "ff-5",
    category: "fun_fact",
    title: "Turkey Leg Stats",
    content: "Walt Disney World sells over 1.6 million turkey legs per year. That's about 4,400 per day!",
  },
  {
    id: "ff-6",
    category: "fun_fact",
    title: "Paint Color",
    content: "The color used for all backstage buildings is called 'Go Away Green' - it's designed to make structures blend into the surroundings.",
  },
  {
    id: "ff-7",
    category: "fun_fact",
    title: "Trash Cans",
    content: "Walt Disney discovered people will only walk 30 steps before dropping trash, so there's a trash can every 30 feet in the parks!",
  },
  {
    id: "ff-8",
    category: "fun_fact",
    title: "Living Plants",
    content: "EPCOT has over 3 million plants, and the Land pavilion grows real produce used in Disney restaurants!",
  },

  // Walt Quotes
  {
    id: "wq-1",
    category: "walt_quote",
    title: "Dream & Do",
    content: "All our dreams can come true, if we have the courage to pursue them.",
    source: "Walt Disney",
  },
  {
    id: "wq-2",
    category: "walt_quote",
    title: "Keep Moving Forward",
    content: "Around here, however, we don't look backwards for very long. We keep moving forward, opening up new doors and doing new things.",
    source: "Walt Disney",
  },
  {
    id: "wq-3",
    category: "walt_quote",
    title: "Impossible Fun",
    content: "It's kind of fun to do the impossible.",
    source: "Walt Disney",
  },
  {
    id: "wq-4",
    category: "walt_quote",
    title: "Laughter is Timeless",
    content: "Laughter is timeless, imagination has no age, and dreams are forever.",
    source: "Walt Disney",
  },
  {
    id: "wq-5",
    category: "walt_quote",
    title: "The Way to Get Started",
    content: "The way to get started is to quit talking and begin doing.",
    source: "Walt Disney",
  },
  {
    id: "wq-6",
    category: "walt_quote",
    title: "Never Completed",
    content: "Disneyland will never be completed. It will continue to grow as long as there is imagination left in the world.",
    source: "Walt Disney",
  },
  {
    id: "wq-7",
    category: "walt_quote",
    title: "Curiosity",
    content: "We keep moving forward, opening new doors, and doing new things, because we're curious and curiosity keeps leading us down new paths.",
    source: "Walt Disney",
  },

  // Park Secrets
  {
    id: "ps-1",
    category: "park_secret",
    title: "Free Water",
    content: "You can get free ice water at any quick-service restaurant. Just ask! It's a great way to stay hydrated without spending extra.",
  },
  {
    id: "ps-2",
    category: "park_secret",
    title: "Birthday Buttons",
    content: "Celebrating something special? Get a free celebration button from Guest Relations - cast members will wish you well all day!",
  },
  {
    id: "ps-3",
    category: "park_secret",
    title: "First Visit Button",
    content: "First time at Disney? Ask for a 'First Visit' button and prepare for extra magic from cast members throughout your day!",
  },
  {
    id: "ps-4",
    category: "park_secret",
    title: "Personalized Maps",
    content: "Guest Relations can provide maps in different languages, Braille, and even audio description devices for free.",
  },
  {
    id: "ps-5",
    category: "park_secret",
    title: "Phone Numbers",
    content: "Pick up any old-fashioned phone on Main Street USA - they're not props! You'll hear vintage party line conversations.",
  },
  {
    id: "ps-6",
    category: "park_secret",
    title: "Windows of Main Street",
    content: "The names on Main Street windows aren't random - they honor Disney Imagineers and important people in Disney history!",
  },

  // Trivia
  {
    id: "tr-1",
    category: "trivia",
    title: "Opening Day",
    content: "Disneyland opened on July 17, 1955. It was so hot that ladies' high heels sank into the fresh asphalt on Main Street!",
  },
  {
    id: "tr-2",
    category: "trivia",
    title: "First Words",
    content: "The first words Mickey Mouse ever spoke were 'Hot dogs!' in the 1929 cartoon 'The Karnival Kid.'",
  },
  {
    id: "tr-3",
    category: "trivia",
    title: "Castle Height",
    content: "Sleeping Beauty Castle at Disneyland is 77 feet tall, while Cinderella Castle at Magic Kingdom is 189 feet tall!",
  },
  {
    id: "tr-4",
    category: "trivia",
    title: "Original Name",
    content: "Mickey Mouse was almost named 'Mortimer Mouse' until Walt's wife Lillian convinced him Mickey was a better name.",
  },
  {
    id: "tr-5",
    category: "trivia",
    title: "Most Popular Ride",
    content: "It's a Small World has been ridden by more people than any other attraction in Disney history - over 1 billion riders!",
  },
  {
    id: "tr-6",
    category: "trivia",
    title: "Haunted Mansion Ghosts",
    content: "The Haunted Mansion claims to have 999 happy haunts, but there's always room for one more!",
  },
  {
    id: "tr-7",
    category: "trivia",
    title: "Walt's Apartment",
    content: "Walt Disney had a private apartment above the Fire Station on Main Street. A lamp in the window stays lit 24/7 in his memory.",
  },
  {
    id: "tr-8",
    category: "trivia",
    title: "Real Human Skulls",
    content: "When Pirates of the Caribbean first opened, real human skulls were used because fake ones didn't look realistic enough!",
  },
];

// Helper function to get a random Pixie Dust item
export function getRandomPixieDust(): PixieDustItem {
  const randomIndex = Math.floor(Math.random() * pixieDustItems.length);
  return pixieDustItems[randomIndex];
}

// Helper function to get a random item by category
export function getRandomPixieDustByCategory(category: PixieDustCategory): PixieDustItem | null {
  const filtered = pixieDustItems.filter((item) => item.category === category);
  if (filtered.length === 0) return null;
  const randomIndex = Math.floor(Math.random() * filtered.length);
  return filtered[randomIndex];
}
