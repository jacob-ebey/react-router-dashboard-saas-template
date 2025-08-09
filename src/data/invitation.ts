import { batch } from "@/lib/cache";

import { getDb } from "@/db";
import {
  queryInvitationById,
  queryInvitationByIdWithDetails,
  queryOrganizationInvitations,
  queryUserPendingInvitations,
} from "@/db/queries/invitation";

export const getInvitationById = batch<
  string,
  Awaited<ReturnType<typeof queryInvitationById>>
>(async (invitationIds) => {
  const db = getDb();

  return await Promise.all(
    invitationIds.map((id) => queryInvitationById(db, id))
  );
});

export const getInvitationByIdWithDetails = batch<
  string,
  Awaited<ReturnType<typeof queryInvitationByIdWithDetails>>
>(async (invitationIds) => {
  const db = getDb();
  return await Promise.all(
    invitationIds.map((id) => queryInvitationByIdWithDetails(db, id))
  );
});

export const getOrganizationInvitations = batch<
  string,
  Awaited<ReturnType<typeof queryOrganizationInvitations>>
>(async (organizationIds) => {
  const db = getDb();

  return await Promise.all(
    organizationIds.map((organizationId) =>
      queryOrganizationInvitations(db, organizationId)
    )
  );
});

export const getUserPendingInvitations = batch<
  string,
  Awaited<ReturnType<typeof queryUserPendingInvitations>>
>(async (emails) => {
  const db = getDb();

  return await Promise.all(
    emails.map((email) => queryUserPendingInvitations(db, email))
  );
});
