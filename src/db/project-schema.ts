import { 
  pgTable, 
  uuid, 
  text, 
  timestamp, 
  unique, 
  varchar,
  integer,
  boolean,
  decimal,
  date,
  jsonb,
  check
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { organizations, users } from "./schema";

// ============================
// PROJECTS
// ============================

export const projects = pgTable("projects", {
  id: uuid("id").primaryKey().defaultRandom(),
  organizationId: uuid("organization_id").notNull().references(() => organizations.id, { onDelete: "cascade" }),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  projectNumber: varchar("project_number", { length: 100 }),
  status: varchar("status", { length: 50 }).default("planning"), // planning, active, on_hold, completed, cancelled
  priority: varchar("priority", { length: 20 }).default("medium"), // low, medium, high, critical
  startDate: date("start_date"),
  endDate: date("end_date"),
  estimatedCompletion: date("estimated_completion"),
  actualCompletion: date("actual_completion"),
  address: text("address"),
  city: varchar("city", { length: 100 }),
  state: varchar("state", { length: 50 }),
  zipCode: varchar("zip_code", { length: 20 }),
  country: varchar("country", { length: 50 }).default("United States"),
  projectType: varchar("project_type", { length: 100 }), // commercial, residential, industrial, infrastructure
  clientName: varchar("client_name", { length: 255 }),
  clientContact: jsonb("client_contact"), // {name, email, phone}
  budgetAmount: decimal("budget_amount", { precision: 15, scale: 2 }),
  contractAmount: decimal("contract_amount", { precision: 15, scale: 2 }),
  settings: jsonb("settings").default({}),
  createdBy: uuid("created_by").references(() => users.id),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const projectMembers = pgTable("project_members", {
  id: uuid("id").primaryKey().defaultRandom(),
  projectId: uuid("project_id").notNull().references(() => projects.id, { onDelete: "cascade" }),
  userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  role: varchar("role", { length: 50 }).notNull(), // project_manager, foreman, worker, subcontractor, observer
  permissions: jsonb("permissions").default({}),
  joinedAt: timestamp("joined_at").notNull().defaultNow(),
}, (table) => [
  unique("project_user_idx").on(table.projectId, table.userId)
]);

// ============================
// TASKS & WORK ITEMS
// ============================

export const tasks = pgTable("tasks", {
  id: uuid("id").primaryKey().defaultRandom(),
  projectId: uuid("project_id").notNull().references(() => projects.id, { onDelete: "cascade" }),
  parentTaskId: uuid("parent_task_id").references(() => tasks.id, { onDelete: "set null" }),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  status: varchar("status", { length: 50 }).default("pending"), // pending, in_progress, completed, cancelled, on_hold
  priority: varchar("priority", { length: 20 }).default("medium"),
  category: varchar("category", { length: 100 }), // framing, electrical, plumbing, etc.
  assignedTo: uuid("assigned_to").references(() => users.id),
  startDate: date("start_date"),
  dueDate: date("due_date"),
  estimatedHours: decimal("estimated_hours", { precision: 8, scale: 2 }),
  actualHours: decimal("actual_hours", { precision: 8, scale: 2 }),
  completionPercentage: integer("completion_percentage").default(0),
  notes: text("notes"),
  createdBy: uuid("created_by").references(() => users.id),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
}, (table) => [
  check("valid_completion", "completion_percentage >= 0 AND completion_percentage <= 100")
]);

// ============================
// DOCUMENT MANAGEMENT
// ============================

export const documentFolders = pgTable("document_folders", {
  id: uuid("id").primaryKey().defaultRandom(),
  projectId: uuid("project_id").notNull().references(() => projects.id, { onDelete: "cascade" }),
  parentFolderId: uuid("parent_folder_id").references(() => documentFolders.id, { onDelete: "cascade" }),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  createdBy: uuid("created_by").references(() => users.id),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const documents = pgTable("documents", {
  id: uuid("id").primaryKey().defaultRandom(),
  projectId: uuid("project_id").notNull().references(() => projects.id, { onDelete: "cascade" }),
  folderId: uuid("folder_id").references(() => documentFolders.id, { onDelete: "set null" }),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  fileName: varchar("file_name", { length: 255 }).notNull(),
  filePath: text("file_path").notNull(),
  fileSize: integer("file_size"),
  mimeType: varchar("mime_type", { length: 100 }),
  documentType: varchar("document_type", { length: 50 }), // plan, photo, report, contract, etc.
  versionNumber: integer("version_number").default(1),
  isCurrentVersion: boolean("is_current_version").default(true),
  tags: text("tags").array(), // array of tags for categorization
  uploadedBy: uuid("uploaded_by").references(() => users.id),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// ============================
// ISSUES & QUALITY CONTROL
// ============================

export const issues = pgTable("issues", {
  id: uuid("id").primaryKey().defaultRandom(),
  projectId: uuid("project_id").notNull().references(() => projects.id, { onDelete: "cascade" }),
  taskId: uuid("task_id").references(() => tasks.id, { onDelete: "set null" }),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  issueType: varchar("issue_type", { length: 50 }).notNull(), // defect, safety, quality, delay, change_request
  severity: varchar("severity", { length: 20 }).default("medium"), // low, medium, high, critical
  status: varchar("status", { length: 50 }).default("open"), // open, in_progress, resolved, closed
  location: text("location"),
  trade: varchar("trade", { length: 100 }), // which trade/discipline
  reportedBy: uuid("reported_by").references(() => users.id),
  assignedTo: uuid("assigned_to").references(() => users.id),
  dueDate: date("due_date"),
  resolvedDate: date("resolved_date"),
  photos: jsonb("photos").default([]),
  attachments: jsonb("attachments").default([]),
  resolutionNotes: text("resolution_notes"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// ============================
// DAILY LOGS & FIELD REPORTS
// ============================

export const dailyLogs = pgTable("daily_logs", {
  id: uuid("id").primaryKey().defaultRandom(),
  projectId: uuid("project_id").notNull().references(() => projects.id, { onDelete: "cascade" }),
  logDate: date("log_date").notNull(),
  weatherConditions: varchar("weather_conditions", { length: 100 }),
  temperatureHigh: integer("temperature_high"),
  temperatureLow: integer("temperature_low"),
  workDescription: text("work_description"),
  crewCount: integer("crew_count"),
  equipmentUsed: text("equipment_used").array(),
  visitors: text("visitors").array(),
  safetyNotes: text("safety_notes"),
  delaysIssues: text("delays_issues"),
  materialsDelivered: text("materials_delivered"),
  photos: jsonb("photos").default([]), // array of photo references
  createdBy: uuid("created_by").references(() => users.id),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
}, (table) => [
  unique("project_date_user_idx").on(table.projectId, table.logDate, table.createdBy)
]);

// ============================
// FINANCIAL MANAGEMENT
// ============================

export const budgets = pgTable("budgets", {
  id: uuid("id").primaryKey().defaultRandom(),
  projectId: uuid("project_id").notNull().references(() => projects.id, { onDelete: "cascade" }),
  category: varchar("category", { length: 100 }).notNull(), // labor, materials, equipment, etc.
  subcategory: varchar("subcategory", { length: 100 }),
  budgetedAmount: decimal("budgeted_amount", { precision: 15, scale: 2 }).notNull(),
  actualAmount: decimal("actual_amount", { precision: 15, scale: 2 }).default("0"),
  committedAmount: decimal("committed_amount", { precision: 15, scale: 2 }).default("0"), // amounts in pending orders/contracts
  description: text("description"),
  createdBy: uuid("created_by").references(() => users.id),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const expenses = pgTable("expenses", {
  id: uuid("id").primaryKey().defaultRandom(),
  projectId: uuid("project_id").notNull().references(() => projects.id, { onDelete: "cascade" }),
  budgetId: uuid("budget_id").references(() => budgets.id, { onDelete: "set null" }),
  description: varchar("description", { length: 255 }).notNull(),
  amount: decimal("amount", { precision: 15, scale: 2 }).notNull(),
  expenseDate: date("expense_date").notNull(),
  category: varchar("category", { length: 100 }),
  vendor: varchar("vendor", { length: 255 }),
  receiptUrl: text("receipt_url"),
  isReimbursable: boolean("is_reimbursable").default(false),
  submittedBy: uuid("submitted_by").references(() => users.id),
  approvedBy: uuid("approved_by").references(() => users.id),
  status: varchar("status", { length: 50 }).default("pending"), // pending, approved, rejected, paid
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// Export project-related types
export type Project = typeof projects.$inferSelect;
export type NewProject = typeof projects.$inferInsert;

export type ProjectMember = typeof projectMembers.$inferSelect;
export type NewProjectMember = typeof projectMembers.$inferInsert;

export type Task = typeof tasks.$inferSelect;
export type NewTask = typeof tasks.$inferInsert;

export type DocumentFolder = typeof documentFolders.$inferSelect;
export type NewDocumentFolder = typeof documentFolders.$inferInsert;

export type Document = typeof documents.$inferSelect;
export type NewDocument = typeof documents.$inferInsert;

export type Issue = typeof issues.$inferSelect;
export type NewIssue = typeof issues.$inferInsert;

export type DailyLog = typeof dailyLogs.$inferSelect;
export type NewDailyLog = typeof dailyLogs.$inferInsert;

export type Budget = typeof budgets.$inferSelect;
export type NewBudget = typeof budgets.$inferInsert;

export type Expense = typeof expenses.$inferSelect;
export type NewExpense = typeof expenses.$inferInsert;
