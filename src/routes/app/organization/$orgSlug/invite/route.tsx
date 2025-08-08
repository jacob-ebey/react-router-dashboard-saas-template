import { Link } from "react-router";
import { getDb } from "@/db";
import {
  getOrganizationBySlugSecure,
  getUserOrgRole,
} from "@/db/queries/organization";
import { requireUser } from "@/lib/auth";
import { InviteUserForm } from "@/components/invitation-forms";

export default async function InviteUser({
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
    throw new Error("Organization not found or access denied");
  }

  // Check if user has permission to invite
  const userRole = await getUserOrgRole(db, user.id, organization.id);
  if (userRole !== "owner" && userRole !== "admin") {
    throw new Error(
      "You don't have permission to invite users to this organization"
    );
  }

  return (
    <>
      <title>{`Invite User | ${organization.name}`}</title>
      <meta
        name="description"
        content={`Invite users to ${organization.name} organization`}
      />

      <main className="max-w-lg mx-auto px-4 py-8 min-h-full flex flex-col">
        <div className="mb-6">
          <Link
            to={`/app/organization/${organization.slug}`}
            className="btn btn-ghost btn-sm"
          >
            <svg
              className="w-4 h-4 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Back to {organization.name}
          </Link>
        </div>

        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h1 className="card-title text-2xl text-primary mb-4">
              Invite User
            </h1>
            <p className="text-base-content/70 mb-6">
              Send an invitation to join <strong>{organization.name}</strong>.
            </p>
            <InviteUserForm organization={organization} />
          </div>
        </div>
      </main>
    </>
  );
}
