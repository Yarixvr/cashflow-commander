import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

// FOUNDER auth account ID - used to identify the admin
// This is the ID from the authAccounts table
const FOUNDER_AUTH_ACCOUNT_ID = "j977s2pz8h0j67a8ygzgbe49ph7t7wdn";

// Helper to check if the current user is the founder
async function checkIsFounder(ctx: any): Promise<{ isFounder: boolean; userId: any }> {
    const userId = await getAuthUserId(ctx);
    if (!userId) return { isFounder: false, userId: null };

    // Look up the auth account to see if this user is linked to the founder account
    const authAccounts = await ctx.db.query("authAccounts").collect();
    const founderAccount = authAccounts.find(
        (acc: any) => acc._id === FOUNDER_AUTH_ACCOUNT_ID ||
            (acc.userId === userId && acc._id === FOUNDER_AUTH_ACCOUNT_ID)
    );

    // Also check if this user's ID matches what the founder auth account links to
    const founderLinkedAccount = authAccounts.find(
        (acc: any) => acc._id === FOUNDER_AUTH_ACCOUNT_ID
    );

    const isFounder = founderLinkedAccount?.userId === userId;

    return { isFounder, userId };
}

// Check if current user is the founder/admin
export const isFounder = query({
    args: {},
    handler: async (ctx) => {
        const { isFounder } = await checkIsFounder(ctx);
        return isFounder;
    },
});

// List all available badges
export const listBadges = query({
    args: {},
    handler: async (ctx) => {
        return await ctx.db.query("badges").collect();
    },
});

// Get all badges for a specific user
export const getUserBadges = query({
    args: { userId: v.id("users") },
    handler: async (ctx, args) => {
        const userBadges = await ctx.db
            .query("userBadges")
            .withIndex("by_user", (q) => q.eq("userId", args.userId))
            .collect();

        const badges = await Promise.all(
            userBadges.map(async (ub) => {
                const badge = await ctx.db.get(ub.badgeId);
                return badge ? { ...badge, assignedAt: ub.assignedAt } : null;
            })
        );

        return badges.filter(Boolean);
    },
});

// Get current user's badges
export const getMyBadges = query({
    args: {},
    handler: async (ctx) => {
        const userId = await getAuthUserId(ctx);
        if (!userId) return [];

        const userBadges = await ctx.db
            .query("userBadges")
            .withIndex("by_user", (q) => q.eq("userId", userId))
            .collect();

        const badges = await Promise.all(
            userBadges.map(async (ub) => {
                const badge = await ctx.db.get(ub.badgeId);
                return badge ? { ...badge, assignedAt: ub.assignedAt } : null;
            })
        );

        return badges.filter(Boolean);
    },
});

// Admin only: Create a new badge type
export const createBadge = mutation({
    args: {
        name: v.string(),
        displayName: v.string(),
        description: v.string(),
        icon: v.string(),
        color: v.string(),
    },
    handler: async (ctx, args) => {
        const { isFounder, userId } = await checkIsFounder(ctx);
        if (!isFounder) {
            throw new Error("Only the founder can create badges");
        }

        // Check if badge with this name already exists
        const existing = await ctx.db
            .query("badges")
            .withIndex("by_name", (q) => q.eq("name", args.name))
            .unique();

        if (existing) {
            throw new Error("Badge with this name already exists");
        }

        return await ctx.db.insert("badges", {
            name: args.name,
            displayName: args.displayName,
            description: args.description,
            icon: args.icon,
            color: args.color,
            createdAt: Date.now(),
        });
    },
});

