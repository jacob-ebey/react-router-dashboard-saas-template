import {
  pgTable,
  uuid,
  text,
  timestamp,
  unique,
  varchar,
  jsonb,
} from "drizzle-orm/pg-core";

// ============================
// ORGANIZATIONS (Multi-tenancy)
// ============================

export const organizations = pgTable("organizations", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 100 }).unique().notNull(),
  address: text("address"),
  phone: varchar("phone", { length: 20 }),
  email: varchar("email", { length: 255 }),
  website: varchar("website", { length: 255 }),
  logoUrl: text("logo_url"),
  subscriptionPlan: varchar("subscription_plan", { length: 50 }).default(
    "free"
  ),
  subscriptionStatus: varchar("subscription_status", { length: 20 }).default(
    "active"
  ),
  settings: jsonb("settings").default({}),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// ============================
// USERS (No direct org reference - many-to-many through organizationMembers)
// ============================

export const users = pgTable(
  "users",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    email: varchar("email", { length: 255 }).notNull().unique(),
    name: varchar("name", { length: 255 }),
    avatar: text("avatar"),
    phone: varchar("phone", { length: 20 }),
    title: varchar("title", { length: 100 }),
    preferences: jsonb("preferences").default({}),
    lastActiveAt: timestamp("last_active_at"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
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

// ============================
// USER-ORGANIZATION MEMBERSHIPS (Many-to-Many)
// ============================

export const organizationMembers = pgTable(
  "organization_members",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    organizationId: uuid("organization_id")
      .notNull()
      .references(() => organizations.id, { onDelete: "cascade" }),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    role: varchar("role", { length: 50 }).default("member"), // owner, admin, manager, member, guest
    status: varchar("status", { length: 20 }).default("active"), // active, inactive, pending, suspended
    permissions: jsonb("permissions").default({}),
    joinedAt: timestamp("joined_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (table) => [unique("org_user_idx").on(table.organizationId, table.userId)]
);

// Export core types first
export type Organization = typeof organizations.$inferSelect;
export type NewOrganization = typeof organizations.$inferInsert;

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;

export type Password = typeof passwords.$inferSelect;
export type NewPassword = typeof passwords.$inferInsert;

export type OrganizationMember = typeof organizationMembers.$inferSelect;
export type NewOrganizationMember = typeof organizationMembers.$inferInsert;
