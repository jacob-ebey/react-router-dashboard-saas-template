import { hash } from "bcrypt";
import { eq, sql } from "drizzle-orm";

import type { Database } from "../index";
import { passwords, users, type User } from "../schema";

export async function createUser(
  db: Database,
  { email, password, name }: { email: string; password: string; name?: string }
): Promise<User | undefined> {
  const hashedPassword = await hash(password, 16);

  const [[insertedUser], [insertedPassword]] = await db.batch([
    db
      .insert(users)
      .values({
        email,
        name,
      })
      .returning(),
    db
      .insert(passwords)
      .values({
        hashedPassword,
        userId: sql<number>`last_insert_rowid()`,
      })
      .returning({ id: passwords.id }),
  ]);

  if (!insertedPassword && insertedUser) {
    await db.delete(users).where(eq(users.id, insertedUser.id));
  }

  if (!insertedUser && insertedPassword) {
    await db.delete(passwords).where(eq(passwords.id, insertedPassword.id));
  }

  if (insertedPassword && insertedUser) {
    return insertedUser;
  }

  return undefined;
}
