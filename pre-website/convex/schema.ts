import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  waitlist: defineTable({
    name: v.string(),
    email: v.string(),
    locale: v.union(v.literal("de"), v.literal("en")),
    privacyConsent: v.boolean(),
    status: v.union(
      v.literal("pending"),
      v.literal("confirmed"),
      v.literal("expired")
    ),
    confirmationToken: v.string(),
    tokenExpiresAt: v.number(),
    confirmedAt: v.optional(v.number()),
  })
    .index("by_email", ["email"])
    .index("by_token", ["confirmationToken"])
    .index("by_status_and_expires", ["status", "tokenExpiresAt"]),
});
