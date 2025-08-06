import { compare } from "bcrypt";
import { desc, eq } from "drizzle-orm";

import type { Database } from "../index";
import { passwords, users, type User } from "../schema";

export async function getUserById(
  db: Database,
  id: string
): Promise<User | undefined> {
  const user = await db.query.users.findFirst({
    where: eq(users.id, id),
  });

  return user;
}

export async function getUserByEmailAndPassword(
  db: Database,
  email: string,
  password: string
): Promise<User | undefined> {
  const user = await db.query.users.findFirst({
    where: eq(users.email, email),
  });

  if (!user) {
    return undefined;
  }

  const passwordHash = await db.query.passwords.findFirst({
    where: eq(passwords.userId, user.id),
    columns: {
      hashedPassword: true,
    },
    orderBy: [desc(passwords.createdAt)],
  });

  if (!passwordHash) {
    return undefined;
  }

  const passwordsMatch = await compare(password, passwordHash.hashedPassword);

  if (!passwordsMatch) {
    return undefined;
  }

  return user;
}
