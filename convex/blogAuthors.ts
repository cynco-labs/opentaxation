import { v } from "convex/values";
import { query, mutation, internalMutation } from "./_generated/server";
import { getAuthUserId } from "./authHelper";

export const list = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("blogAuthors")
      .filter((q) => q.eq(q.field("isActive"), true))
      .collect();
  },
});

export const getByUserId = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return null;

    // Check by userId first
    const byId = await ctx.db
      .query("blogAuthors")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .first();
    if (byId?.isActive) return byId;

    // Check by email as fallback
    const user = await ctx.db.get(userId);
    if (!user?.email) return null;

    const byEmail = await ctx.db
      .query("blogAuthors")
      .withIndex("by_email", (q) => q.eq("email", user.email as string))
      .first();

    if (byEmail?.isActive) {
      // Link user to author if not already linked
      if (!byEmail.userId) {
        await ctx.db.patch(byEmail._id, { userId });
      }
      return byEmail;
    }

    return null;
  },
});

export const isBlogAdmin = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return false;

    const byId = await ctx.db
      .query("blogAuthors")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .first();
    if (byId?.isActive) return true;

    const user = await ctx.db.get(userId);
    if (!user?.email) return false;

    const byEmail = await ctx.db
      .query("blogAuthors")
      .withIndex("by_email", (q) => q.eq("email", user.email as string))
      .first();

    return byEmail?.isActive ?? false;
  },
});

// Called internally when a new user signs up to auto-link to blog author
export const linkUserToAuthor = internalMutation({
  args: { userId: v.id("users"), email: v.string() },
  handler: async (ctx, { userId, email }) => {
    const author = await ctx.db
      .query("blogAuthors")
      .withIndex("by_email", (q) => q.eq("email", email))
      .first();

    if (author && !author.userId) {
      await ctx.db.patch(author._id, { userId });
    }
  },
});
