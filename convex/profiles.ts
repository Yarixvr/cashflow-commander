import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

// Get the current user's profile
export const getMyProfile = query({
    args: {},
    handler: async (ctx) => {
        const userId = await getAuthUserId(ctx);
        if (!userId) return null;

        const profile = await ctx.db
            .query("userProfiles")
            .withIndex("by_user", (q) => q.eq("userId", userId))
            .unique();

        return profile;
    },
});

// Get any user's profile by userId
export const getProfile = query({
    args: { userId: v.id("users") },
    handler: async (ctx, args) => {
        const profile = await ctx.db
            .query("userProfiles")
            .withIndex("by_user", (q) => q.eq("userId", args.userId))
            .unique();

        return profile;
    },
});

// Create or update the current user's profile
export const upsertProfile = mutation({
    args: {
        username: v.string(),
        profilePictureUrl: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        const userId = await getAuthUserId(ctx);
        if (!userId) throw new Error("Not authenticated");

        const existingProfile = await ctx.db
            .query("userProfiles")
            .withIndex("by_user", (q) => q.eq("userId", userId))
            .unique();

        const now = Date.now();

        if (existingProfile) {
            // Update existing profile
            await ctx.db.patch(existingProfile._id, {
                username: args.username,
                profilePictureUrl: args.profilePictureUrl,
                updatedAt: now,
            });
            return existingProfile._id;
        } else {
            // Create new profile
            return await ctx.db.insert("userProfiles", {
                userId,
                username: args.username,
                profilePictureUrl: args.profilePictureUrl,
                createdAt: now,
                updatedAt: now,
            });
        }
    },
});

// Get profile with user info (for display purposes)
export const getMyProfileWithBadges = query({
    args: {},
    handler: async (ctx) => {
        const userId = await getAuthUserId(ctx);
        if (!userId) return null;

        const profile = await ctx.db
            .query("userProfiles")
            .withIndex("by_user", (q) => q.eq("userId", userId))
            .unique();

        // Get user's badges
        const userBadges = await ctx.db
            .query("userBadges")
            .withIndex("by_user", (q) => q.eq("userId", userId))
            .collect();

        const badges = await Promise.all(
            userBadges.map(async (ub) => {
                const badge = await ctx.db.get(ub.badgeId);
                return badge;
            })
        );

        return {
            ...profile,
            userId,
            badges: badges.filter(Boolean),
        };
    },
});
