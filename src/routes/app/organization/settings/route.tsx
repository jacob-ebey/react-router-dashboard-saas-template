import { Link } from "react-router";

import { AccessDenied } from "@/components/access-denied";
import { Icon } from "@/components/icon";
import { getDb } from "@/db";
import { getOrganizationInvitations } from "@/db/queries/invitation";
import {
  getOrganizationBySlugSecure,
  getUserOrgRole,
} from "@/db/queries/organization";
import { requireUser } from "@/lib/auth";

import { OrganizationSettingsForms } from "./client";

export default async function OrganizationSettings({
  params,
}: {
  params: { orgSlug: string };
}) {
  const user = requireUser();
  const db = getDb();

  const organization = await getOrganizationBySlugSecure(
    db,
    params.orgSlug,
    user.id
  );
  if (!organization) {
    return <AccessDenied />;
  }

  // Check if user has permission to view settings
  const userRole = await getUserOrgRole(db, user.id, organization.id);

  // Fetch invitations if user can manage them
  const invitations =
    userRole === "owner" || userRole === "admin"
      ? await getOrganizationInvitations(db, organization.id)
      : [];

  return (
    <>
      <title>{`${organization.name} Settings | Organization`}</title>
      <meta
        name="description"
        content={`Settings for ${organization.name} organization`}
      />

      <div className="p-4 bg-base-200 min-h-full">
        <div className="max-w-screen-xl w-full mx-auto">
          {/* Back navigation */}
          <div className="mb-6">
            <Link
              to={`/app/organization/${organization.slug}`}
              className="btn btn-ghost btn-sm"
            >
              <Icon name="chevron-left" className="h-4 w-4 mr-2" />
              Back to Organization
            </Link>
          </div>

          <h1 className="text-3xl font-bold mb-8 text-primary">
            Organization Settings
          </h1>

          {/* Settings Forms */}
          <OrganizationSettingsForms
            organization={organization}
            userRole={userRole || "member"}
            invitations={invitations}
          />
        </div>
      </div>
    </>
  );
}
