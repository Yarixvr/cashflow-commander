import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

export const getProfileByUserId = query({
  args: { userId: v.optional(v.id("users")) },
  handler: async (ctx, args) => {
    const userId = args.userId || (await getAuthUserId(ctx));
    if (!userId) {
      return null;
    }

    const profile = await ctx.db
      .query("profiles")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .first();

    return profile;
  },
});

export const updateProfile = mutation({
  args: {
    username: v.string(),
    bio: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    // Validation
    if (args.username.length < 2) {
      throw new Error("Username must be at least 2 characters");
    }
    if (args.username.length > 30) {
      throw new Error("Username cannot exceed 30 characters");
    }
    if (args.bio && args.bio.length > 150) {
      throw new Error("Bio cannot exceed 150 characters");
    }

    const existingProfile = await ctx.db
      .query("profiles")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .first();

    const now = Date.now();
    const isProfileComplete = !!args.username;

    if (existingProfile) {
      // Update existing profile
      await ctx.db.patch(existingProfile._id, {
        username: args.username,
        bio: args.bio,
        isProfileComplete,
        updatedAt: now,
      });
      return await ctx.db.get(existingProfile._id);
    } else {
      // Create new profile
      const profileId = await ctx.db.insert("profiles", {
        userId,
        username: args.username,
        bio: args.bio,
        isProfileComplete,
        createdAt: now,
        updatedAt: now,
      });
      return await ctx.db.get(profileId);
    }
  },
});

export const updateAvatar = mutation({
  args: {
    avatarImageId: v.id("_storage"),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    const existingProfile = await ctx.db
      .query("profiles")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .first();

    if (!existingProfile) {
      throw new Error("Profile not found. Please create a profile first.");
    }

    // Get URL for the new image
    const avatarImageUrl = await ctx.storage.getUrl(args.avatarImageId);

    // Delete old image if it exists
    if (existingProfile.avatarImageId) {
      await ctx.storage.delete(existingProfile.avatarImageId);
    }

    // Update profile with new image
    await ctx.db.patch(existingProfile._id, {
      avatarImageId: args.avatarImageId,
      avatarImageUrl,
      updatedAt: Date.now(),
    });

    return await ctx.db.get(existingProfile._id);
  },
});

export const deleteAvatar = mutation({
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    const existingProfile = await ctx.db
      .query("profiles")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .first();

    if (!existingProfile || !existingProfile.avatarImageId) {
      return null; // No avatar to delete
    }

    // Delete the image from storage
    await ctx.storage.delete(existingProfile.avatarImageId);

    // Update profile to remove avatar references
    await ctx.db.patch(existingProfile._id, {
      avatarImageId: undefined,
      avatarImageUrl: undefined,
      updatedAt: Date.now(),
    });

    return await ctx.db.get(existingProfile._id);
  },
});

export const checkProfileCompletion = query({
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      return { isComplete: false, needsProfile: true };
    }

    const profile = await ctx.db
      .query("profiles")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .first();

    return {
      isComplete: profile?.isProfileComplete || false,
      needsProfile: !profile,
      profile: profile || null,
    };
  },
});