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
         <div className="max-w-md w-full space-y-6">
           {/* User Information Section */}
           <div className="card bg-base-100 shadow-xl">
             <div className="card-body">
               <h2 className="card-title text-lg mb-4">User Information</h2>
               
               <div className="space-y-3">
                 <div className="flex items-center gap-3">
                   <div className="avatar placeholder">
                     <div className="bg-neutral text-neutral-content rounded-full w-12">
                       <span className="text-xl">
                         {user.name ? user.name.charAt(0).toUpperCase() : user.email.charAt(0).toUpperCase()}
                       </span>
                     </div>
                   </div>
                   <div>
                     <div className="font-semibold">{user.name || "No name set"}</div>
                     <div className="text-sm text-base-content/70">{user.email}</div>
                   </div>
                 </div>
                 
                 <div className="divider my-2"></div>
                 
                 <div className="space-y-2 text-sm">
                   <div className="flex justify-between">
                     <span className="text-base-content/70">Email:</span>
                     <span className="font-mono">{user.email}</span>
                   </div>
                   
                   <div className="flex justify-between">
                     <span className="text-base-content/70">Member since:</span>
                     <span>{new Date(user.createdAt).toLocaleDateString()}</span>
                   </div>
                   
                   <div className="flex justify-between">
                     <span className="text-base-content/70">User ID:</span>
                     <span className="font-mono text-xs">{user.id.slice(0, 8)}...</span>
                   </div>
                 </div>
               </div>
             </div>
           </div>

           {/* Organization Selection */}
           <OrganizationSelection user={user} organizations={organizations} />
         </div>
       </div>
    </>
  );
}
