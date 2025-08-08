"use client";

import { startTransition, useActionState, useRef } from "react";

import {
  acceptInvitation,
  declineInvitation,
} from "@/actions/invitation/actions";
import { Icon } from "@/components/icon";
import { ScrollRestoration } from "@/components/scroll-restoration";
import type { Organization, OrganizationInvitation, User } from "@/db/schema";
import { Card } from "@/components/ui/card";

export function openSidebar() {
  sidebar.showModal();
}

export function closeSidebar() {
  sidebar.close();
}

export function ScrollRestorationDiv({
  ref: propsRef,
  ...props
}: React.ComponentProps<"div">) {
  const localRef = useRef<HTMLDivElement>(null);
  const ref = propsRef ?? localRef;

  if (!props.id) {
    throw new Error("id is required");
  }

  return (
    <>
      <div {...props} ref={ref} />
      <ScrollRestoration
        getKey={({ key }) => `${props.id}-${key}`}
        scrollRef={ref}
      />
    </>
  );
}

declare global {
  var notifications_dialog: HTMLDialogElement;
}

interface NotificationsPanelProps {
  invitations: Array<{
    invitation: OrganizationInvitation;
    organization: Organization;
    invitedBy: Pick<User, "id" | "email" | "name" | "avatar">;
  }>;
}

export function openNotifications() {
  notifications_dialog.showModal();
}

export function closeNotifications() {
  notifications_dialog.close();
}

export function NotificationsPanel({ invitations }: NotificationsPanelProps) {
  const hasNotifications = invitations.length > 0;

  return (
    <>
      <button
        onClick={openNotifications}
        className="btn btn-ghost btn-circle relative"
        aria-label="Notifications"
      >
        <Icon name="bell" className="h-5 w-5" />

        {hasNotifications && (
          <span className="badge badge-xs badge-error absolute top-0 right-0 animate-pulse"></span>
        )}
      </button>

      {/* Notifications Dialog - similar to sidebar pattern */}
      <dialog id="notifications_dialog" className="modal modal-end">
        <div className="modal-box w-[90vw] max-w-md h-full rounded-none p-0">
          <div className="sticky top-0 bg-base-100 p-4 border-b border-base-200 z-10">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-lg">Notifications</h3>
              <form method="dialog">
                <button className="btn btn-sm btn-circle btn-ghost">✕</button>
              </form>
            </div>
          </div>
          <div className="p-4">
            <NotificationsContent invitations={invitations} />
          </div>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
    </>
  );
}

function NotificationsContent({
  invitations,
}: {
  invitations: NotificationsPanelProps["invitations"];
}) {
  if (invitations.length === 0) {
    return (
      <div className="py-16 text-center space-y-4">
        <Icon name="envelope-open" className="h-12 w-12 mx-auto" />

        <p className="text-neutral">No new notifications</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <p className="text-sm text-neutral mb-4">
        You have {invitations.length} pending invitation
        {invitations.length !== 1 ? "s" : ""}
      </p>
      <div className="space-y-2">
        {invitations.map(({ invitation, organization, invitedBy }) => (
          <InvitationNotification
            key={invitation.id}
            invitation={invitation}
            organization={organization}
            invitedBy={invitedBy}
          />
        ))}
      </div>
    </div>
  );
}

function InvitationNotification({
  invitation,
  organization,
  invitedBy,
}: {
  invitation: OrganizationInvitation;
  organization: Organization;
  invitedBy: Pick<User, "id" | "email" | "name" | "avatar">;
}) {
  const [acceptResult, acceptAction, acceptPending] = useActionState(
    acceptInvitation,
    undefined
  );

  const [declineResult, declineAction, declinePending] = useActionState(
    declineInvitation,
    undefined
  );

  const handleAccept = (formData: FormData) => {
    startTransition(() => {
      acceptAction(formData);
    });
  };

  const handleDecline = (formData: FormData) => {
    startTransition(() => {
      declineAction(formData);
    });
  };

  return (
    <Card className="bg-base-200">
      <div className="card-body p-4">
        <div className="flex items-start gap-3">
          {organization.logoUrl ? (
            <div className="avatar">
              <div className="w-10 rounded-full">
                <img src={organization.logoUrl} alt={organization.name} />
              </div>
            </div>
          ) : (
            <div className="avatar placeholder">
              <div className="bg-primary text-primary-content rounded-full w-10">
                <span className="text-lg">{organization.name[0]}</span>
              </div>
            </div>
          )}
          <div className="flex-1 min-w-0">
            <p className="text-sm">
              <span className="font-medium">
                {invitedBy.name || invitedBy.email}
              </span>
              {" invited you to join "}
              <span className="font-medium">{organization.name}</span>
              {" as "}
              <span className="badge badge-sm badge-ghost">
                {invitation.role}
              </span>
            </p>
            <p className="text-xs text-neutral mt-1">
              Expires {new Date(invitation.expiresAt).toLocaleDateString()}
            </p>
            <div className="flex gap-2 mt-3">
              <form action={handleAccept} className="inline-block">
                <input
                  type="hidden"
                  name="invitationId"
                  value={invitation.id}
                />
                <button
                  type="submit"
                  className="btn btn-primary btn-sm"
                  disabled={acceptPending || declinePending}
                >
                  {acceptPending ? (
                    <span className="loading loading-dots loading-xs" />
                  ) : (
                    "Accept"
                  )}
                </button>
              </form>
              <form action={handleDecline} className="inline-block">
                <input
                  type="hidden"
                  name="invitationId"
                  value={invitation.id}
                />
                <button
                  type="submit"
                  className="btn btn-ghost btn-sm"
                  disabled={acceptPending || declinePending}
                >
                  {declinePending ? (
                    <span className="loading loading-dots loading-xs" />
                  ) : (
                    "Decline"
                  )}
                </button>
              </form>
            </div>
            {(acceptResult?.error || declineResult?.error) && (
              <div className="text-error text-xs mt-2">
                {acceptResult?.error?.form?.[0] ||
                  acceptResult?.error?.invitationId?.[0] ||
                  declineResult?.error?.form?.[0] ||
                  declineResult?.error?.invitationId?.[0] ||
                  "An error occurred"}
              </div>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}
