import { Link, Outlet, type RouteComponentProps } from "react-router";

import { GloablLoader } from "@/components/global-loader";
import { Icon } from "@/components/icon";
import { LogoutForm } from "@/components/logout-form";
import { ScrollRestorationDiv } from "@/components/scroll-restoration";
import { getUserPendingInvitations } from "@/data/invitation";
import { getUserById } from "@/data/user";
import { requireUser, requireUserMiddleware } from "@/lib/auth";
import { cn } from "@/lib/utils";

import { NotificationsPanel } from "./client";
import { openSidebar } from "./client-on";
import { getServerHandle } from "./handle";

declare global {
  var sidebar: HTMLDialogElement;
  var notifications_dialog: HTMLDialogElement;
}

export const unstable_middleware = [requireUserMiddleware];

export default async function AppLayout({ matches }: RouteComponentProps) {
  const userId = requireUser();

  // Get user details and pending invitations
  const user = await getUserById(userId.id);
  if (!user) {
    throw new Error("User not found");
  }

  const pendingInvitations = await getUserPendingInvitations(user.email);

  const leafHandle = matches.at(-1)?.handle;
  const { SidebarContent } = getServerHandle(leafHandle) ?? {};

  return (
    <>
      <div className="h-screen grid grid-rows-[auto_1fr] max-h-screen">
        <header
          className="navbar bg-base-100 shadow-sm sticky top-0 z-10 md:relative"
          aria-label="Navbar"
        >
          {!!SidebarContent && (
            <div className="flex-none md:hidden">
              <button
                className="btn btn-square btn-ghost"
                onClick={openSidebar}
              >
                <Icon name="bars-3-bottom-left" className="h-5 w-5" />
              </button>
            </div>
          )}
          <div className="navbar-start">
            <Link to="/app" className="text-xl font-bold">
              ✨ The App
            </Link>
          </div>
          <div className="navbar-end gap-2">
            <GloablLoader />
            <NotificationsPanel invitations={pendingInvitations} />
            <Link to="/app/profile" className="btn btn-ghost">
              Profile
            </Link>
            <LogoutForm />
          </div>
        </header>
        <div
          className={cn(
            "grid overflow-hidden",
            SidebarContent ? "grid-cols-[auto_1fr]" : "grid-cols-1"
          )}
        >
          {!!SidebarContent && (
            <dialog
              id="sidebar"
              className="md:modal-open modal modal-start md:!contents md:!bg-transparent md:h-full"
            >
              <div className="p-0 modal-box md:!relative md:!translate-0 md:visible md:opacity-100 md:pointer-events-auto w-[90vw] md:w-54 lg:w-64 bg-base-100 md:resize-x md:h-full md:rounded-none z-10 shadow-sm">
                <SidebarContent />
              </div>
              <form method="dialog" className="modal-backdrop md:hidden">
                <button>close</button>
              </form>
            </dialog>
          )}
          <ScrollRestorationDiv
            id="app-layout-scroll"
            className="relative overflow-y-auto"
          >
            <Outlet />
          </ScrollRestorationDiv>
        </div>
      </div>
    </>
  );
}
