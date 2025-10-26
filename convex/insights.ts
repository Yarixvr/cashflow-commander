import { query, mutation, action, internalQuery, internalMutation } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";
import { internal } from "./_generated/api";
import { Doc } from "./_generated/dataModel";

export const list = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];

    return await ctx.db
      .query("insights")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .order("desc")
      .take(10);
  },
});

export const generateInsights = action({
  args: {},
  handler: async (ctx): Promise<any[]> => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    // Get recent transactions for analysis
    const transactions: Doc<"transactions">[] = await ctx.runQuery(internal.insights.getRecentTransactions, { userId });
    const insights: any[] = [];

    // Spending trend analysis
    const last30Days = transactions.filter((t: Doc<"transactions">) => 
      t.date > Date.now() - 30 * 24 * 60 * 60 * 1000 && t.type === "expense"
    );
    const previous30Days = transactions.filter((t: Doc<"transactions">) => 
      t.date > Date.now() - 60 * 24 * 60 * 60 * 1000 && 
      t.date <= Date.now() - 30 * 24 * 60 * 60 * 1000 && 
      t.type === "expense"
    );

    const currentSpending = last30Days.reduce((sum: number, t: Doc<"transactions">) => sum + t.amount, 0);
    const previousSpending = previous30Days.reduce((sum: number, t: Doc<"transactions">) => sum + t.amount, 0);

    if (previousSpending > 0) {
      const change: number = ((currentSpending - previousSpending) / previousSpending) * 100;
      if (Math.abs(change) > 10) {
        insights.push({
          type: "spending_trend",
          title: change > 0 ? "Spending Increased" : "Spending Decreased",
          description: `Your spending has ${change > 0 ? "increased" : "decreased"} by ${Math.abs(change).toFixed(1)}% compared to last month.`,
          data: { change, currentSpending, previousSpending },
        });
      }
    }

    // Top spending category
    const categoryTotals = last30Days.reduce((acc: Record<string, number>, t: Doc<"transactions">) => {
      acc[t.category] = (acc[t.category] || 0) + t.amount;
      return acc;
    }, {} as Record<string, number>);

    const topCategory = Object.entries(categoryTotals)
      .sort(([,a], [,b]) => (b as number) - (a as number))[0];

    if (topCategory && topCategory[1] > 0) {
      const percentage = (topCategory[1] / currentSpending) * 100;
      insights.push({
        type: "top_category",
        title: "Top Spending Category",
        description: `${topCategory[0]} accounts for ${percentage.toFixed(1)}% of your spending this month ($${topCategory[1].toFixed(2)}).`,
        data: { category: topCategory[0], amount: topCategory[1], percentage },
      });
    }

    // Savings opportunity
    const income = transactions
      .filter((t: Doc<"transactions">) => t.type === "income" && t.date > Date.now() - 30 * 24 * 60 * 60 * 1000)
      .reduce((sum: number, t: Doc<"transactions">) => sum + t.amount, 0);

    if (income > 0 && currentSpending > 0) {
      const savingsRate = ((income - currentSpending) / income) * 100;
      if (savingsRate < 20) {
        insights.push({
          type: "savings_opportunity",
          title: "Savings Opportunity",
          description: `You're saving ${savingsRate.toFixed(1)}% of your income. Consider aiming for 20% to build a stronger financial foundation.`,
          data: { savingsRate, income, expenses: currentSpending },
        });
      }
    }

    // Save insights to database
    for (const insight of insights) {
      await ctx.runMutation(internal.insights.create, {
        userId,
        ...insight,
      });
    }

    return insights;
  },
});

export const getRecentTransactions = internalQuery({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    const transactions = await ctx.db
      .query("transactions")
      .withIndex("by_user_and_date", (q) => 
        q.eq("userId", args.userId).gte("date", Date.now() - 60 * 24 * 60 * 60 * 1000)
      )
      .collect();

    return transactions;
  },
});

export const create = internalMutation({
  args: {
    userId: v.id("users"),
    type: v.string(),
    title: v.string(),
    description: v.string(),
    data: v.any(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("insights", {
      userId: args.userId,
      type: args.type,
      title: args.title,
      description: args.description,
      data: args.data,
      createdAt: Date.now(),
      isRead: false,
    });
  },
});

export const markAsRead = mutation({
  args: { id: v.id("insights") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const insight = await ctx.db.get(args.id);
    if (!insight || insight.userId !== userId) {
      throw new Error("Insight not found");
    }

    return await ctx.db.patch(args.id, { isRead: true });
  },
});
