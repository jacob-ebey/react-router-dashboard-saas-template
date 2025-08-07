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

      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="prose mb-8">
          <h1>Profile Settings</h1>
          <p>Manage your account information and preferences.</p>
        </div>

        <ProfileForms user={user} />
      </main>
    </>
  );
}
