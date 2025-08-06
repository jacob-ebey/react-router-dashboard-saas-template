import { pgTable, uuid, text, timestamp, unique } from "drizzle-orm/pg-core";

// Users table
export const users = pgTable(
  "users",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    email: text("email").notNull().unique(),
    name: text("name"),
    avatar: text("avatar"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (table) => [unique("email_idx").on(table.email)]
);

// Passwords table for email/password logins
export const passwords = pgTable(
  "passwords",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    hashedPassword: text("hashed_password").notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (table) => [
    unique("userId_password_idx").on(table.userId, table.hashedPassword),
  ]
);

// Export types
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Password = typeof passwords.$inferSelect;
export type NewPassword = typeof passwords.$inferInsert;
