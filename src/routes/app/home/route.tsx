import { getDb } from "@/db";
import { getUserById } from "@/db/queries/user";
import { getOrganizationsForUser } from "@/db/queries/organization";
import { requireUser } from "@/lib/auth";
import { OrganizationSelection } from "@/components/organization-selection";

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
        <OrganizationSelection user={user} organizations={organizations} />
      </div>
    </>
  );
}
