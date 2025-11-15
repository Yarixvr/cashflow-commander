import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

// Simple users query for admin panel
export const listUsers = query({
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      return [];
    }

    const users = await ctx.db.query("users").collect();
    return users.map(user => ({
      ...user,
      // Remove sensitive data for admin panel
      password: undefined,
    }));
  },
});

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
      .filter((q) => q.eq("isActive", true as any))
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

export const initializeBadges = mutation({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    // Check if this is the initial setup
    const existingBadges = await ctx.db
      .query("userBadges")
      .filter((q) => q.eq("isActive", true as any))
      .collect();

    if (existingBadges.length > 0) {
      return { message: "Badges already initialized", alreadyExists: true };
    }

    const user = await ctx.db.get(userId);
    if (!user) {
      throw new Error("User not found");
    }

    // Check if this is Yari (kn77xa9x1ttgbk1jw8p234d0cd7vfqjn)
    const isYari = userId === "kn77xa9x1ttgbk1jw8p234d0cd7vfqjn";

    const badgesToGrant = [];

    // Grant founder badge to Yari
    if (isYari) {
      badgesToGrant.push({
        userId: userId,
        badgeType: "founder" as const,
        badgeName: "Cashflow Commander Founder",
        badgeColor: "#FFD700",
        badgeIcon: "👑",
        grantedBy: userId, // Self-granted
        grantedAt: Date.now(),
        isActive: true,
      });

      // Also grant admin badge to Yari
      badgesToGrant.push({
        userId: userId,
        badgeType: "admin" as const,
        badgeName: "System Administrator",
        badgeColor: "#FF6B35",
        badgeIcon: "⚡",
        grantedBy: userId, // Self-granted
        grantedAt: Date.now(),
        isActive: true,
      });
    }

    // Insert all badges
    const insertedBadges = await Promise.all(
      badgesToGrant.map(async (badge) => {
        const badgeId = await ctx.db.insert("userBadges", badge);
        return await ctx.db.get(badgeId);
      })
    );

    return {
      message: `Initialized ${insertedBadges.length} badges for ${user.email}`,
      badges: insertedBadges,
      alreadyExists: false
    };
  },
});

export const getAllBadges = query({
  handler: async (ctx) => {
    const badges = await ctx.db
      .query("userBadges")
      .filter((q) => q.eq("isActive", true as any))
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