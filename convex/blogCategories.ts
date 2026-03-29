import { v } from "convex/values";
import { query, mutation } from "./_generated/server";
import { getAuthUserId } from "./authHelper";

export const list = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("blogCategories")
      .collect()
      .then((cats) => cats.sort((a, b) => a.sortOrder - b.sortOrder));
  },
});

export const upsert = mutation({
  args: {
    name: v.string(),
    slug: v.string(),
    description: v.optional(v.string()),
    sortOrder: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const existing = await ctx.db
      .query("blogCategories")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .first();

    if (existing) {
      await ctx.db.patch(existing._id, {
        name: args.name,
        description: args.description,
        sortOrder: args.sortOrder ?? existing.sortOrder,
      });
      return existing._id;
    }

    return await ctx.db.insert("blogCategories", {
      name: args.name,
      slug: args.slug,
      description: args.description,
      sortOrder: args.sortOrder ?? 0,
    });
  },
});
