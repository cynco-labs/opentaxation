import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getAuthUserId } from "./authHelper";

export const list = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];
    return await ctx.db
      .query("savedCalculations")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .order("desc")
      .collect();
  },
});

export const get = query({
  args: { id: v.id("savedCalculations") },
  handler: async (ctx, { id }) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return null;
    const calc = await ctx.db.get(id);
    if (!calc || calc.userId !== userId) return null;
    return calc;
  },
});

export const save = mutation({
  args: {
    name: v.string(),
    inputs: v.any(),
    results: v.any(),
    taxYear: v.optional(v.string()),
    engineVersion: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");
    return await ctx.db.insert("savedCalculations", {
      userId,
      name: args.name,
      inputs: args.inputs,
      results: args.results,
      taxYear: args.taxYear,
      engineVersion: args.engineVersion,
      verified: false,
      computedAt: new Date().toISOString(),
    });
  },
});

export const update = mutation({
  args: {
    id: v.id("savedCalculations"),
    name: v.optional(v.string()),
    inputs: v.optional(v.any()),
    results: v.optional(v.any()),
  },
  handler: async (ctx, { id, ...updates }) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");
    const calc = await ctx.db.get(id);
    if (!calc || calc.userId !== userId) throw new Error("Not found");

    const patch: Record<string, unknown> = {};
    if (updates.name !== undefined) patch.name = updates.name;
    if (updates.inputs !== undefined) patch.inputs = updates.inputs;
    if (updates.results !== undefined) patch.results = updates.results;

    await ctx.db.patch(id, patch);
  },
});

export const remove = mutation({
  args: { id: v.id("savedCalculations") },
  handler: async (ctx, { id }) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");
    const calc = await ctx.db.get(id);
    if (!calc || calc.userId !== userId) throw new Error("Not found");
    await ctx.db.delete(id);
  },
});
