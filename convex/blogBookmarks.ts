import { v } from "convex/values";
import { query, mutation } from "./_generated/server";
import { getAuthUserId } from "./authHelper";

export const isBookmarked = query({
  args: { postId: v.id("blogPosts") },
  handler: async (ctx, { postId }) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return false;

    const bookmark = await ctx.db
      .query("blogBookmarks")
      .withIndex("by_post_user", (q) =>
        q.eq("postId", postId).eq("userId", userId),
      )
      .first();

    return !!bookmark;
  },
});

export const toggle = mutation({
  args: { postId: v.id("blogPosts") },
  handler: async (ctx, { postId }) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const existing = await ctx.db
      .query("blogBookmarks")
      .withIndex("by_post_user", (q) =>
        q.eq("postId", postId).eq("userId", userId),
      )
      .first();

    if (existing) {
      await ctx.db.delete(existing._id);
      return false;
    }

    await ctx.db.insert("blogBookmarks", { postId, userId });
    return true;
  },
});

export const listByUser = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];

    const bookmarks = await ctx.db
      .query("blogBookmarks")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();

    const posts = await Promise.all(
      bookmarks.map(async (b) => {
        const post = await ctx.db.get(b.postId);
        if (!post || post.status !== "published") return null;
        const author = await ctx.db.get(post.authorId);
        return {
          ...post,
          id: post._id,
          author: author ? { name: author.name } : null,
          bookmarkedAt: b._creationTime,
        };
      }),
    );

    return posts.filter(Boolean);
  },
});
