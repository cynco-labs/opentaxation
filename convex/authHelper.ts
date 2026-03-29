import { authComponent } from "./auth";
import type { Id } from "./_generated/dataModel";

/**
 * Get the authenticated user's Convex document ID.
 * Returns null if not authenticated.
 */
export async function getAuthUserId(ctx: any): Promise<Id<"users"> | null> {
  const user = await authComponent.getAuthUser(ctx);
  return user?._id ?? null;
}
