import { getDb } from "@/db";
import { getUserById } from "@/db/queries/user";
import { requireUser } from "@/lib/auth";

import { ProfileForms } from "./client";

export default async function ProfilePage() {
  const { id } = requireUser();
  const db = getDb();
  const user = await getUserById(db, id);

  if (!user) {
    throw new Error("User not found");
  }

  return (
    <>
      <title>Profile | The App</title>
      <meta name="description" content="Manage your profile" />

      <div className="p-4 bg-base-200 min-h-full">
        <div className="max-w-screen-xl w-full mx-auto">
          <h1 className="text-3xl font-bold mb-8 text-primary">
            Profile Settings
          </h1>

          <ProfileForms user={user} />
        </div>
      </div>
    </>
  );
}
