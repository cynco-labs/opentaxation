import { v } from "convex/values";
import { query, mutation } from "./_generated/server";
import { getAuthUserId } from "./authHelper";

export const listByPost = query({
  args: { postId: v.id("blogPosts") },
  handler: async (ctx, { postId }) => {
    const comments = await ctx.db
      .query("blogComments")
      .withIndex("by_post_approved", (q) =>
        q.eq("postId", postId).eq("isApproved", true),
      )
      .order("asc")
      .collect();

    return comments;
  },
});

export const add = mutation({
  args: {
    postId: v.id("blogPosts"),
    content: v.string(),
    parentId: v.optional(v.id("blogComments")),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const user = await ctx.db.get(userId);
    if (!user) throw new Error("User not found");

    // Verify post exists and is published
    const post = await ctx.db.get(args.postId);
    if (!post || post.status !== "published") {
      throw new Error("Post not found");
    }

    return await ctx.db.insert("blogComments", {
      postId: args.postId,
      userId,
      parentId: args.parentId,
      content: args.content,
      authorName: (user.name as string) ?? "Anonymous",
      isApproved: false,
    });
  },
});

// Admin: approve/reject comments
export const moderate = mutation({
  args: {
    id: v.id("blogComments"),
    isApproved: v.boolean(),
  },
  handler: async (ctx, { id, isApproved }) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    // Check admin
    const author = await ctx.db
      .query("blogAuthors")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .first();
    if (!author?.isActive) throw new Error("Not a blog admin");

    await ctx.db.patch(id, { isApproved });
  },
});
