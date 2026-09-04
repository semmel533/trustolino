import { mutation, internalMutation, internalQuery } from "./_generated/server";
import { v } from "convex/values";

export const register = mutation({
  args: {
    serverSecret: v.string(),
    name: v.string(),
    email: v.string(),
    locale: v.union(v.literal("de"), v.literal("en")),
    privacyConsent: v.boolean(),
    confirmationToken: v.string(),
  },
  returns: v.object({
    status: v.union(
      v.literal("registered"),
      v.literal("already_confirmed"),
      v.literal("pending_resent"),
      v.literal("cooldown")
    ),
    id: v.id("waitlist"),
  }),
  handler: async (ctx, args) => {
    // 1. Authorization: Only our server route is permitted to call register
    const internalSecret = process.env.CONVEX_INTERNAL_SECRET;
    if (internalSecret && args.serverSecret !== internalSecret) {
      throw new Error("Unauthorized: Invalid internal secret");
    }

    // 2. Strict server-side input validation
    const trimmedName = args.name.trim();
    if (trimmedName.length === 0 || trimmedName.length > 100) {
      throw new Error("Invalid name: Must be between 1 and 100 characters");
    }

    const normalizedEmail = args.email.trim().toLowerCase();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (
      normalizedEmail.length === 0 ||
      normalizedEmail.length > 254 ||
      !emailRegex.test(normalizedEmail)
    ) {
      throw new Error("Invalid email format or length");
    }

    if (!/^[0-9a-f]{64}$/i.test(args.confirmationToken)) {
      throw new Error("Invalid token format");
    }

    if (args.privacyConsent !== true) {
      throw new Error("Privacy consent is required");
    }

    // 3. Server-enforced 30-minute validity
    const tokenExpiresAt = Date.now() + 30 * 60 * 1000;

    const existing = await ctx.db
      .query("waitlist")
      .withIndex("by_email", (q) => q.eq("email", normalizedEmail))
      .first();

    if (existing) {
      if (existing.status === "confirmed") {
        return { status: "already_confirmed" as const, id: existing._id };
      }

      // Email Bombing & Abuse Protection: 2-minute cooldown between confirmation email resends
      // (If remaining expiration is greater than 28 minutes, a token was just generated)
      if (
        existing.status === "pending" &&
        existing.tokenExpiresAt - Date.now() > 28 * 60 * 1000
      ) {
        return { status: "cooldown" as const, id: existing._id };
      }

      await ctx.db.patch(existing._id, {
        name: trimmedName,
        locale: args.locale,
        privacyConsent: true,
        confirmationToken: args.confirmationToken,
        tokenExpiresAt,
      });

      return { status: "pending_resent" as const, id: existing._id };
    }

    const id = await ctx.db.insert("waitlist", {
      name: trimmedName,
      email: normalizedEmail,
      locale: args.locale,
      privacyConsent: true,
      status: "pending",
      confirmationToken: args.confirmationToken,
      tokenExpiresAt,
    });

    return { status: "registered" as const, id };
  },
});

export const confirm = mutation({
  args: {
    token: v.string(),
  },
  returns: v.object({
    status: v.union(
      v.literal("success"),
      v.literal("already_confirmed"),
      v.literal("expired"),
      v.literal("invalid")
    ),
    name: v.optional(v.string()),
    locale: v.optional(v.string()),
  }),
  handler: async (ctx, args) => {
    const trimmedToken = args.token.trim();
    // Validate format immediately: must be exact 64-character hex string
    if (!/^[0-9a-f]{64}$/i.test(trimmedToken)) {
      return { status: "invalid" as const };
    }

    const record = await ctx.db
      .query("waitlist")
      .withIndex("by_token", (q) => q.eq("confirmationToken", trimmedToken))
      .first();

    if (!record) {
      return { status: "invalid" as const };
    }

    if (record.status === "confirmed") {
      return {
        status: "already_confirmed" as const,
        name: record.name,
        locale: record.locale,
      };
    }

    if (record.status === "expired" || Date.now() > record.tokenExpiresAt) {
      if (record.status !== "expired") {
        await ctx.db.patch(record._id, { status: "expired" });
      }
      return {
        status: "expired" as const,
        name: record.name,
        locale: record.locale,
      };
    }

    await ctx.db.patch(record._id, {
      status: "confirmed",
      confirmedAt: Date.now(),
    });

    return {
      status: "success" as const,
      name: record.name,
      locale: record.locale,
    };
  },
});

export const cleanupExpired = internalMutation({
  args: {},
  returns: v.number(),
  handler: async (ctx) => {
    const now = Date.now();
    const expiredRecords = await ctx.db
      .query("waitlist")
      .withIndex("by_status_and_expires", (q) =>
        q.eq("status", "pending").lt("tokenExpiresAt", now)
      )
      .take(100);

    for (const record of expiredRecords) {
      await ctx.db.delete(record._id);
    }

    return expiredRecords.length;
  },
});

export const deleteIfUnconfirmed = internalMutation({
  args: {
    id: v.id("waitlist"),
  },
  returns: v.boolean(),
  handler: async (ctx, args) => {
    const record = await ctx.db.get(args.id);
    if (
      record &&
      record.status === "pending" &&
      Date.now() >= record.tokenExpiresAt
    ) {
      await ctx.db.delete(args.id);
      return true;
    }
    return false;
  },
});

export const getByEmail = internalQuery({
  args: {
    email: v.string(),
  },
  returns: v.union(
    v.null(),
    v.object({
      _id: v.id("waitlist"),
      _creationTime: v.number(),
      name: v.string(),
      email: v.string(),
      locale: v.union(v.literal("de"), v.literal("en")),
      privacyConsent: v.boolean(),
      status: v.union(
        v.literal("pending"),
        v.literal("confirmed"),
        v.literal("expired")
      ),
      tokenExpiresAt: v.number(),
      confirmedAt: v.optional(v.number()),
    })
  ),
  handler: async (ctx, args) => {
    const normalizedEmail = args.email.trim().toLowerCase();
    const record = await ctx.db
      .query("waitlist")
      .withIndex("by_email", (q) => q.eq("email", normalizedEmail))
      .first();

    if (!record) return null;

    return {
      _id: record._id,
      _creationTime: record._creationTime,
      name: record.name,
      email: record.email,
      locale: record.locale,
      privacyConsent: record.privacyConsent,
      status: record.status,
      tokenExpiresAt: record.tokenExpiresAt,
      confirmedAt: record.confirmedAt,
    };
  },
});
