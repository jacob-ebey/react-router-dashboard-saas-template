import { eq, and, lte } from "drizzle-orm";
import type { Database } from "@/db";
import { organizationInvitations, type NewOrganizationInvitation } from "@/db/schema";

export async function createInvitation(
  db: Database,
  invitation: NewOrganizationInvitation
): Promise<string> {
  const [newInvitation] = await db
    .insert(organizationInvitations)
    .values(invitation)
    .returning({ id: organizationInvitations.id });
  
  return newInvitation.id;
}

export async function revokeInvitation(
  db: Database,
  invitationId: string
): Promise<void> {
  await db
    .update(organizationInvitations)
    .set({ status: "revoked" })
    .where(eq(organizationInvitations.id, invitationId));
}

export async function acceptInvitation(
  db: Database,
  invitationId: string
): Promise<void> {
  await db
    .update(organizationInvitations)
    .set({ 
      status: "accepted",
      acceptedAt: new Date()
    })
    .where(eq(organizationInvitations.id, invitationId));
}

export async function expireOldInvitations(
  db: Database
): Promise<void> {
  await db
    .update(organizationInvitations)
    .set({ status: "expired" })
    .where(
      and(
        eq(organizationInvitations.status, "pending"),
        lte(organizationInvitations.expiresAt, new Date())
      )
    );
}

export async function deleteInvitation(
  db: Database,
  invitationId: string
): Promise<boolean> {
  const result = await db
    .delete(organizationInvitations)
    .where(eq(organizationInvitations.id, invitationId));
  
  return result.rowCount === 1;
}
