import { Link, Outlet, type RouteComponentProps } from "react-router";

import { LogoutForm } from "@/components/auth-forms";
import { GloablLoader } from "@/components/global-loader";
import { requireUserMiddleware } from "@/lib/auth";

import { openSidebar, ScrollRestorationDiv } from "./client";
import { getServerHandle } from "./handle";
import { cn } from "@/lib/utils";

declare global {
  var sidebar: HTMLDialogElement;
}

export const unstable_middleware = [requireUserMiddleware];

export default function AppLayout({ matches }: RouteComponentProps) {
  const leafHandle = matches.at(-1)?.handle;
  const { SidebarContent } = getServerHandle(leafHandle) ?? {};

  return (
    <>
      <div className="h-screen grid grid-rows-[auto_1fr] max-h-screen">
        <header
          className="navbar bg-base-200 sticky top-0 z-10 md:relative"
          aria-label="Navbar"
        >
          <div className="flex-none md:hidden">
            <button className="btn btn-square btn-ghost" onClick={openSidebar}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                className="inline-block h-5 w-5 stroke-current"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
          <div className="navbar-start">
            <Link to="/app" className="text-xl font-bold">
              ✨ The App
            </Link>
          </div>
          <div className="navbar-end gap-2">
            <GloablLoader />
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
              <div className="p-0 modal-box md:!relative md:!translate-0 md:visible md:opacity-100 md:pointer-events-auto w-[90vw] md:w-54 lg:w-64 bg-base-200 md:resize-x md:h-full md:rounded-none md:shadow-none">
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
