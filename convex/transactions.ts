import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

export const list = query({
  args: {
    limit: v.optional(v.number()),
    accountId: v.optional(v.id("accounts")),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];

    let query = ctx.db
      .query("transactions")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .order("desc");

    if (args.accountId) {
      query = ctx.db
        .query("transactions")
        .withIndex("by_account", (q) => q.eq("accountId", args.accountId!))
        .order("desc");
    }

    const transactions = await query.take(args.limit || 50);

    // Get account details for each transaction
    const transactionsWithAccounts = await Promise.all(
      transactions.map(async (transaction) => {
        const account = await ctx.db.get(transaction.accountId);
        return {
          ...transaction,
          account,
        };
      })
    );

    return transactionsWithAccounts;
  },
});

export const create = mutation({
  args: {
    accountId: v.id("accounts"),
    type: v.union(v.literal("income"), v.literal("expense")),
    amount: v.number(),
    category: v.string(),
    description: v.string(),
    date: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    // Verify account ownership
    const account = await ctx.db.get(args.accountId);
    if (!account || account.userId !== userId) {
      throw new Error("Account not found");
    }

    // Create transaction
    const transactionId = await ctx.db.insert("transactions", {
      userId,
      accountId: args.accountId,
      type: args.type,
      amount: args.amount,
      category: args.category,
      description: args.description,
      date: args.date || Date.now(),
    });

    // Update account balance
    const balanceChange = args.type === "income" ? args.amount : -args.amount;
    await ctx.db.patch(args.accountId, {
      balance: account.balance + balanceChange,
    });

    return transactionId;
  },
});

export const getMonthlyStats = query({
  args: {
    month: v.optional(v.number()),
    year: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return { income: 0, expenses: 0, transactions: [] };

    const now = new Date();
    const month = args.month || now.getMonth();
    const year = args.year || now.getFullYear();

    const startOfMonth = new Date(year, month, 1).getTime();
    const endOfMonth = new Date(year, month + 1, 0, 23, 59, 59).getTime();

    const transactions = await ctx.db
      .query("transactions")
      .withIndex("by_user_and_date", (q) => 
        q.eq("userId", userId).gte("date", startOfMonth).lte("date", endOfMonth)
      )
      .collect();

    const income = transactions
      .filter(t => t.type === "income")
      .reduce((sum, t) => sum + t.amount, 0);

    const expenses = transactions
      .filter(t => t.type === "expense")
      .reduce((sum, t) => sum + t.amount, 0);

    return { income, expenses, transactions };
  },
});

export const getCategoryBreakdown = query({
  args: {
    type: v.union(v.literal("income"), v.literal("expense")),
    days: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];

    const days = args.days || 30;
    const startDate = Date.now() - (days * 24 * 60 * 60 * 1000);

    const transactions = await ctx.db
      .query("transactions")
      .withIndex("by_user_and_date", (q) => 
        q.eq("userId", userId).gte("date", startDate)
      )
      .filter((q) => q.eq(q.field("type"), args.type))
      .collect();

    const categoryTotals = transactions.reduce((acc, transaction) => {
      acc[transaction.category] = (acc[transaction.category] || 0) + transaction.amount;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(categoryTotals)
      .map(([category, amount]) => ({ category, amount }))
      .sort((a, b) => b.amount - a.amount);
  },
});
