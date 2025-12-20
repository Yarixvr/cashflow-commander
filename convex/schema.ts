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

  // User profiles for customizable display name and avatar
  userProfiles: defineTable({
    userId: v.id("users"),
    username: v.string(),
    profilePictureUrl: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("by_user", ["userId"]),

  // Badge types that can be assigned to users
  badges: defineTable({
    name: v.string(),
    displayName: v.string(),
    description: v.string(),
    icon: v.string(),
    color: v.string(),
    createdAt: v.number(),
  }).index("by_name", ["name"]),

  // Linking table for user-badge assignments
  userBadges: defineTable({
    userId: v.id("users"),
    badgeId: v.id("badges"),
    assignedAt: v.number(),
    assignedBy: v.id("users"),
  }).index("by_user", ["userId"])
    .index("by_badge", ["badgeId"]),
};

export default defineSchema({
  ...authTables,
  ...applicationTables,
});
