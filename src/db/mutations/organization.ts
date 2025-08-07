import type { Database } from "../index";
import { organizations, organizationMembers } from "../schema";
import type {
  NewOrganization,
  Organization,
  NewOrganizationMember,
  OrganizationMember,
} from "../schema";
import { eq, and } from "drizzle-orm";

export async function createOrganization(
  db: Database,
  data: NewOrganization
): Promise<Organization> {
  const [organization] = await db
    .insert(organizations)
    .values(data)
    .returning();

  return organization;
}

export async function updateOrganization(
  db: Database,
  id: string,
  data: Partial<NewOrganization>
): Promise<Organization | undefined> {
  const [organization] = await db
    .update(organizations)
    .set({
      ...data,
      updatedAt: new Date(),
    })
    .where(eq(organizations.id, id))
    .returning();

  return organization;
}

export async function deleteOrganization(
  db: Database,
  id: string
): Promise<boolean> {
  const result = await db.delete(organizations).where(eq(organizations.id, id));

  return result.rowCount === 1;
}

export async function addUserToOrganization(
  db: Database,
  data: NewOrganizationMember
): Promise<OrganizationMember> {
  const [member] = await db
    .insert(organizationMembers)
    .values(data)
    .returning();

  return member;
}

export async function updateOrganizationMemberRole(
  db: Database,
  organizationId: string,
  userId: string,
  role: string,
  permissions?: Record<string, any>
): Promise<OrganizationMember | undefined> {
  const [member] = await db
    .update(organizationMembers)
    .set({
      role,
      permissions: permissions || {},
      updatedAt: new Date(),
    })
    .where(
      and(
        eq(organizationMembers.organizationId, organizationId),
        eq(organizationMembers.userId, userId)
      )
    )
    .returning();

  return member;
}

export async function removeUserFromOrganization(
  db: Database,
  organizationId: string,
  userId: string
): Promise<boolean> {
  const result = await db
    .delete(organizationMembers)
    .where(
      and(
        eq(organizationMembers.organizationId, organizationId),
        eq(organizationMembers.userId, userId)
      )
    );

  return result.rowCount === 1;
}

export async function suspendOrganizationMember(
  db: Database,
  organizationId: string,
  userId: string
): Promise<OrganizationMember | undefined> {
  const [member] = await db
    .update(organizationMembers)
    .set({
      status: "suspended",
      updatedAt: new Date(),
    })
    .where(
      and(
        eq(organizationMembers.organizationId, organizationId),
        eq(organizationMembers.userId, userId)
      )
    )
    .returning();

  return member;
}

export async function reactivateOrganizationMember(
  db: Database,
  organizationId: string,
  userId: string
): Promise<OrganizationMember | undefined> {
  const [member] = await db
    .update(organizationMembers)
    .set({
      status: "active",
      updatedAt: new Date(),
    })
    .where(
      and(
        eq(organizationMembers.organizationId, organizationId),
        eq(organizationMembers.userId, userId)
      )
    )
    .returning();

  return member;
}
