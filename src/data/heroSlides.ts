import type { HeroSlide } from "@/components/HeroCarousel";

// Hero carousel slides - customize these with your own content and images
export const heroSlides: HeroSlide[] = [
  {
    id: "slide-1",
    title: "Plan Your Perfect Vacation",
    subtitle: "Organize every detail of your magical adventure - from park reservations to dining, all in one place.",
    image: "/images/hero-trips-desktop.png",
    imageAlt: "Family planning their Disney vacation",
  },
  {
    id: "slide-2", 
    title: "Track Every Moment",
    subtitle: "Never miss a reservation. Keep your Lightning Lane bookings, dining reservations, and park tickets organized.",
    image: "/images/hero-desktop.png",
    imageAlt: "Calendar with trip reservations",
  },
  {
    id: "slide-3",
    title: "Create Lasting Memories",
    subtitle: "From your first park day to your farewell dinner, capture every magical moment of your journey.",
    image: "/images/magicalHolidaySplash.png",
    imageAlt: "Magical vacation memories",
  },
];

// You can add more slides here as you add more images
// Example:
// {
//   id: "slide-4",
//   title: "Your Title Here",
//   subtitle: "Your description here",
//   image: "/images/your-image.jpg",
//   imageAlt: "Description of image",
// },
