import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

const defaultCategories = [
  // Expense categories
  { name: "Food & Dining", icon: "🍽️", color: "#FF6B6B", type: "expense" as const },
  { name: "Transportation", icon: "🚗", color: "#4ECDC4", type: "expense" as const },
  { name: "Shopping", icon: "🛍️", color: "#45B7D1", type: "expense" as const },
  { name: "Entertainment", icon: "🎬", color: "#96CEB4", type: "expense" as const },
  { name: "Bills & Utilities", icon: "⚡", color: "#FFEAA7", type: "expense" as const },
  { name: "Healthcare", icon: "🏥", color: "#DDA0DD", type: "expense" as const },
  { name: "Education", icon: "📚", color: "#98D8C8", type: "expense" as const },
  { name: "Travel", icon: "✈️", color: "#F7DC6F", type: "expense" as const },
  
  // Income categories
  { name: "Salary", icon: "💼", color: "#2ECC71", type: "income" as const },
  { name: "Freelance", icon: "💻", color: "#3498DB", type: "income" as const },
  { name: "Investment", icon: "📈", color: "#9B59B6", type: "income" as const },
  { name: "Gift", icon: "🎁", color: "#E74C3C", type: "income" as const },
  { name: "Other", icon: "💰", color: "#34495E", type: "income" as const },
];

export const list = query({
  args: {
    type: v.optional(v.union(v.literal("income"), v.literal("expense"))),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];

    let categories = await ctx.db
      .query("categories")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();

    if (args.type) {
      categories = categories.filter(cat => cat.type === args.type);
    }

    return categories;
  },
});

export const initializeDefaults = mutation({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    // Check if user already has categories
    const existingCategories = await ctx.db
      .query("categories")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();

    if (existingCategories.length > 0) {
      return; // Already initialized
    }

    // Create default categories
    for (const category of defaultCategories) {
      await ctx.db.insert("categories", {
        userId,
        name: category.name,
        icon: category.icon,
        color: category.color,
        type: category.type,
        isDefault: true,
      });
    }
  },
});

export const create = mutation({
  args: {
    name: v.string(),
    icon: v.string(),
    color: v.string(),
    type: v.union(v.literal("income"), v.literal("expense")),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    return await ctx.db.insert("categories", {
      userId,
      name: args.name,
      icon: args.icon,
      color: args.color,
      type: args.type,
      isDefault: false,
    });
  },
});
