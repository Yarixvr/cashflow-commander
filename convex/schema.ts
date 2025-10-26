import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { authTables } from "@convex-dev/auth/server";

const applicationTables = {
  accounts: defineTable({
    userId: v.id("users"),
    name: v.string(),
    type: v.union(v.literal("checking"), v.literal("savings"), v.literal("credit"), v.literal("investment")),
    currency: v.string(),
    balance: v.number(),
    color: v.string(),
    isActive: v.boolean(),
  }).index("by_user", ["userId"]),

  transactions: defineTable({
    userId: v.id("users"),
    accountId: v.id("accounts"),
    type: v.union(v.literal("income"), v.literal("expense")),
    amount: v.number(),
    category: v.string(),
    description: v.string(),
    date: v.number(),
    tags: v.optional(v.array(v.string())),
  }).index("by_user", ["userId"])
    .index("by_account", ["accountId"])
    .index("by_user_and_date", ["userId", "date"]),

  budgets: defineTable({
    userId: v.id("users"),
    category: v.string(),
    amount: v.number(),
    period: v.union(v.literal("monthly"), v.literal("weekly"), v.literal("yearly")),
    startDate: v.number(),
    endDate: v.number(),
    isActive: v.boolean(),
  }).index("by_user", ["userId"]),

  categories: defineTable({
    userId: v.id("users"),
    name: v.string(),
    icon: v.string(),
    color: v.string(),
    type: v.union(v.literal("income"), v.literal("expense")),
    isDefault: v.boolean(),
  }).index("by_user", ["userId"]),

  insights: defineTable({
    userId: v.id("users"),
    type: v.string(),
    title: v.string(),
    description: v.string(),
    data: v.any(),
    createdAt: v.number(),
    isRead: v.boolean(),
  }).index("by_user", ["userId"]),
};

export default defineSchema({
  ...authTables,
  ...applicationTables,
});
