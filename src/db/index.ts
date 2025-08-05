import { drizzle } from "drizzle-orm/libsql";
import { createClient } from "@libsql/client";
import * as schema from "./schema";

export type Database = ReturnType<typeof drizzle<typeof schema>>;

declare global {
  var DB: Database;
}

// Export schema for migrations
export * as schema from "./schema";

// Export a function to get the database instance
export function getDb(): Database {
  if (globalThis.DB) {
    return globalThis.DB;
  }

  // Create libSQL client
  const client = createClient({
    url: process.env.DATABASE_URL || "file:./local.db",
    authToken: process.env.DATABASE_AUTH_TOKEN,
  });

  return (globalThis.DB = drizzle(client, { schema }));
}
