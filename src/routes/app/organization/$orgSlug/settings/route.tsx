import { Link } from "react-router";
import { getDb } from "@/db";
import { getOrganizationBySlug, getUserOrgRole } from "@/db/queries/organization";
import { requireUser } from "@/lib/auth";
import { OrganizationSettingsForms } from "./client";

export default async function OrganizationSettings({ params }: { params: { orgSlug: string } }) {
  const user = requireUser();
  const db = getDb();
  
  const organization = await getOrganizationBySlug(db, params.orgSlug);
  if (!organization) {
    throw new Error("Organization not found");
  }
  
  // Check if user has permission to view settings
  const userRole = await getUserOrgRole(db, user.id, organization.id);
  if (userRole !== "owner" && userRole !== "admin") {
    throw new Error("You don't have permission to view organization settings");
  }
  
  return (
    <>
      <title>{organization.name} Settings | Organization</title>
      <meta name="description" content={`Settings for ${organization.name} organization`} />
      
      <div className="p-4 bg-base-200 min-h-full">
        <div className="max-w-screen-xl w-full mx-auto">
          {/* Back navigation */}
          <div className="mb-6">
            <Link to={`/app/organization/${organization.slug}`} className="btn btn-ghost btn-sm">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Organization
            </Link>
          </div>
          
          <h1 className="text-3xl font-bold mb-8 text-primary">Organization Settings</h1>
          
          {/* Settings Forms */}
          <OrganizationSettingsForms 
            organization={organization} 
            userRole={userRole || "member"} 
          />
        </div>
      </div>
    </>
  );
}
