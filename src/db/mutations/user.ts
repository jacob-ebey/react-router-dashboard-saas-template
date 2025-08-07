import { hash, compare } from "bcrypt";
import { eq, desc } from "drizzle-orm";

import type { Database } from "../index";
import { passwords, users, type User } from "../schema";

export async function createUser(
  db: Database,
  { email, password, name }: { email: string; password: string; name?: string }
): Promise<User | undefined> {
  const hashedPassword = await hash(password, 10);

  return await db
    .transaction(async (tx) => {
      const [insertedUser] = await tx
        .insert(users)
        .values({
          email,
          name,
        })
        .returning();

      await tx
        .insert(passwords)
        .values({
          hashedPassword,
          userId: insertedUser.id,
        })
        .returning({ id: passwords.id });

      return insertedUser;
    })
    .catch((error) => {
      console.error(error);
      return undefined;
    });
}

export async function updateUserName(
  db: Database,
  userId: string,
  name: string
): Promise<boolean> {
  try {
    const [updated] = await db
      .update(users)
      .set({ name, updatedAt: new Date() })
      .where(eq(users.id, userId))
      .returning({ id: users.id });

    return !!updated;
  } catch (error) {
    console.error(error);
    return false;
  }
}

export async function verifyUserPassword(
  db: Database,
  userId: string,
  password: string
): Promise<boolean> {
  try {
    const passwordRecord = await db.query.passwords.findFirst({
      where: eq(passwords.userId, userId),
      columns: {
        hashedPassword: true,
      },
      orderBy: [desc(passwords.createdAt)],
    });

    if (!passwordRecord) {
      return false;
    }

    return await compare(password, passwordRecord.hashedPassword);
  } catch (error) {
    console.error(error);
    return false;
  }
}

export async function updateUserPassword(
  db: Database,
  userId: string,
  newPassword: string
): Promise<boolean> {
  try {
    const hashedPassword = await hash(newPassword, 16);

    // Insert new password record (keeping history)
    const [inserted] = await db
      .insert(passwords)
      .values({
        userId,
        hashedPassword,
      })
      .returning({ id: passwords.id });

    return !!inserted;
  } catch (error) {
    console.error(error);
    return false;
  }
}

export async function deleteUser(
  db: Database,
  userId: string
): Promise<boolean> {
  try {
    // User deletion will cascade to passwords and organization memberships
    const [deleted] = await db
      .delete(users)
      .where(eq(users.id, userId))
      .returning({ id: users.id });

    return !!deleted;
  } catch (error) {
    console.error(error);
    return false;
  }
}
