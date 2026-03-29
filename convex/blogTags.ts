import { v } from "convex/values";
import { query, mutation } from "./_generated/server";
import { getAuthUserId } from "./authHelper";

export const list = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("blogTags")
      .collect()
      .then((tags) => tags.sort((a, b) => a.name.localeCompare(b.name)));
  },
});

export const upsert = mutation({
  args: {
    name: v.string(),
    slug: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const existing = await ctx.db
      .query("blogTags")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .first();

    if (existing) {
      await ctx.db.patch(existing._id, { name: args.name });
      return existing._id;
    }

    return await ctx.db.insert("blogTags", {
      name: args.name,
      slug: args.slug,
    });
  },
});
