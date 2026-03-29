import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({

  // ─── Saved Calculations ────────────────────────────────────────────
  savedCalculations: defineTable({
    userId: v.id("users"),
    name: v.string(),
    inputs: v.any(), // TaxCalculationInputs JSON
    results: v.any(), // ComparisonResult JSON
    taxYear: v.optional(v.string()),
    engineVersion: v.optional(v.string()),
    verified: v.optional(v.boolean()),
    computedAt: v.optional(v.string()),
  })
    .index("by_user", ["userId"])
    .index("by_user_and_name", ["userId", "name"]),

  // ─── Leads ─────────────────────────────────────────────────────────
  leads: defineTable({
    email: v.string(),
    leadType: v.union(
      v.literal("incorporation"),
      v.literal("newsletter"),
      v.literal("partner_inquiry"),
    ),
    source: v.optional(v.string()),
    metadata: v.optional(v.any()),
    userId: v.optional(v.id("users")),
    contactedAt: v.optional(v.string()),
    status: v.union(
      v.literal("new"),
      v.literal("contacted"),
      v.literal("converted"),
      v.literal("unsubscribed"),
    ),
  })
    .index("by_email", ["email"])
    .index("by_status", ["status"]),

  // ─── Blog Authors ──────────────────────────────────────────────────
  blogAuthors: defineTable({
    userId: v.optional(v.id("users")),
    name: v.string(),
    email: v.string(),
    bio: v.optional(v.string()),
    avatarUrl: v.optional(v.string()),
    isActive: v.boolean(),
  })
    .index("by_email", ["email"])
    .index("by_userId", ["userId"]),

  // ─── Blog Categories ──────────────────────────────────────────────
  blogCategories: defineTable({
    name: v.string(),
    slug: v.string(),
    description: v.optional(v.string()),
    sortOrder: v.number(),
  }).index("by_slug", ["slug"]),

  // ─── Blog Tags ─────────────────────────────────────────────────────
  blogTags: defineTable({
    name: v.string(),
    slug: v.string(),
  }).index("by_slug", ["slug"]),

  // ─── Blog Posts ────────────────────────────────────────────────────
  blogPosts: defineTable({
    title: v.string(),
    slug: v.string(),
    content: v.string(),
    excerpt: v.optional(v.string()),
    coverImageId: v.optional(v.id("_storage")),
    coverImageUrl: v.optional(v.string()),
    authorId: v.id("blogAuthors"),
    categoryId: v.optional(v.id("blogCategories")),
    status: v.union(
      v.literal("draft"),
      v.literal("published"),
      v.literal("scheduled"),
      v.literal("archived"),
    ),
    locale: v.union(v.literal("en"), v.literal("ms")),
    publishedAt: v.optional(v.string()),
    scheduledFor: v.optional(v.string()),
    metaTitle: v.optional(v.string()),
    metaDescription: v.optional(v.string()),
    readingTimeMinutes: v.optional(v.number()),
    viewCount: v.number(),
    isFeatured: v.optional(v.boolean()),
  })
    .index("by_slug", ["slug"])
    .index("by_status", ["status"])
    .index("by_author", ["authorId"])
    .index("by_category", ["categoryId"])
    .index("by_status_published", ["status", "publishedAt"]),

  // ─── Blog Post Tags (junction) ────────────────────────────────────
  blogPostTags: defineTable({
    postId: v.id("blogPosts"),
    tagId: v.id("blogTags"),
  })
    .index("by_post", ["postId"])
    .index("by_tag", ["tagId"]),

  // ─── Blog Comments ─────────────────────────────────────────────────
  blogComments: defineTable({
    postId: v.id("blogPosts"),
    userId: v.id("users"),
    parentId: v.optional(v.id("blogComments")),
    content: v.string(),
    authorName: v.string(),
    isApproved: v.boolean(),
  })
    .index("by_post", ["postId"])
    .index("by_user", ["userId"])
    .index("by_post_approved", ["postId", "isApproved"]),

  // ─── Blog Bookmarks ───────────────────────────────────────────────
  blogBookmarks: defineTable({
    postId: v.id("blogPosts"),
    userId: v.id("users"),
  })
    .index("by_user", ["userId"])
    .index("by_post_user", ["postId", "userId"]),
});
