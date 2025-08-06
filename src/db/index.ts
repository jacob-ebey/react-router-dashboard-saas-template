import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
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

  // Create client
  const client = new Pool({
    connectionString: process.env.DATABASE_URL,
  });

  return (globalThis.DB = drizzle(client, { schema }));
}
