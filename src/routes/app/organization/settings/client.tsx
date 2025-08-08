"use client";

import { useActionState, useState } from "react";

import {
  deleteOrganizationAction,
  leaveOrganizationAction,
  updateOrganizationAction,
} from "@/actions/organization/actions";
import {
  DeleteOrganizationFormSchema,
  LeaveOrganizationFormSchema,
  UpdateOrganizationFormSchema,
} from "@/actions/organization/schema";
import { Form, FormErrors, Input, Textarea, useForm } from "@/components/form";
import { Icon } from "@/components/icon";
import { Card } from "@/components/ui/card";
import { Modal, ModalContent } from "@/components/ui/modal";
import { closeModal, openModal } from "@/components/ui/modal-on";
import type { Organization, OrganizationInvitation, User } from "@/db/schema";

import { deleteInvitationAndRemoveUser } from "@/actions/invitation/actions";
import { DeleteInvitationFormSchema } from "@/actions/invitation/schema";

import { InviteUserForm } from "../invite/client";

interface OrganizationSettingsFormsProps {
  organization: Organization;
  userRole: string;
  invitations: Array<{
    invitation: OrganizationInvitation;
    invitedBy: Pick<User, "id" | "email" | "name" | "avatar">;
  }>;
}

export function OrganizationSettingsForms({
  organization,
  userRole,
  invitations,
}: OrganizationSettingsFormsProps) {
  const [deleteInvitation, setDeleteInvitation] = useState<{
    id: string;
    email: string;
    isAccepted: boolean;
  } | null>(null);

  return (
    <div className="flex flex-col gap-8">
      {/* General Settings */}
      {(userRole === "owner" || userRole === "admin") && (
        <Card>
          <div className="card-body space-y-4">
            <h2 className="card-title text-secondary mb-4">General Settings</h2>
            <UpdateOrganizationForm organization={organization} />
          </div>
        </Card>
      )}

      {/* Team Management */}
      {(userRole === "owner" || userRole === "admin") && (
        <Card>
          <div className="card-body flex flex-col gap-4">
            <h2 className="card-title text-secondary">Team Management</h2>
            <p className="text-neutral">
              Invite team members to collaborate on your organization.
            </p>
            <div className="card-actions">
              <button
                onClick={() => openModal("invite-modal")}
                className="btn btn-primary"
              >
                <Icon name="plus" className="h-4 w-4 mr-2" />
                Invite User
              </button>
            </div>

            {/* Pending Invitations */}
            {invitations.length > 0 && (
              <div className="flex-1">
                <div className="divider">Pending Invitations</div>
                <div className="overflow-x-auto">
                  <table className="table table-zebra">
                    <thead>
                      <tr>
                        <th>Email</th>
                        <th>Role</th>
                        <th>Invited By</th>
                        <th>Status</th>
                        <th>Expires</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {invitations.map(({ invitation, invitedBy }) => {
                        const expiresAt = new Date(invitation.expiresAt);
                        const isExpired = expiresAt < new Date();
                        const statusClass =
                          invitation.status === "accepted"
                            ? "badge-success"
                            : invitation.status === "revoked"
                            ? "badge-error"
                            : isExpired
                            ? "badge-warning"
                            : "badge-info";

                        return (
                          <tr key={invitation.id}>
                            <td>{invitation.email}</td>
                            <td>
                              <span className="badge badge-ghost">
                                {invitation.role}
                              </span>
                            </td>
                            <td>
                              <div className="flex items-center gap-3">
                                {invitedBy.avatar && (
                                  <div className="avatar">
                                    <div className="mask mask-squircle w-8 h-8">
                                      <img
                                        src={invitedBy.avatar}
                                        alt={invitedBy.name || invitedBy.email}
                                      />
                                    </div>
                                  </div>
                                )}
                                <div>
                                  <div className="text-sm font-medium">
                                    {invitedBy.name || invitedBy.email}
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td>
                              <span className={`badge ${statusClass}`}>
                                {isExpired && invitation.status === "pending"
                                  ? "expired"
                                  : invitation.status}
                              </span>
                            </td>
                            <td className="text-sm">
                              {expiresAt.toLocaleDateString()}
                            </td>
                            <td>
                              <button
                                onClick={() => {
                                  setDeleteInvitation({
                                    id: invitation.id,
                                    email: invitation.email,
                                    isAccepted:
                                      invitation.status === "accepted",
                                  });
                                  openModal("delete-invitation-modal");
                                }}
                                className="btn btn-ghost btn-xs text-error"
                              >
                                Delete
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </Card>
      )}

      {/* Danger Zone */}
      {userRole === "owner" ? (
        <Card className="border-error">
          <div className="card-body">
            <h2 className="card-title text-error mb-4">Danger Zone</h2>
            <p className="text-neutral mb-4">
              Once you delete an organization, there is no going back. Please be
              certain.
            </p>
            <div className="card-actions">
              <button
                onClick={() => openModal("delete-organization-modal")}
                className="btn btn-error"
              >
                Delete Organization
              </button>
            </div>
          </div>
        </Card>
      ) : (
        <Card className="border-error">
          <div className="card-body">
            <h2 className="card-title text-error mb-4">Danger Zone</h2>
            <p className="text-neutral mb-4">
              Once you leave an organization, there is no going back. Please be
              certain.
            </p>
            <div className="card-actions">
              <button
                onClick={() => openModal("leave-organization-modal")}
                className="btn btn-error"
              >
                Leave Organization
              </button>
            </div>
          </div>
        </Card>
      )}

      {/* Delete Modal */}
      <Modal id="delete-organization-modal" position="end" clickAwayToClose>
        <ModalContent className="space-y-4 w-full max-w-md" closeButton="right">
          <h3 className="font-bold text-lg text-error">Delete Organization</h3>
          <p>
            Are you sure you want to delete <strong>{organization.name}</strong>
            ? This action cannot be undone and will remove all associated data.
          </p>
          <DeleteOrganizationForm
            organizationId={organization.id}
            organizationName={organization.name}
            onCancel={() => closeModal("delete-organization-modal")}
          />
        </ModalContent>
      </Modal>

      {/* Leave Modal */}
      <Modal id="leave-organization-modal" position="end" clickAwayToClose>
        <ModalContent className="space-y-4 w-full max-w-md" closeButton="right">
          <h3 className="font-bold text-lg text-error">Leave Organization</h3>
          <p>
            Are you sure you want to leave <strong>{organization.name}</strong>?
            This action cannot be undone and will remove you from the
            organization.
          </p>
          <LeaveOrganizationForm
            organizationId={organization.id}
            organizationName={organization.name}
            onCancel={() => closeModal("leave-organization-modal")}
          />
        </ModalContent>
      </Modal>

      {/* Invite Modal */}
      <Modal id="invite-modal" position="end" clickAwayToClose>
        <ModalContent className="max-w-lg w-full space-y-4" closeButton="right">
          <h3 className="font-bold text-lg">Invite User</h3>
          <p>
            Send an invitation to join <strong>{organization.name}</strong>.
          </p>
          <InviteUserForm
            organization={organization}
            onSuccess={closeModal.bind(null, "invite-modal")}
          />
        </ModalContent>
      </Modal>

      {/* Delete Invitation Modal */}
      <Modal id="delete-invitation-modal" position="end" clickAwayToClose>
        <ModalContent className="space-y-4 w-full max-w-md" closeButton="right">
          <h3 className="font-bold text-lg text-error mb-4">
            Delete Invitation
          </h3>
          {!!deleteInvitation && (
            <DeleteInvitationForm
              invitationId={deleteInvitation.id}
              invitationEmail={deleteInvitation.email}
              isAccepted={deleteInvitation.isAccepted}
            />
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}

function DeleteInvitationForm({
  invitationId,
  invitationEmail,
  isAccepted,
}: {
  invitationId: string;
  invitationEmail: string;
  isAccepted: boolean;
}) {
  const [lastResult, action, pending] = useActionState(
    deleteInvitationAndRemoveUser,
    undefined
  );

  const [form, _fields] = useForm({
    action,
    lastResult,
    schema: DeleteInvitationFormSchema,
    onSubmit: closeModal.bind(null, "delete-invitation-modal"),
  });

  return (
    <Form action={action} form={form}>
      <input type="hidden" name="invitationId" value={invitationId} />

      <div className="alert alert-error">
        <Icon name="exclamation-triangle" className="h-6 w-6 shrink-0" />

        <div>
          <p>
            Are you sure you want to delete the invitation for{" "}
            <strong>{invitationEmail}</strong>?
          </p>
          {isAccepted && (
            <p className="mt-2">
              <strong>Warning:</strong> This invitation has been accepted. The
              user will also be removed from the organization.
            </p>
          )}
          <p className="mt-2 text-sm">This action cannot be undone.</p>
        </div>
      </div>

      <div id={form.errorId} className="text-error text-sm">
        {form.errors}
      </div>

      <div className="flex gap-2 justify-end">
        <button
          type="button"
          className="btn btn-ghost"
          disabled={pending}
          onClick={closeModal.bind(null, "delete-invitation-modal")}
        >
          Cancel
        </button>

        <button type="submit" className="btn btn-error" disabled={pending}>
          {pending ? (
            <span
              className="loading loading-dots loading-md"
              aria-label="Deleting invitation..."
            />
          ) : (
            "Delete Invitation"
          )}
        </button>
      </div>
    </Form>
  );
}

function UpdateOrganizationForm({
  organization,
}: {
  organization: Organization;
}) {
  const [lastResult, action, pending] = useActionState(
    updateOrganizationAction,
    undefined
  );

  const [form, fields] = useForm({
    action,
    defaultValue: {
      name: organization.name,
      email: organization.email || "",
      phone: organization.phone || "",
      website: organization.website || "",
      address: organization.address || "",
      logoUrl: organization.logoUrl || "",
    },
    lastResult,
    schema: UpdateOrganizationFormSchema,
  });

  return (
    <Form action={action} form={form}>
      <input
        type="hidden"
        name={fields.organizationId.name}
        value={organization.id}
      />

      {/* Logo Preview */}
      {fields.logoUrl.value && (
        <div className="flex justify-center mb-4">
          <div className="avatar">
            <div className="w-24 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
              <img src={fields.logoUrl.value} alt="Organization logo" />
            </div>
          </div>
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        <Input
          field={fields.name}
          type="text"
          label="Organization Name"
          placeholder="Acme Construction Inc."
          required
        />

        <Input
          field={fields.email}
          type="email"
          label="Email"
          placeholder="contact@acme.com"
          required
        />

        <Input
          field={fields.phone}
          type="tel"
          label="Phone"
          placeholder="+1 (555) 123-4567"
          required
        />

        <Input
          field={fields.website}
          type="url"
          label="Website"
          placeholder="https://acme.com"
          required
        />
      </div>

      <Input
        field={fields.logoUrl}
        type="url"
        label="Logo URL"
        placeholder="https://example.com/logo.png"
        required
      />

      <Textarea
        field={fields.address}
        label="Address"
        placeholder="123 Main St, City, State 12345"
        rows={3}
        required
      />

      <FormErrors form={form} />

      {lastResult && lastResult.status !== "error" && (
        <div className="alert alert-success">
          <Icon name="check-circle" className="h-6 w-6" />
          <span>Organization settings updated successfully!</span>
        </div>
      )}

      <div className="card-actions justify-end">
        <button type="submit" className="btn btn-primary" disabled={pending}>
          {pending ? (
            <span
              className="loading loading-dots loading-md"
              aria-label="Saving changes..."
            />
          ) : (
            "Save Changes"
          )}
        </button>
      </div>
    </Form>
  );
}

function DeleteOrganizationForm({
  organizationId,
  organizationName,
  onCancel,
}: {
  organizationId: string;
  organizationName: string;
  onCancel: () => void;
}) {
  const [lastResult, action, pending] = useActionState(
    deleteOrganizationAction,
    undefined
  );

  const [form, fields] = useForm({
    action,
    lastResult,
    schema: DeleteOrganizationFormSchema,
  });

  return (
    <Form action={action} form={form}>
      <input
        type="hidden"
        name={fields.organizationId.name}
        value={organizationId}
      />

      <div className="alert alert-warning">
        <Icon name="exclamation-triangle" className="h-6 w-6" />
        <span>
          This will permanently delete <strong>{organizationName}</strong> and
          all its data.
        </span>
      </div>

      <Input
        field={fields.confirmationText}
        type="text"
        label="Confirmation Text"
        placeholder="DELETE"
        required
      />

      <FormErrors form={form} />

      <div className="modal-action">
        <button
          type="button"
          onClick={onCancel}
          className="btn btn-ghost"
          disabled={pending}
        >
          Cancel
        </button>
        <button type="submit" className="btn btn-error" disabled={pending}>
          {pending ? (
            <span
              className="loading loading-dots loading-md"
              aria-label="Deleting organization..."
            />
          ) : (
            "Delete Organization"
          )}
        </button>
      </div>
    </Form>
  );
}

function LeaveOrganizationForm({
  organizationId,
  organizationName,
  onCancel,
}: {
  organizationId: string;
  organizationName: string;
  onCancel: () => void;
}) {
  const [lastResult, action, pending] = useActionState(
    leaveOrganizationAction,
    undefined
  );

  const [form, fields] = useForm({
    action,
    lastResult,
    schema: LeaveOrganizationFormSchema,
  });

  return (
    <Form action={action} form={form}>
      <input
        type="hidden"
        name={fields.organizationId.name}
        value={organizationId}
      />

      <div className="alert alert-warning">
        <Icon name="exclamation-triangle" className="h-6 w-6" />
        <span>
          This will permanently remove you from{" "}
          <strong>{organizationName}</strong>.
        </span>
      </div>

      <Input
        field={fields.confirmationText}
        type="text"
        label="Confirmation Text"
        placeholder="LEAVE"
        required
      />

      <FormErrors form={form} />

      <div className="modal-action">
        <button
          type="button"
          onClick={onCancel}
          className="btn btn-ghost"
          disabled={pending}
        >
          Cancel
        </button>
        <button type="submit" className="btn btn-error" disabled={pending}>
          {pending ? (
            <span
              className="loading loading-dots loading-md"
              aria-label="Leaving organization..."
            />
          ) : (
            "Leave Organization"
          )}
        </button>
      </div>
    </Form>
  );
}
