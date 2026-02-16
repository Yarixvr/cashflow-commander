import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

// FOUNDER identifiers
const FOUNDER_AUTH_ACCOUNT_ID = "j977s2pz8h0j67a8ygzgbe49ph7t7wdn";
const FOUNDER_USER_ID = "kh73ra4kd4amrrqm3e0hvdgxv17t6nrx";

// Helper: check if the current user is the founder
async function checkIsFounder(ctx: any): Promise<{ isFounder: boolean; userId: any }> {
    const userId = await getAuthUserId(ctx);
    if (!userId) return { isFounder: false, userId: null };

    // Direct userId check (most reliable)
    if (userId === FOUNDER_USER_ID) {
        return { isFounder: true, userId };
    }

    // Fallback: check via authAccounts link
    const authAccounts = await ctx.db.query("authAccounts").collect();
    const founderLinkedAccount = authAccounts.find(
        (acc: any) => acc._id === FOUNDER_AUTH_ACCOUNT_ID
    );

    const isFounder = founderLinkedAccount?.userId === userId;
    return { isFounder, userId };
}

// =============================================================
// Any authenticated user can submit a suggestion
// =============================================================
export const submitSuggestion = mutation({
    args: {
        message: v.string(),
    },
    handler: async (ctx, args) => {
        const userId = await getAuthUserId(ctx);
        // We require authentication (even anonymous auth counts)
        if (!userId) throw new Error("Not authenticated");

        const trimmed = args.message.trim();
        if (!trimmed || trimmed.length < 3) {
            throw new Error("Suggestion must be at least 3 characters");
        }
        if (trimmed.length > 1000) {
            throw new Error("Suggestion must be 1000 characters or fewer");
        }

        // Try to get the user's profile name
        const profile = await ctx.db
            .query("userProfiles")
            .withIndex("by_user", (q) => q.eq("userId", userId))
            .unique();

        const senderName = profile?.username || "Anonymous";

        return await ctx.db.insert("suggestions", {
            userId,
            senderName,
            message: trimmed,
            status: "new",
            createdAt: Date.now(),
        });
    },
});

// =============================================================
// Founder-only: get all suggestions (newest first)
// =============================================================
export const getFounderSuggestions = query({
    args: {},
    handler: async (ctx) => {
        const { isFounder } = await checkIsFounder(ctx);
        if (!isFounder) return [];

        const suggestions = await ctx.db
            .query("suggestions")
            .withIndex("by_createdAt")
            .order("desc")
            .collect();

        return suggestions;
    },
});

// =============================================================
// Founder-only: count of unread suggestions
// =============================================================
export const getUnreadCount = query({
    args: {},
    handler: async (ctx) => {
        const { isFounder } = await checkIsFounder(ctx);
        if (!isFounder) return 0;

        const newSuggestions = await ctx.db
            .query("suggestions")
            .withIndex("by_status", (q) => q.eq("status", "new"))
            .collect();

        return newSuggestions.length;
    },
});

// =============================================================
// Founder-only: mark suggestion as read
// =============================================================
export const markAsRead = mutation({
    args: { suggestionId: v.id("suggestions") },
    handler: async (ctx, args) => {
        const { isFounder } = await checkIsFounder(ctx);
        if (!isFounder) throw new Error("Only the founder can manage suggestions");

        await ctx.db.patch(args.suggestionId, { status: "read" });
    },
});

// =============================================================
// Founder-only: archive a suggestion
// =============================================================
export const archiveSuggestion = mutation({
    args: { suggestionId: v.id("suggestions") },
    handler: async (ctx, args) => {
        const { isFounder } = await checkIsFounder(ctx);
        if (!isFounder) throw new Error("Only the founder can manage suggestions");

        await ctx.db.patch(args.suggestionId, { status: "archived" });
    },
});
