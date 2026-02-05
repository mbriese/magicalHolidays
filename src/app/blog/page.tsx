"use client";

import { useState } from "react";
import type { BlogPost, BlogCategory } from "@/types";
import { blogCategoryLabels } from "@/types";

// Demo blog posts
const demoPosts: BlogPost[] = [
  {
    id: "1",
    title: "New Attraction Coming to Tomorrowland",
    slug: "new-attraction-tomorrowland-2026",
    excerpt:
      "Exciting news! A brand new space-themed attraction is set to open this summer, promising an out-of-this-world experience for guests of all ages.",
    content: "Full content here...",
    category: "PARK_UPDATE",
    isPublished: true,
    publishedAt: new Date("2026-01-20"),
    authorId: "admin",
    createdAt: new Date("2026-01-20"),
  },
  {
    id: "2",
    title: "Spring Flower Festival Returns",
    slug: "spring-flower-festival-2026",
    excerpt:
      "The beloved Spring Flower Festival is back with over 100 topiaries, fresh culinary experiences, and enchanting entertainment throughout the park.",
    content: "Full content here...",
    category: "HOLIDAY_EVENT",
    isPublished: true,
    publishedAt: new Date("2026-01-18"),
    authorId: "admin",
    createdAt: new Date("2026-01-18"),
  },
  {
    id: "3",
    title: "5 Tips for Beating the Crowds",
    slug: "tips-beating-crowds",
    excerpt:
      "Planning your visit during peak season? Here are our top strategies for maximizing your time and minimizing wait times.",
    content: "Full content here...",
    category: "TIP",
    isPublished: true,
    publishedAt: new Date("2026-01-15"),
    authorId: "admin",
    createdAt: new Date("2026-01-15"),
  },
  {
    id: "4",
    title: "Mobile Ordering Now Available at More Locations",
    slug: "mobile-ordering-expansion",
    excerpt:
      "Great news for hungry adventurers! Mobile ordering has expanded to 15 new quick-service locations across all parks.",
    content: "Full content here...",
    category: "GENERAL",
    isPublished: true,
    publishedAt: new Date("2026-01-10"),
    authorId: "admin",
    createdAt: new Date("2026-01-10"),
  },
];

const categoryColors: Record<BlogCategory, string> = {
  PARK_UPDATE: "bg-[#1F2A44]/10 text-[#1F2A44] dark:bg-[#1F2A44]/30 dark:text-[#FFB957]",
  HOLIDAY_EVENT: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  GENERAL: "bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300",
  TIP: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
};

export default function BlogPage() {
  const [posts] = useState(demoPosts);
  const [selectedCategory, setSelectedCategory] = useState<BlogCategory | "ALL">("ALL");

  const filteredPosts =
    selectedCategory === "ALL"
      ? posts
      : posts.filter((post) => post.category === selectedCategory);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="animate-fade-in">
      {/* Page Header */}
      <div className="bg-linear-to-r from-[#1F2A44] to-midnight-600 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="font-serif text-3xl md:text-4xl font-bold text-white mb-2">
            News & Updates ✨
          </h1>
          <p className="text-[#E5E5E5]">
            Stay informed about park changes, events, and travel tips
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Category Filter */}
        <div className="section-outlined mb-8">
          <span className="section-title">Filter by Category</span>
          <div className="flex flex-wrap gap-2 pt-2">
            <button
              onClick={() => setSelectedCategory("ALL")}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                selectedCategory === "ALL"
                  ? "bg-[#1F2A44] text-white"
                  : "bg-[#1F2A44]/10 text-[#1F2A44] hover:bg-[#FFB957]/30 dark:bg-slate-700 dark:text-slate-300"
              }`}
            >
              All Posts
            </button>
            {(Object.keys(blogCategoryLabels) as BlogCategory[]).map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedCategory === category
                    ? "bg-[#1F2A44] text-white"
                    : `${categoryColors[category]} hover:opacity-80`
                }`}
              >
                {blogCategoryLabels[category]}
              </button>
            ))}
          </div>
        </div>

        {/* Posts Grid */}
        <div className="section-outlined mb-8">
          <span className="section-title">Latest Posts</span>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-2">
          {filteredPosts.map((post) => (
            <a
              key={post.id}
              href={`/blog/${post.slug}`}
              className="card-magical overflow-hidden hover:scale-[1.02] transition-transform"
            >
              {/* Category Banner */}
              <div
                className={`px-4 py-2 text-xs font-semibold ${categoryColors[post.category]}`}
              >
                {blogCategoryLabels[post.category]}
              </div>

              <div className="p-6">
                <h2 className="font-serif text-xl font-bold text-[#1F2A44] dark:text-white mb-3 line-clamp-2">
                  {post.title}
                </h2>
                <p className="text-slate-600 dark:text-slate-400 text-sm mb-4 line-clamp-3">
                  {post.excerpt}
                </p>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-500 dark:text-slate-500">
                    {post.publishedAt && formatDate(post.publishedAt)}
                  </span>
                  <span className="text-[#1F2A44] dark:text-[#FFB957] font-medium">
                    Read more →
                  </span>
                </div>
              </div>
            </a>
          ))}
        </div>
        </div>

        {/* Empty State */}
        {filteredPosts.length === 0 && (
          <div className="text-center py-20">
            <span className="text-6xl mb-6 block">📰</span>
            <h2 className="font-serif text-2xl font-bold text-[#1F2A44] dark:text-white mb-3">
              No Posts Found
            </h2>
            <p className="text-slate-600 dark:text-slate-400">
              No posts in this category yet. Check back soon!
            </p>
          </div>
        )}

        {/* Newsletter Signup */}
        <div className="section-outlined mt-8 bg-linear-to-r from-[#FAF4EF]/50 to-ember-50/50 dark:from-[#1F2A44]/20 dark:to-[#FFB957]/10">
          <span className="section-title">Stay Connected</span>
          <div className="max-w-2xl mx-auto text-center pt-2">
            <h3 className="font-serif text-2xl font-bold text-[#1F2A44] dark:text-white mb-3">
              Never Miss an Update
            </h3>
            <p className="text-slate-600 dark:text-slate-400 mb-6">
              Subscribe to our newsletter for the latest park news, tips, and
              exclusive planning insights.
            </p>
            <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                placeholder="your@email.com"
                className="input-magical grow"
              />
              <button type="submit" className="btn-magical whitespace-nowrap">
                Subscribe ✨
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

