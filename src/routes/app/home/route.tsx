import { data, Link } from "react-router";

import { Icon } from "@/components/icon";
import { Card } from "@/components/ui/card";
import { getDb } from "@/db";
import { getOrganizationsForUser } from "@/db/queries/organization";
import { getUserById } from "@/db/queries/user";
import { requireUser } from "@/lib/auth";

import { CreateOrganizationForm } from "./client";

export const loader = () =>
  data(null, {
    headers: { "Cache-Control": "s-maxage=1, stale-while-revalidate=59" },
  });

export default async function AppHome() {
  const userSession = requireUser();

  // Get the full user details
  const db = getDb();
  const user = await getUserById(db, userSession.id);
  if (!user) {
    throw new Error("User not found");
  }

  // Get user's organizations
  const organizations = await getOrganizationsForUser(db, user.id);

  return (
    <>
      <title>Select Organization | The App</title>

      <meta
        name="description"
        content="Select or create an organization to get started"
      />

      <div className="p-4 bg-base-200 min-h-full grid items-center justify-center">
        <div className="max-w-screen-xl w-full grid items-center min-h-full">
          {/* Welcome Section */}
          <div className="text-center mb-8 py-16">
            <h1 className="text-4xl font-bold text-primary mb-4">
              Welcome{user.name ? `, ${user.name}` : ""}! 👋
            </h1>
            <p className="text-xl text-neutral mb-2">
              Let's get you set up with your organization
            </p>
            <p className="text-neutral">
              You can join existing organizations or create a new one to get
              started
            </p>
          </div>

          <div className="grid gap-8 lg:grid-cols-2">
            <div>
              <Card>
                <div className="card-body space-y-4">
                  <h2 className="card-title">🏢 Your Organizations</h2>

                  {organizations.length > 0 ? (
                    <div className="space-y-3">
                      {organizations.map((org) => (
                        <Link
                          key={org.id}
                          to={`/app/organization/${org.slug}`}
                          className="block p-4 rounded-lg border border-base-300 hover:border-primary hover:bg-primary/5 transition-colors"
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <h3 className="font-semibold text-base-content">
                                {org.name}
                              </h3>
                              <p className="text-sm text-neutral">
                                Role: {org.membership.role}
                              </p>
                            </div>
                            <div className="text-primary">
                              <Icon name="chevron-right" className="h-5 w-5" />
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <div className="text-6xl mb-4">🏗️</div>
                      <p className="text-neutral mb-4">
                        You're not part of any organizations yet
                      </p>
                      <p className="text-sm text-neutral">
                        Create your first organization to get started with
                        project management
                      </p>
                    </div>
                  )}
                </div>
              </Card>
            </div>
            <div>
              <Card>
                <div className="card-body space-y-4">
                  <h2 className="card-title">✨ Create New Organization</h2>
                  <CreateOrganizationForm />
                </div>
              </Card>
            </div>
          </div>

          {/* Additional Help */}
          <div className="mt-8 text-center">
            <div className="alert alert-info">
              <Icon name="information-circle" className="h-6 w-6" />
              <span>
                <strong>Need help?</strong> Organizations help you manage
                projects, team members, and keep everything organized in one
                place.
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
