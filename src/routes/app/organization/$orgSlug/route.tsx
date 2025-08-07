import { Link } from "react-router";
import { getDb } from "@/db";
import { getOrganizationBySlug, getUsersByOrganization } from "@/db/queries/organization";
import { requireUser } from "@/lib/auth";

export default async function OrganizationDetail({ params }: { params: { orgSlug: string } }) {
  const user = requireUser();
  const db = getDb();
  
  const organization = await getOrganizationBySlug(db, params.orgSlug);
  if (!organization) {
    throw new Error("Organization not found");
  }
  
  // Get members of the organization
  const members = await getUsersByOrganization(db, organization.id);
  const currentUserId = user.id;
  
  return (
    <>
      <title>{organization.name} | Organization</title>
      <meta name="description" content={`Details for ${organization.name} organization`} />
      
      <div className="p-4 bg-base-200 min-h-full">
        <div className="max-w-screen-xl mx-auto">
          {/* Back navigation */}
          <div className="mb-6">
            <Link to="/app" className="btn btn-ghost btn-sm">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Organizations
            </Link>
          </div>
          
          {/* Starter Project Notice */}
          <div className="alert alert-info mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-current shrink-0 w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <h3 className="font-bold">This is a starter template</h3>
              <div className="text-sm">
                This organization page is a basic example. Expand it with features like:
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
              <div className="card bg-base-100 shadow-xl">
                <div className="card-body">
                  <h1 className="card-title text-3xl text-primary">{organization.name}</h1>
                  <div className="divider"></div>
                  
                  {/* Organization Details */}
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-sm font-semibold text-base-content/70 uppercase tracking-wider mb-2">
                        Organization Details
                      </h3>
                      <div className="grid gap-3">
                        <div>
                          <span className="text-sm text-base-content/70">Slug:</span>
                          <p className="font-mono">{organization.slug}</p>
                        </div>
                        {organization.email && (
                          <div>
                            <span className="text-sm text-base-content/70">Email:</span>
                            <p>{organization.email}</p>
                          </div>
                        )}
                        {organization.phone && (
                          <div>
                            <span className="text-sm text-base-content/70">Phone:</span>
                            <p>{organization.phone}</p>
                          </div>
                        )}
                        {organization.website && (
                          <div>
                            <span className="text-sm text-base-content/70">Website:</span>
                            <p>
                              <a href={organization.website} target="_blank" rel="noopener noreferrer" className="link link-primary">
                                {organization.website}
                              </a>
                            </p>
                          </div>
                        )}
                        {organization.address && (
                          <div>
                            <span className="text-sm text-base-content/70">Address:</span>
                            <p className="whitespace-pre-wrap">{organization.address}</p>
                          </div>
                        )}
                        <div>
                          <span className="text-sm text-base-content/70">Created:</span>
                          <p>{new Date(organization.createdAt).toLocaleDateString()}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Placeholder Actions */}
                  <div className="card-actions justify-end mt-6">
                    <button className="btn btn-primary">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      Organization Settings
                    </button>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Members Card */}
            <div className="lg:col-span-1">
              <div className="card bg-base-100 shadow-xl">
                <div className="card-body">
                  <h2 className="card-title text-secondary">Team Members</h2>
                  <div className="divider"></div>
                  
                  <div className="space-y-3">
                    {members.map((member) => (
                      <div key={member.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-base-200">
                        <div className="avatar placeholder">
                          <div className="bg-neutral text-neutral-content rounded-full w-10">
                            <span className="text-sm">
                              {member.name ? member.name.substring(0, 2).toUpperCase() : member.email.substring(0, 2).toUpperCase()}
                            </span>
                          </div>
                        </div>
                        <div className="flex-1">
                          <p className="font-medium">{member.name || member.email}</p>
                          <p className="text-sm text-base-content/70">
                            {member.membership.role}
                            {member.id === currentUserId && (
                              <span className="badge badge-primary badge-sm ml-2">You</span>
                            )}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="card-actions justify-end mt-4">
                    <button className="btn btn-sm btn-outline">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                      Invite Members
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Example Features Section */}
          <div className="mt-8">
            <h2 className="text-2xl font-bold mb-4">Example Features to Build</h2>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <div className="card bg-base-100 shadow-xl">
                <div className="card-body">
                  <div className="text-4xl mb-2">📊</div>
                  <h3 className="card-title">Projects & Tasks</h3>
                  <p className="text-base-content/70">
                    Add project management capabilities with tasks, boards, and timelines.
                  </p>
                </div>
              </div>
              
              <div className="card bg-base-100 shadow-xl">
                <div className="card-body">
                  <div className="text-4xl mb-2">💬</div>
                  <h3 className="card-title">Team Chat</h3>
                  <p className="text-base-content/70">
                    Implement real-time messaging and collaboration features.
                  </p>
                </div>
              </div>
              
              <div className="card bg-base-100 shadow-xl">
                <div className="card-body">
                  <div className="text-4xl mb-2">📈</div>
                  <h3 className="card-title">Analytics</h3>
                  <p className="text-base-content/70">
                    Track organization metrics, usage, and performance indicators.
                  </p>
                </div>
              </div>
              
              <div className="card bg-base-100 shadow-xl">
                <div className="card-body">
                  <div className="text-4xl mb-2">🔐</div>
                  <h3 className="card-title">Permissions</h3>
                  <p className="text-base-content/70">
                    Fine-grained access control and role management.
                  </p>
                </div>
              </div>
              
              <div className="card bg-base-100 shadow-xl">
                <div className="card-body">
                  <div className="text-4xl mb-2">💳</div>
                  <h3 className="card-title">Billing</h3>
                  <p className="text-base-content/70">
                    Subscription management and payment processing.
                  </p>
                </div>
              </div>
              
              <div className="card bg-base-100 shadow-xl">
                <div className="card-body">
                  <div className="text-4xl mb-2">🔔</div>
                  <h3 className="card-title">Notifications</h3>
                  <p className="text-base-content/70">
                    Email and in-app notifications for important events.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
