import { getDb } from "@/db";
import { queryUserById } from "@/db/queries/user";
import { batch } from "@/lib/cache";

export const getUserById = batch<
  string,
  Awaited<ReturnType<typeof queryUserById>>
>(async (ids) => {
  const db = getDb();
  return await Promise.all(ids.map((id) => queryUserById(db, id)));
});
