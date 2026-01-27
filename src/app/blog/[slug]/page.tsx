"use client";

import { useState } from "react";
import type { BlogPost } from "@/types";
import { blogCategoryLabels } from "@/types";

// Demo post (in real app, this would be fetched based on slug)
const demoPost: BlogPost = {
  id: "1",
  title: "New Attraction Coming to Tomorrowland",
  slug: "new-attraction-tomorrowland-2026",
  excerpt:
    "Exciting news! A brand new space-themed attraction is set to open this summer, promising an out-of-this-world experience for guests of all ages.",
  content: `
## A New Era of Space Adventure

We're thrilled to announce that Tomorrowland is getting a spectacular new addition this summer! After years of anticipation and months of construction, the newest attraction promises to take guests on an unforgettable journey through the cosmos.

### What to Expect

The new experience will feature:

- **Cutting-edge technology** - State-of-the-art projection mapping and audio systems
- **Interactive elements** - Guests become part of the story
- **Accessibility features** - Designed to be enjoyed by guests of all abilities
- **Multiple ride vehicles** - Reduced wait times with increased capacity

### Opening Timeline

The grand opening is scheduled for **July 2026**, just in time for summer vacation season. Annual Passholders will have the opportunity for preview experiences starting in late June.

### Planning Tips

If you're hoping to experience the new attraction:

1. **Book your park reservation early** - Expect high demand in the first few months
2. **Arrive at park opening** - Lines will be shortest in the early morning
3. **Use the mobile app** - Virtual queue may be available
4. **Consider staying on-site** - Extra Magic Hours could provide additional ride time

### What This Means for Your Trip

If you're planning a visit this summer, we recommend:

- Adjusting your touring plan to account for potential crowds in Tomorrowland
- Building in extra time for the new experience
- Having backup plans for other attractions

Stay tuned for more details as we get closer to the opening date!
  `,
  category: "PARK_UPDATE",
  isPublished: true,
  publishedAt: new Date("2026-01-20"),
  authorId: "admin",
  createdAt: new Date("2026-01-20"),
};

const categoryColors: Record<string, string> = {
  PARK_UPDATE: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
  HOLIDAY_EVENT: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  GENERAL: "bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300",
  TIP: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
};

export default function BlogPostPage() {
  const [post] = useState(demoPost);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  // Simple markdown-like rendering (in production, use a proper markdown library)
  const renderContent = (content: string) => {
    return content.split("\n").map((line, index) => {
      // Headers
      if (line.startsWith("### ")) {
        return (
          <h3
            key={index}
            className="text-xl font-serif font-bold text-purple-900 dark:text-white mt-8 mb-4"
          >
            {line.replace("### ", "")}
          </h3>
        );
      }
      if (line.startsWith("## ")) {
        return (
          <h2
            key={index}
            className="text-2xl font-serif font-bold text-purple-900 dark:text-white mt-10 mb-4"
          >
            {line.replace("## ", "")}
          </h2>
        );
      }

      // List items
      if (line.startsWith("- **")) {
        const match = line.match(/- \*\*(.+?)\*\* - (.+)/);
        if (match) {
          return (
            <li key={index} className="mb-2">
              <strong className="text-purple-900 dark:text-white">
                {match[1]}
              </strong>{" "}
              - {match[2]}
            </li>
          );
        }
      }
      if (line.startsWith("- ")) {
        return (
          <li key={index} className="mb-2">
            {line.replace("- ", "")}
          </li>
        );
      }

      // Numbered list
      if (/^\d+\.\s/.test(line)) {
        return (
          <li key={index} className="mb-2 list-decimal ml-4">
            {line.replace(/^\d+\.\s/, "")}
          </li>
        );
      }

      // Bold text in paragraphs
      if (line.includes("**")) {
        const parts = line.split(/\*\*(.+?)\*\*/g);
        return (
          <p key={index} className="mb-4">
            {parts.map((part, i) =>
              i % 2 === 1 ? (
                <strong key={i} className="text-purple-900 dark:text-white">
                  {part}
                </strong>
              ) : (
                part
              )
            )}
          </p>
        );
      }

      // Regular paragraphs
      if (line.trim()) {
        return (
          <p key={index} className="mb-4">
            {line}
          </p>
        );
      }

      return null;
    });
  };

  return (
    <div className="animate-fade-in">
      {/* Page Header */}
      <div className="bg-linear-to-r from-purple-600 to-purple-800 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <a
            href="/blog"
            className="text-purple-200 hover:text-white text-sm mb-4 inline-block"
          >
            ← Back to News & Updates
          </a>
          <span
            className={`inline-block px-3 py-1 rounded-full text-xs font-semibold mb-4 ${categoryColors[post.category]}`}
          >
            {blogCategoryLabels[post.category]}
          </span>
          <h1 className="font-serif text-3xl md:text-4xl font-bold text-white mb-4">
            {post.title}
          </h1>
          <p className="text-purple-200 text-sm">
            Published on {post.publishedAt && formatDate(post.publishedAt)}
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Article Content */}
        <article className="prose prose-lg max-w-none">
          <div className="text-slate-600 dark:text-slate-300 leading-relaxed">
            {renderContent(post.content)}
          </div>
        </article>

        {/* Share & Actions */}
        <div className="mt-12 pt-8 border-t border-purple-100 dark:border-slate-700">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-2">
                Found this helpful?
              </p>
              <div className="flex gap-2">
                <button className="px-4 py-2 rounded-lg bg-purple-100 text-purple-700 hover:bg-purple-200 dark:bg-purple-900/30 dark:text-purple-400 text-sm font-medium transition-colors">
                  👍 Helpful
                </button>
                <button className="px-4 py-2 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-300 text-sm font-medium transition-colors">
                  Share
                </button>
              </div>
            </div>
            <a href="/blog" className="btn-outline text-sm py-2 px-4">
              More Articles
            </a>
          </div>
        </div>

        {/* Related Posts Placeholder */}
        <div className="mt-12">
          <h3 className="font-serif text-xl font-bold text-purple-900 dark:text-white mb-6">
            Related Articles
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <a
              href="/blog/spring-flower-festival-2026"
              className="card-magical p-4 hover:scale-[1.02] transition-transform"
            >
              <h4 className="font-semibold text-purple-900 dark:text-white mb-1">
                Spring Flower Festival Returns
              </h4>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                The beloved festival is back with over 100 topiaries...
              </p>
            </a>
            <a
              href="/blog/tips-beating-crowds"
              className="card-magical p-4 hover:scale-[1.02] transition-transform"
            >
              <h4 className="font-semibold text-purple-900 dark:text-white mb-1">
                5 Tips for Beating the Crowds
              </h4>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Our top strategies for maximizing your time...
              </p>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
