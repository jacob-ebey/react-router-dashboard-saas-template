import { hash } from "bcrypt";

import type { Database } from "../index";
import { passwords, users, type User } from "../schema";

export async function createUser(
  db: Database,
  { email, password, name }: { email: string; password: string; name?: string }
): Promise<User | undefined> {
  const hashedPassword = await hash(password, 16);

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
