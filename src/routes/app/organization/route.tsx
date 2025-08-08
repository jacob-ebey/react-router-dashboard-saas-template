import { Link } from "react-router";

import { AccessDenied } from "@/components/access-denied";
import { Icon } from "@/components/icon";
import { Card } from "@/components/ui/card";
import { getDb } from "@/db";
import {
  getOrganizationBySlugSecure,
  getUserOrgRole,
  getUsersByOrganization,
} from "@/db/queries/organization";
import { requireUser } from "@/lib/auth";

export default async function OrganizationDetail({
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

  const userRole = await getUserOrgRole(db, user.id, organization.id);

  // Get members of the organization
  const members = await getUsersByOrganization(db, organization.id);
  const currentUserId = user.id;

  return (
    <>
      <title>{`${organization.name} | Organization`}</title>
      <meta
        name="description"
        content={`Details for ${organization.name} organization`}
      />

      <div className="p-4 bg-base-200 min-h-full">
        <div className="max-w-screen-xl mx-auto">
          {/* Back navigation */}
          <div className="mb-6">
            <Link to="/app" className="btn btn-ghost btn-sm">
              <Icon name="chevron-left" className="h-4 w-4 mr-2" />
              Back to Organizations
            </Link>
          </div>

          {/* Starter Project Notice */}
          <div className="alert alert-info mb-6">
            <Icon name="information-circle" className="h-6 w-6 self-start" />

            <div>
              <h3 className="font-bold">This is a starter template</h3>
              <div className="text-sm">
                This organization page is a basic example. Expand it with
                features like:
                <ul className="list-disc list-inside mt-1">
                  <li>Project management and dashboards</li>
                  <li>Team collaboration tools</li>
                  <li>Settings and permissions management</li>
                  <li>Billing and subscription handling</li>
                  <li>Activity logs and analytics</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Organization Details */}
          <div className="grid gap-6 lg:grid-cols-3">
            {/* Main Info Card */}
            <div className="lg:col-span-2">
              <Card>
                <div className="card-body">
                  <div className="flex items-center gap-4 mb-4">
                    {organization.logoUrl && (
                      <div className="avatar">
                        <div className="w-16 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                          <img
                            src={organization.logoUrl}
                            alt={`${organization.name} logo`}
                          />
                        </div>
                      </div>
                    )}
                    <h1 className="card-title text-3xl text-primary">
                      {organization.name}
                    </h1>
                  </div>
                  <div className="divider"></div>

                  {/* Organization Details */}
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-sm font-semibold text-neutral uppercase tracking-wider mb-2">
                        Organization Details
                      </h3>
                      <div className="grid gap-3">
                        <div>
                          <span className="text-sm text-neutral">Slug:</span>
                          <p className="font-mono">{organization.slug}</p>
                        </div>
                        {organization.email && (
                          <div>
                            <span className="text-sm text-neutral">Email:</span>
                            <p>{organization.email}</p>
                          </div>
                        )}
                        {organization.phone && (
                          <div>
                            <span className="text-sm text-neutral">Phone:</span>
                            <p>{organization.phone}</p>
                          </div>
                        )}
                        {organization.website && (
                          <div>
                            <span className="text-sm text-neutral">
                              Website:
                            </span>
                            <p>
                              <a
                                href={organization.website}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="link link-primary"
                              >
                                {organization.website}
                              </a>
                            </p>
                          </div>
                        )}
                        {organization.address && (
                          <div>
                            <span className="text-sm text-neutral">
                              Address:
                            </span>
                            <p className="whitespace-pre-wrap">
                              {organization.address}
                            </p>
                          </div>
                        )}
                        <div>
                          <span className="text-sm text-neutral">Created:</span>
                          <p>
                            {new Date(
                              organization.createdAt
                            ).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="card-actions justify-end mt-6">
                    <Link
                      to={`/app/organization/${organization.slug}/settings`}
                      className="btn btn-primary"
                    >
                      <Icon name="cog-6-tooth" className="h-4 w-4 mr-2" />
                      Organization Settings
                    </Link>
                  </div>
                </div>
              </Card>
            </div>

            {/* Members Card */}
            <div className="lg:col-span-1">
              <Card>
                <div className="card-body">
                  <h2 className="card-title text-secondary">Team Members</h2>
                  <div className="divider"></div>

                  <div className="space-y-3">
                    {members.map((member) => (
                      <div
                        key={member.id}
                        className="flex items-center gap-3 p-2 rounded-lg hover:bg-base-200"
                      >
                        <div className="avatar placeholder">
                          <div className="bg-neutral text-neutral-content rounded-full w-10">
                            <span className="text-sm">
                              {member.name
                                ? member.name.substring(0, 2).toUpperCase()
                                : member.email.substring(0, 2).toUpperCase()}
                            </span>
                          </div>
                        </div>
                        <div className="flex-1">
                          <p className="font-medium">
                            {member.name || member.email}
                          </p>
                          <p className="text-sm text-neutral">
                            {member.membership.role}
                            {member.id === currentUserId && (
                              <span className="badge badge-primary badge-sm ml-2">
                                You
                              </span>
                            )}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {userRole === "owner" ||
                  userRole === "admin" ||
                  userRole === "manager" ? (
                    <div className="card-actions justify-end mt-4">
                      <Link to="invite" className="btn btn-sm btn-outline">
                        <Icon name="plus" className="h-4 w-4 mr-1" />
                        Invite Members
                      </Link>
                    </div>
                  ) : null}
                </div>
              </Card>
            </div>
          </div>

          {/* Example Features Section */}
          <div className="mt-8">
            <h2 className="text-2xl font-bold mb-4">
              Example Features to Build
            </h2>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <Card>
                <div className="card-body">
                  <div className="text-4xl mb-2">📊</div>
                  <h3 className="card-title">Projects & Tasks</h3>
                  <p className="text-neutral">
                    Add project management capabilities with tasks, boards, and
                    timelines.
                  </p>
                </div>
              </Card>

              <Card>
                <div className="card-body">
                  <div className="text-4xl mb-2">💬</div>
                  <h3 className="card-title">Team Chat</h3>
                  <p className="text-neutral">
                    Implement real-time messaging and collaboration features.
                  </p>
                </div>
              </Card>

              <Card>
                <div className="card-body">
                  <div className="text-4xl mb-2">📈</div>
                  <h3 className="card-title">Analytics</h3>
                  <p className="text-neutral">
                    Track organization metrics, usage, and performance
                    indicators.
                  </p>
                </div>
              </Card>

              <Card>
                <div className="card-body">
                  <div className="text-4xl mb-2">🔐</div>
                  <h3 className="card-title">Permissions</h3>
                  <p className="text-neutral">
                    Fine-grained access control and role management.
                  </p>
                </div>
              </Card>

              <Card>
                <div className="card-body">
                  <div className="text-4xl mb-2">💳</div>
                  <h3 className="card-title">Billing</h3>
                  <p className="text-neutral">
                    Subscription management and payment processing.
                  </p>
                </div>
              </Card>

              <Card>
                <div className="card-body">
                  <div className="text-4xl mb-2">🔔</div>
                  <h3 className="card-title">Notifications</h3>
                  <p className="text-neutral">
                    Email and in-app notifications for important events.
                  </p>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
