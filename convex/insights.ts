import {
  query,
  mutation,
  action,
  internalQuery,
  internalMutation,
} from "./_generated/server";
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

type GeneratedInsight = {
  type: string;
  title: string;
  description: string;
  data: any;
};

export const generateInsights = action({
  args: {},
  handler: async (ctx): Promise<GeneratedInsight[]> => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    // Get recent transactions for analysis
    const transactions: Doc<"transactions">[] = await ctx.runQuery(
      internal.insights.getRecentTransactions,
      { userId }
    );

    const insights: GeneratedInsight[] = [];

    if (transactions.length === 0) {
      await ctx.runMutation(internal.insights.replaceForUser, {
        userId,
        insights,
      });
      return insights;
    }

    const now = Date.now();
    const dayMs = 24 * 60 * 60 * 1000;
    const weekMs = dayMs * 7;
    const monthMs = dayMs * 30;

    const expenses = transactions.filter((t) => t.type === "expense");
    const incomes = transactions.filter((t) => t.type === "income");

    const within = (period: number) => (t: Doc<"transactions">) => t.date >= now - period;

    const formatAmount = (amount: number) =>
      `$${amount.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

    const lastWeekExpenses = expenses.filter(within(weekMs));
    const previousWeekExpenses = expenses.filter(
      (t) => t.date >= now - weekMs * 2 && t.date < now - weekMs
    );

    const lastWeekTotal = lastWeekExpenses.reduce((sum, t) => sum + t.amount, 0);
    const previousWeekTotal = previousWeekExpenses.reduce((sum, t) => sum + t.amount, 0);

    if (lastWeekTotal > 0 || previousWeekTotal > 0) {
      const difference = lastWeekTotal - previousWeekTotal;
      const change = previousWeekTotal > 0 ? (difference / previousWeekTotal) * 100 : undefined;

      const description =
        change !== undefined
          ? `You spent ${Math.abs(change).toFixed(1)}% ${change > 0 ? "more" : "less"} than the previous week (${formatAmount(lastWeekTotal)} vs ${formatAmount(previousWeekTotal)}).`
          : `Your spending last week totalled ${formatAmount(lastWeekTotal)}.`;

      insights.push({
        type: "spending_trend",
        title: "Weekly Spending Pattern",
        description,
        data: {
          lastWeekTotal,
          previousWeekTotal,
          change,
        },
      });
    }

    const lastMonthExpenses = expenses.filter(within(monthMs));
    const lastMonthTotal = lastMonthExpenses.reduce((sum, t) => sum + t.amount, 0);

    if (lastMonthExpenses.length > 0) {
      const topTransaction = lastMonthExpenses.reduce((max, t) => (t.amount > max.amount ? t : max), lastMonthExpenses[0]);

      insights.push({
        type: "top_category",
        title: "Biggest Expense",
        description: `Your largest expense in the last 30 days was ${formatAmount(topTransaction.amount)} for ${topTransaction.category}${topTransaction.description ? ` (${topTransaction.description})` : ""}.`,
        data: {
          transactionId: topTransaction._id,
          category: topTransaction.category,
          amount: topTransaction.amount,
          description: topTransaction.description,
        },
      });

      const categoryTotals = lastMonthExpenses.reduce((acc: Record<string, { amount: number; count: number }>, t) => {
        const entry = acc[t.category] || { amount: 0, count: 0 };
        entry.amount += t.amount;
        entry.count += 1;
        acc[t.category] = entry;
        return acc;
      }, {} as Record<string, { amount: number; count: number }>);

      const sortedCategories = Object.entries(categoryTotals).sort(([, a], [, b]) => b.amount - a.amount);
      const [topCategory, topStats] = sortedCategories[0];
      const topShare = lastMonthTotal > 0 ? (topStats.amount / lastMonthTotal) * 100 : 0;

      insights.push({
        type: "category_breakdown",
        title: "Category Breakdown",
        description: `${topCategory} represents ${topShare.toFixed(1)}% of your spending this month across ${topStats.count} transaction${topStats.count > 1 ? "s" : ""}.`,
        data: {
          topCategory,
          amount: topStats.amount,
          count: topStats.count,
          percentage: topShare,
          totals: categoryTotals,
        },
      });

      if (sortedCategories.length > 1) {
        const [secondCategory, secondStats] = sortedCategories[1];
        const difference = topStats.amount - secondStats.amount;
        const differencePct = secondStats.amount > 0 ? (difference / secondStats.amount) * 100 : undefined;

        insights.push({
          type: "trend_detection",
          title: "Spending Trend",
          description:
            differencePct !== undefined
              ? `${topCategory} spending is ${differencePct.toFixed(1)}% higher than ${secondCategory} this month.`
              : `${topCategory} spending is leading all other categories this month.`,
          data: {
            leader: topCategory,
            runnerUp: secondCategory,
            leaderAmount: topStats.amount,
            runnerUpAmount: secondStats.amount,
            differencePct,
          },
        });
      }
    }

    const lastMonthIncome = incomes.filter(within(monthMs)).reduce((sum, t) => sum + t.amount, 0);

    if (lastMonthIncome > 0 && lastMonthTotal > 0) {
      const savingsRate = ((lastMonthIncome - lastMonthTotal) / lastMonthIncome) * 100;
      if (savingsRate < 20) {
        const targetSavings = lastMonthIncome * 0.2;
        const needed = Math.max(targetSavings - (lastMonthIncome - lastMonthTotal), 0);

        insights.push({
          type: "savings_opportunity",
          title: "Savings Opportunity",
          description: `Saving 20% of your income would mean setting aside ${formatAmount(targetSavings)}. You're currently short by ${formatAmount(needed)} this month.`,
          data: {
            savingsRate,
            targetSavings,
            additionalNeeded: needed,
            income: lastMonthIncome,
            expenses: lastMonthTotal,
          },
        });
      }
    }

    if (lastWeekExpenses.length > 0) {
      const averageTransaction =
        lastWeekExpenses.reduce((sum, t) => sum + t.amount, 0) / lastWeekExpenses.length;

      insights.push({
        type: "recommendation",
        title: "Personalized Tip",
        description: `Try keeping individual purchases under ${formatAmount(averageTransaction)} to stay aligned with last week's average spend per transaction.`,
        data: {
          averageTransaction,
          transactionCount: lastWeekExpenses.length,
        },
      });
    }

    await ctx.runMutation(internal.insights.replaceForUser, {
      userId,
      insights,
    });

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

export const clearForUser = internalMutation({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("insights")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .collect();

    for (const insight of existing) {
      await ctx.db.delete(insight._id);
    }
  },
});

export const replaceForUser = internalMutation({
  args: {
    userId: v.id("users"),
    insights: v.array(
      v.object({
        type: v.string(),
        title: v.string(),
        description: v.string(),
        data: v.any(),
      })
    ),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("insights")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .collect();

    for (const insight of existing) {
      await ctx.db.delete(insight._id);
    }

    const baseTime = Date.now();
    let offset = 0;
    for (const insight of args.insights) {
      await ctx.db.insert("insights", {
        userId: args.userId,
        type: insight.type,
        title: insight.title,
        description: insight.description,
        data: insight.data,
        createdAt: baseTime + offset,
        isRead: false,
      });
      offset += 1;
    }
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

export const removeDuplicates = mutation({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const insights = await ctx.db
      .query("insights")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();

    for (const insight of insights) {
      await ctx.db.delete(insight._id);
    }

    return { removed: insights.length };
  },
});
