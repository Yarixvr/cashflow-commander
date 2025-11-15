import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

export const getUserBadges = query({
  args: { userId: v.optional(v.id("users")) },
  handler: async (ctx, args) => {
    const userId = args.userId || (await getAuthUserId(ctx));
    if (!userId) {
      return [];
    }

    const badges = await ctx.db
      .query("userBadges")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .filter((q) => q.eq("isActive", true))
      .collect();

    return badges;
  },
});

export const grantBadge = mutation({
  args: {
    targetUserId: v.id("users"),
    badgeType: v.union(v.literal("founder"), v.literal("admin"), v.literal("special"), v.literal("custom")),
    badgeName: v.string(),
    badgeColor: v.string(),
    badgeIcon: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const adminUserId = await getAuthUserId(ctx);
    if (!adminUserId) {
      throw new Error("Not authenticated");
    }

    // Check if current user has admin permissions
    const adminBadges = await ctx.db
      .query("userBadges")
      .withIndex("by_user", (q) => q.eq("userId", adminUserId))
      .filter((q) => q.eq("badgeType", "admin"))
      .collect();

    if (adminBadges.length === 0) {
      throw new Error("Admin permissions required");
    }

    // Check if user already has this badge type
    const existingBadge = await ctx.db
      .query("userBadges")
      .withIndex("by_user", (q) => q.eq("userId", args.targetUserId))
      .filter((q) => q.eq("badgeType", args.badgeType))
      .first();

    if (existingBadge) {
      throw new Error("User already has this badge type");
    }

    // Grant the badge
    const badgeId = await ctx.db.insert("userBadges", {
      userId: args.targetUserId,
      badgeType: args.badgeType,
      badgeName: args.badgeName,
      badgeColor: args.badgeColor,
      badgeIcon: args.badgeIcon,
      grantedBy: adminUserId,
      grantedAt: Date.now(),
      isActive: true,
    });

    return await ctx.db.get(badgeId);
  },
});

export const revokeBadge = mutation({
  args: {
    badgeId: v.id("userBadges"),
  },
  handler: async (ctx, args) => {
    const adminUserId = await getAuthUserId(ctx);
    if (!adminUserId) {
      throw new Error("Not authenticated");
    }

    // Check admin permissions
    const adminBadges = await ctx.db
      .query("userBadges")
      .withIndex("by_user", (q) => q.eq("userId", adminUserId))
      .filter((q) => q.eq("badgeType", "admin"))
      .collect();

    if (adminBadges.length === 0) {
      throw new Error("Admin permissions required");
    }

    // Get the badge to revoke
    const badge = await ctx.db.get(args.badgeId);
    if (!badge) {
      throw new Error("Badge not found");
    }

    // Deactivate the badge (don't delete for record keeping)
    await ctx.db.patch(args.badgeId, {
      isActive: false,
    });

    return { success: true };
  },
});

export const getAllBadges = query({
  handler: async (ctx) => {
    const badges = await ctx.db
      .query("userBadges")
      .filter((q) => q.eq("isActive", true))
      .collect();

    // Get user details for each badge
    const badgeUsers = await Promise.all(
      badges.map(async (badge) => ({
        ...badge,
        grantedBy: await ctx.db.get(badge.grantedBy),
        user: await ctx.db.get(badge.userId),
      }))
    );

    return badgeUsers;
  },
});