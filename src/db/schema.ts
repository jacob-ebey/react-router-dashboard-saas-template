import { sqliteTable, text, integer, unique } from "drizzle-orm/sqlite-core";

// Users table
export const users = sqliteTable(
  "users",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    publicId: text("public_id")
      .notNull()
      .$defaultFn(() => crypto.randomUUID()),
    email: text("email").notNull().unique(),
    name: text("name"),
    avatar: text("avatar"),
    createdAt: integer("created_at", { mode: "timestamp" })
      .notNull()
      .$defaultFn(() => new Date()),
  },
  (table) => [unique("email_idx").on(table.email)]
);

// Passwords table for email/password logins
export const passwords = sqliteTable(
  "passwords",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    userId: integer("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    hashedPassword: text("hashed_password").notNull(),
    createdAt: integer("created_at", { mode: "timestamp" })
      .notNull()
      .$defaultFn(() => new Date()),
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
