import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

export const list = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];

    const budgets = await ctx.db
      .query("budgets")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .filter((q) => q.eq(q.field("isActive"), true))
      .collect();

    // Calculate spent amount for each budget
    const budgetsWithSpent = await Promise.all(
      budgets.map(async (budget) => {
        const transactions = await ctx.db
          .query("transactions")
          .withIndex("by_user_and_date", (q) => 
            q.eq("userId", userId)
             .gte("date", budget.startDate)
             .lte("date", budget.endDate)
          )
          .filter((q) => 
            q.and(
              q.eq(q.field("type"), "expense"),
              q.eq(q.field("category"), budget.category)
            )
          )
          .collect();

        const spent = transactions.reduce((sum, t) => sum + t.amount, 0);
        const remaining = budget.amount - spent;
        const percentage = budget.amount > 0 ? (spent / budget.amount) * 100 : 0;

        return {
          ...budget,
          spent,
          remaining,
          percentage: Math.min(percentage, 100),
        };
      })
    );

    return budgetsWithSpent;
  },
});

export const create = mutation({
  args: {
    category: v.string(),
    amount: v.number(),
    period: v.union(v.literal("monthly"), v.literal("weekly"), v.literal("yearly")),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const now = new Date();
    let startDate: number;
    let endDate: number;

    switch (args.period) {
      case "weekly":
        startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() - now.getDay()).getTime();
        endDate = new Date(startDate + 7 * 24 * 60 * 60 * 1000 - 1).getTime();
        break;
      case "yearly":
        startDate = new Date(now.getFullYear(), 0, 1).getTime();
        endDate = new Date(now.getFullYear(), 11, 31, 23, 59, 59).getTime();
        break;
      default: // monthly
        startDate = new Date(now.getFullYear(), now.getMonth(), 1).getTime();
        endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59).getTime();
    }

    return await ctx.db.insert("budgets", {
      userId,
      category: args.category,
      amount: args.amount,
      period: args.period,
      startDate,
      endDate,
      isActive: true,
    });
  },
});

export const update = mutation({
  args: {
    id: v.id("budgets"),
    amount: v.optional(v.number()),
    isActive: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const budget = await ctx.db.get(args.id);
    if (!budget || budget.userId !== userId) {
      throw new Error("Budget not found");
    }

    const updates: any = {};
    if (args.amount !== undefined) updates.amount = args.amount;
    if (args.isActive !== undefined) updates.isActive = args.isActive;

    return await ctx.db.patch(args.id, updates);
  },
});
