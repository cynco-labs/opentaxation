import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const submit = mutation({
  args: {
    email: v.string(),
    leadType: v.union(
      v.literal("incorporation"),
      v.literal("newsletter"),
      v.literal("partner_inquiry"),
    ),
    source: v.optional(v.string()),
    metadata: v.optional(v.any()),
  },
  handler: async (ctx, args) => {
    // Check if email already exists
    const existing = await ctx.db
      .query("leads")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .first();

    if (existing) return existing._id;

    return await ctx.db.insert("leads", {
      email: args.email,
      leadType: args.leadType,
      source: args.source,
      metadata: args.metadata,
      status: "new",
    });
  },
});

export const checkExists = query({
  args: { email: v.string() },
  handler: async (ctx, { email }) => {
    const lead = await ctx.db
      .query("leads")
      .withIndex("by_email", (q) => q.eq("email", email))
      .first();
    return !!lead;
  },
});
