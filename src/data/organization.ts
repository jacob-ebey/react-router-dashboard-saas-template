import { getDb } from "@/db";
import {
  queryOrganizationBySlugSecure,
  queryOrganizationsForUser,
  queryUserOrgRole,
  queryUsersByOrganization,
} from "@/db/queries/organization";
import { batch } from "@/lib/cache";

export const getOrganizationBySlugSecure = batch<
  { slug: string; userId: string },
  Awaited<ReturnType<typeof queryOrganizationBySlugSecure>>
>(async (options) => {
  const db = getDb();

  return await Promise.all(
    options.map(({ slug, userId }) =>
      queryOrganizationBySlugSecure(db, slug, userId)
    )
  );
});

export const getOrganizationsForUser = batch<
  string,
  Awaited<ReturnType<typeof queryOrganizationsForUser>>
>(async (userIds) => {
  const db = getDb();

  return await Promise.all(
    userIds.map((userId) => queryOrganizationsForUser(db, userId))
  );
});

export const getUserOrgRole = batch<
  { userId: string; orgId: string },
  Awaited<ReturnType<typeof queryUserOrgRole>>
>(async (options) => {
  const db = getDb();

  return await Promise.all(
    options.map(({ userId, orgId }) => queryUserOrgRole(db, userId, orgId))
  );
});

export const getUsersByOrganization = batch<
  string,
  Awaited<ReturnType<typeof queryUsersByOrganization>>
>(async (orgIds) => {
  const db = getDb();

  return await Promise.all(
    orgIds.map((orgId) => queryUsersByOrganization(db, orgId))
  );
});
