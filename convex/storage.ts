import { mutation } from "./_generated/server";
import { getAuthUserId } from "./authHelper";

export const generateUploadUrl = mutation({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    // Verify user is a blog admin before allowing uploads
    const author = await ctx.db
      .query("blogAuthors")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .first();

    if (!author?.isActive) {
      const user = await ctx.db.get(userId);
      if (user?.email) {
        const byEmail = await ctx.db
          .query("blogAuthors")
          .withIndex("by_email", (q) => q.eq("email", user.email as string))
          .first();
        if (!byEmail?.isActive) throw new Error("Not authorized to upload");
      } else {
        throw new Error("Not authorized to upload");
      }
    }

    return await ctx.storage.generateUploadUrl();
  },
});
