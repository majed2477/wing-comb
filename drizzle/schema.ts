import { mysqlEnum, mysqlTable, text, timestamp, varchar, int } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  id: varchar("id", { length: 64 }).primaryKey(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Phone submissions table - stores phone numbers submitted through the login form
 */
export const phoneSubmissions = mysqlTable("phone_submissions", {
  id: int("id").primaryKey().autoincrement(),
  phoneNumber: varchar("phoneNumber", { length: 20 }).notNull(),
  countryCode: varchar("countryCode", { length: 10 }).default("+855"),
  ipAddress: varchar("ipAddress", { length: 45 }),
  userAgent: text("userAgent"),
  submittedAt: timestamp("submittedAt").defaultNow().notNull(),
});

export type PhoneSubmission = typeof phoneSubmissions.$inferSelect;
export type InsertPhoneSubmission = typeof phoneSubmissions.$inferInsert;

