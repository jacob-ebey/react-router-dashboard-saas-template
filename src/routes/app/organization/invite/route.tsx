import { Link } from "react-router";

import { AccessDenied } from "@/components/access-denied";
import { Icon } from "@/components/icon";
import { Card } from "@/components/ui/card";
import {
  getOrganizationBySlugSecure,
  getUserOrgRole,
} from "@/data/organization";
import { requireUser } from "@/lib/auth";

import { InviteUserForm } from "./client";

export default async function InviteUser({
  params,
}: {
  params: { orgSlug: string };
}) {
  const user = requireUser();

  const organization = await getOrganizationBySlugSecure({
    slug: params.orgSlug,
    userId: user.id,
  });
  if (!organization) {
    return <AccessDenied />;
  }

  // Check if user has permission to invite
  const userRole = await getUserOrgRole({
    userId: user.id,
    orgId: organization.id,
  });
  if (userRole !== "owner" && userRole !== "admin" && userRole !== "manager") {
    return <AccessDenied />;
  }

  return (
    <>
      <title>{`Invite User | ${organization.name}`}</title>
      <meta
        name="description"
        content={`Invite users to ${organization.name} organization`}
      />

      <div className="p-4 bg-base-200 min-h-full">
        <main className="max-w-screen-xl w-full mx-auto flex flex-col">
          <div className="mb-6">
            <Link
              to={`/app/organization/${organization.slug}`}
              className="btn btn-ghost btn-sm"
            >
              <Icon name="chevron-left" className="h-4 w-4 mr-2" />
              Back to {organization.name}
            </Link>
          </div>

          <Card>
            <div className="card-body space-y-4">
              <h1 className="card-title">Invite User</h1>
              <p className="text-neutral">
                Send an invitation to join <strong>{organization.name}</strong>.
              </p>
              <InviteUserForm organization={organization} />
            </div>
          </Card>
        </main>
      </div>
    </>
  );
}
