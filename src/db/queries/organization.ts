import { eq, and } from "drizzle-orm";
import type { Database } from "../index";
import { organizations, organizationMembers, users } from "../schema";
import type { Organization, User, OrganizationMember } from "../schema";

export async function getOrganizationById(
  db: Database,
  id: string
): Promise<Organization | undefined> {
  const organization = await db.query.organizations.findFirst({
    where: eq(organizations.id, id),
  });

  return organization;
}

export async function getOrganizationBySlug(
  db: Database,
  slug: string
): Promise<Organization | undefined> {
  const organization = await db.query.organizations.findFirst({
    where: eq(organizations.slug, slug),
  });

  return organization;
}

// Secure versions that check user membership
export async function getOrganizationByIdSecure(
  db: Database,
  id: string,
  userId: string
): Promise<Organization | undefined> {
  // First check if user is a member
  const membership = await db.query.organizationMembers.findFirst({
    where: and(
      eq(organizationMembers.userId, userId),
      eq(organizationMembers.organizationId, id),
      eq(organizationMembers.status, "active")
    ),
  });

  if (!membership) {
    return undefined;
  }

  // If user is a member, fetch the organization
  const organization = await db.query.organizations.findFirst({
    where: eq(organizations.id, id),
  });

  return organization;
}

export async function getOrganizationBySlugSecure(
  db: Database,
  slug: string,
  userId: string
): Promise<Organization | undefined> {
  // First get the organization to find its ID
  const organization = await db.query.organizations.findFirst({
    where: eq(organizations.slug, slug),
  });

  if (!organization) {
    return undefined;
  }

  // Check if user is a member
  const membership = await db.query.organizationMembers.findFirst({
    where: and(
      eq(organizationMembers.userId, userId),
      eq(organizationMembers.organizationId, organization.id),
      eq(organizationMembers.status, "active")
    ),
  });

  if (!membership) {
    return undefined;
  }

  return organization;
}

export async function getOrganizationsForUser(
  db: Database,
  userId: string
): Promise<(Organization & { membership: OrganizationMember })[]> {
  const userOrgs = await db
    .select({
      organization: organizations,
      membership: organizationMembers,
    })
    .from(organizations)
    .innerJoin(organizationMembers, eq(organizationMembers.organizationId, organizations.id))
    .where(
      and(
        eq(organizationMembers.userId, userId),
        eq(organizationMembers.status, "active")
      )
    )
    .orderBy(organizationMembers.joinedAt);

  return userOrgs.map(row => ({
    ...row.organization,
    membership: row.membership,
  }));
}

export async function getUsersByOrganization(
  db: Database,
  organizationId: string
): Promise<(User & { membership: OrganizationMember })[]> {
  const orgUsers = await db
    .select({
      user: users,
      membership: organizationMembers,
    })
    .from(users)
    .innerJoin(organizationMembers, eq(organizationMembers.userId, users.id))
    .where(
      and(
        eq(organizationMembers.organizationId, organizationId),
        eq(organizationMembers.status, "active")
      )
    )
    .orderBy(users.name);

  return orgUsers.map(row => ({
    ...row.user,
    membership: row.membership,
  }));
}

export async function isUserOrgMember(
  db: Database,
  userId: string,
  organizationId: string
): Promise<boolean> {
  const membership = await db.query.organizationMembers.findFirst({
    where: and(
      eq(organizationMembers.userId, userId),
      eq(organizationMembers.organizationId, organizationId),
      eq(organizationMembers.status, "active")
    ),
  });

  return !!membership;
}

export async function getUserOrgRole(
  db: Database,
  userId: string,
  organizationId: string
): Promise<string | null> {
  const membership = await db.query.organizationMembers.findFirst({
    where: and(
      eq(organizationMembers.userId, userId),
      eq(organizationMembers.organizationId, organizationId),
      eq(organizationMembers.status, "active")
    ),
    columns: {
      role: true,
    }
  });

  return membership?.role || null;
}
