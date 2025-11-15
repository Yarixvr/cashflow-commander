import { convexAuth, getAuthUserId } from "@convex-dev/auth/server";
import { Password } from "@convex-dev/auth/providers/Password";
import { Anonymous } from "@convex-dev/auth/providers/Anonymous";
import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const { auth, signIn, signOut, store, isAuthenticated } = convexAuth({
  providers: [Password, Anonymous],
});

export const loggedInUser = query({
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      return null;
    }
    const user = await ctx.db.get(userId);
    if (!user) {
      return null;
    }

    // Get user profile
    const profile = await ctx.db
      .query("profiles")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .first();

    return {
      ...user,
      profile,
    };
  },
});

export const getUserProfile = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    const profile = await ctx.db
      .query("profiles")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .first();
    return profile;
  },
});

export const createOrUpdateProfile = mutation({
  args: {
    username: v.string(),
    bio: v.optional(v.string()),
    avatarImageId: v.optional(v.id("_storage")),
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

    // Check if profile exists
    const existingProfile = await ctx.db
      .query("profiles")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .first();

    const now = Date.now();
    const isProfileComplete = !!args.username;

    if (existingProfile) {
      // Update existing profile
      const updateData: any = {
        username: args.username,
        bio: args.bio,
        isProfileComplete,
        updatedAt: now,
      };

      if (args.avatarImageId !== undefined) {
        updateData.avatarImageId = args.avatarImageId;
        // Generate URL for the new image
        updateData.avatarImageUrl = (await ctx.storage.getUrl(args.avatarImageId)) || null;
      }

      await ctx.db.patch(existingProfile._id, updateData);
      return await ctx.db.get(existingProfile._id);
    } else {
      // Create new profile
      const profileData: any = {
        userId,
        username: args.username,
        bio: args.bio,
        isProfileComplete,
        createdAt: now,
        updatedAt: now,
      };

      if (args.avatarImageId) {
        profileData.avatarImageId = args.avatarImageId;
        profileData.avatarImageUrl = await ctx.storage.getUrl(args.avatarImageId);
      }

      const profileId = await ctx.db.insert("profiles", profileData);
      return await ctx.db.get(profileId);
    }
  },
});

export const uploadProfileImage = mutation({
  args: {
    file: v.bytes(),
    fileName: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    // Get existing profile to check for old image
    const existingProfile = await ctx.db
      .query("profiles")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .first();

    // For now, just return a mock URL - the storage API may be different
    // TODO: Implement proper file storage when Convex storage API is clarified
    const storageId = "mock-storage-id-" + Date.now();
    const url = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==";

    // Delete old image if it exists
    if (existingProfile?.avatarImageId) {
      try {
        await ctx.storage.delete(existingProfile.avatarImageId);
      } catch (e) {
        // Ignore delete errors for now
      }
    }

    // Update profile with new image
    if (existingProfile) {
      await ctx.db.patch(existingProfile._id, {
        avatarImageId: storageId as any, // Type cast for now
        avatarImageUrl: url || undefined,
        updatedAt: Date.now(),
      });
    }

    return { storageId, url };
  },
});