// Admin only: Assign a badge to a user
export const assignBadge = mutation({
    args: {
        targetUserId: v.id("users"),
        badgeId: v.id("badges"),
    },
    handler: async (ctx, args) => {
        const { isFounder, userId } = await checkIsFounder(ctx);
        if (!isFounder) {
            throw new Error("Only the founder can assign badges");
        }

        // Check if user already has this badge
        const existingAssignment = await ctx.db
            .query("userBadges")
            .withIndex("by_user", (q) => q.eq("userId", args.targetUserId))
            .filter((q) => q.eq(q.field("badgeId"), args.badgeId))
            .unique();

        if (existingAssignment) {
            throw new Error("User already has this badge");
        }

        // Verify badge exists
        const badge = await ctx.db.get(args.badgeId);
        if (!badge) {
            throw new Error("Badge not found");
        }

        return await ctx.db.insert("userBadges", {
            userId: args.targetUserId,
            badgeId: args.badgeId,
            assignedAt: Date.now(),
            assignedBy: userId,
        });
    },
});

// Admin only: Revoke a badge from a user
export const revokeBadge = mutation({
    args: {
        targetUserId: v.id("users"),
        badgeId: v.id("badges"),
    },
    handler: async (ctx, args) => {
        const { isFounder } = await checkIsFounder(ctx);
        if (!isFounder) {
            throw new Error("Only the founder can revoke badges");
        }

        const assignment = await ctx.db
            .query("userBadges")
            .withIndex("by_user", (q) => q.eq("userId", args.targetUserId))
            .filter((q) => q.eq(q.field("badgeId"), args.badgeId))
            .unique();

        if (!assignment) {
            throw new Error("User does not have this badge");
        }

        await ctx.db.delete(assignment._id);
    },
});

// Initialize the FOUNDER badge and assign it to the current user if they are the founder
// This is called on app startup by the ProfilePage
export const initializeFounderBadge = mutation({
    args: {},
    handler: async (ctx) => {
        const { isFounder, userId } = await checkIsFounder(ctx);

        // Only proceed if we have a valid user
        if (!userId) {
            return { badgeId: null, alreadyExists: false, assigned: false };
        }

        // Check if FOUNDER badge already exists
        const existingBadge = await ctx.db
            .query("badges")
            .withIndex("by_name", (q) => q.eq("name", "FOUNDER"))
            .unique();

        let badgeId;

        if (!existingBadge) {
            // Create the FOUNDER badge
            badgeId = await ctx.db.insert("badges", {
                name: "FOUNDER",
                displayName: "Founder",
                description: "The creator and owner of CashFlow Commander",
                icon: "👑",
                color: "#FFD700",
                createdAt: Date.now(),
            });
        } else {
            badgeId = existingBadge._id;
        }

        // Only assign to founder
        if (!isFounder) {
            return { badgeId, alreadyExists: !!existingBadge, assigned: false };
        }

        // Check if founder already has the badge
        const existingAssignment = await ctx.db
            .query("userBadges")
            .withIndex("by_user", (q) => q.eq("userId", userId))
            .filter((q) => q.eq(q.field("badgeId"), badgeId))
            .unique();

        if (!existingAssignment) {
            // Assign FOUNDER badge to the founder
            await ctx.db.insert("userBadges", {
                userId: userId,
                badgeId,
                assignedAt: Date.now(),
                assignedBy: userId,
            });
        }

        return { badgeId, alreadyExists: !!existingBadge, assigned: true };
    },
});

// Get all users with their profiles (for admin badge management)
export const listAllUsers = query({
    args: {},
    handler: async (ctx) => {
        const { isFounder } = await checkIsFounder(ctx);
        if (!isFounder) {
            return [];
        }

        // Get all user profiles
        const profiles = await ctx.db.query("userProfiles").collect();

        // Get badges for each user
        const usersWithBadges = await Promise.all(
            profiles.map(async (profile) => {
                const userBadges = await ctx.db
                    .query("userBadges")
                    .withIndex("by_user", (q) => q.eq("userId", profile.userId))
                    .collect();

                const badges = await Promise.all(
                    userBadges.map(async (ub) => await ctx.db.get(ub.badgeId))
                );

                return {
                    ...profile,
                    badges: badges.filter(Boolean),
                };
            })
        );

        return usersWithBadges;
    },
});
