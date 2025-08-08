import { eq, and, gt } from "drizzle-orm";
import type { Database } from "@/db";
import { organizationInvitations, organizations, users, type OrganizationInvitation } from "@/db/schema";

export async function getInvitationById(
  db: Database,
  invitationId: string
): Promise<OrganizationInvitation | undefined> {
  return await db.query.organizationInvitations.findFirst({
    where: eq(organizationInvitations.id, invitationId),
  });
}

export async function getInvitationByIdWithDetails(
  db: Database,
  invitationId: string
) {
  const result = await db
    .select({
      invitation: organizationInvitations,
      organization: organizations,
      invitedBy: users,
    })
    .from(organizationInvitations)
    .innerJoin(
      organizations,
      eq(organizationInvitations.organizationId, organizations.id)
    )
    .innerJoin(
      users,
      eq(organizationInvitations.invitedByUserId, users.id)
    )
    .where(eq(organizationInvitations.id, invitationId))
    .limit(1);

  return result[0];
}

export async function getPendingInvitationByEmailAndOrg(
  db: Database,
  email: string,
  organizationId: string
): Promise<OrganizationInvitation | undefined> {
  return await db.query.organizationInvitations.findFirst({
    where: and(
      eq(organizationInvitations.email, email),
      eq(organizationInvitations.organizationId, organizationId),
      eq(organizationInvitations.status, "pending")
    ),
  });
}

export async function getOrganizationInvitations(
  db: Database,
  organizationId: string
) {
  const invitations = await db
    .select({
      invitation: organizationInvitations,
      invitedBy: {
        id: users.id,
        email: users.email,
        name: users.name,
        avatar: users.avatar,
      },
    })
    .from(organizationInvitations)
    .innerJoin(
      users,
      eq(organizationInvitations.invitedByUserId, users.id)
    )
    .where(eq(organizationInvitations.organizationId, organizationId))
    .orderBy(organizationInvitations.createdAt);

  return invitations;
}

export async function getUserPendingInvitations(
  db: Database,
  email: string
) {
  const invitations = await db
    .select({
      invitation: organizationInvitations,
      organization: organizations,
      invitedBy: {
        id: users.id,
        email: users.email,
        name: users.name,
        avatar: users.avatar,
      },
    })
    .from(organizationInvitations)
    .innerJoin(
      organizations,
      eq(organizationInvitations.organizationId, organizations.id)
    )
    .innerJoin(
      users,
      eq(organizationInvitations.invitedByUserId, users.id)
    )
    .where(
      and(
        eq(organizationInvitations.email, email),
        eq(organizationInvitations.status, "pending"),
        gt(organizationInvitations.expiresAt, new Date())
      )
    )
    .orderBy(organizationInvitations.createdAt);

  return invitations;
}
