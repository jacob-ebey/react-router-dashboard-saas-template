"use client";

import { getFormProps, getInputProps, useForm } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod/v4";
import { startTransition, useActionState, useState } from "react";

import {
  updateOrganizationAction,
  deleteOrganizationAction,
} from "@/actions/organization/actions";
import {
  UpdateOrganizationFormSchema,
  DeleteOrganizationFormSchema,
} from "@/actions/organization/schema";
import {
  InviteUserForm,
  DeleteInvitationForm,
} from "@/components/invitation-forms";
import {
  Modal,
  ModalContent,
  openModal,
  closeModal,
} from "@/components/ui/modal";
import type { Organization, OrganizationInvitation, User } from "@/db/schema";

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
    <div className="grid gap-8">
      {/* General Settings */}
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title text-secondary mb-4">General Settings</h2>
          <UpdateOrganizationForm organization={organization} />
        </div>
      </div>

      {/* Team Management */}
      {(userRole === "owner" || userRole === "admin") && (
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title text-secondary mb-4">Team Management</h2>
            <p className="text-base-content/70 mb-4">
              Invite team members to collaborate on your organization.
            </p>
            <div className="card-actions mb-6">
              <button
                onClick={() => openModal("invite-modal")}
                className="btn btn-primary"
              >
                <svg
                  className="w-4 h-4 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  />
                </svg>
                Invite User
              </button>
            </div>

            {/* Pending Invitations */}
            {invitations.length > 0 && (
              <>
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
              </>
            )}
          </div>
        </div>
      )}

      {/* Danger Zone */}
      {userRole === "owner" && (
        <div className="card bg-base-100 shadow-xl border-2 border-error">
          <div className="card-body">
            <h2 className="card-title text-error mb-4">Danger Zone</h2>
            <p className="text-base-content/70 mb-4">
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
        </div>
      )}

      {/* Delete Modal */}
      <Modal id="delete-organization-modal" position="end">
        <ModalContent closeButton="right">
          <h3 className="font-bold text-lg text-error">Delete Organization</h3>
          <p className="py-4">
            Are you sure you want to delete <strong>{organization.name}</strong>
            ? This action cannot be undone and will remove all associated data.
          </p>
          <DeleteOrganizationForm
            organizationId={organization.id}
            organizationName={organization.name}
            onCancel={() => closeModal("delete-organization-modal")}
          />
        </ModalContent>
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </Modal>

      {/* Invite Modal */}
      <Modal id="invite-modal" position="end">
        <ModalContent closeButton="right" className="max-w-lg w-full">
          <h3 className="font-bold text-lg mb-4">Invite User</h3>
          <p className="mb-4">
            Send an invitation to join <strong>{organization.name}</strong>.
          </p>
          <InviteUserForm
            organization={organization}
            onSuccess={closeModal.bind(null, "invite-modal")}
          />
        </ModalContent>
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </Modal>

      {/* Delete Invitation Modal */}

      <Modal id="delete-invitation-modal" position="end">
        <ModalContent closeButton="right">
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
        <form method="dialog" className="modal-backdrop">
          <button
            onClick={() => {
              setDeleteInvitation(null);
              closeModal("delete-invitation-modal");
            }}
          >
            close
          </button>
        </form>
      </Modal>
    </div>
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
    lastResult,
    shouldValidate: "onBlur",
    shouldRevalidate: "onInput",
    defaultValue: {
      name: organization.name,
      email: organization.email || "",
      phone: organization.phone || "",
      website: organization.website || "",
      address: organization.address || "",
      logoUrl: organization.logoUrl || "",
    },
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: UpdateOrganizationFormSchema });
    },
    onSubmit(event, { formData }) {
      // Add organization ID to form data
      formData.append("organizationId", organization.id);
      startTransition(() => action(formData));
      event.preventDefault();
    },
  });

  return (
    <form {...getFormProps(form)} action={action} className="grid gap-4">
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
        <div className="grid gap-1">
          <label className="floating-label">
            <span>Organization Name *</span>
            <input
              {...getInputProps(fields.name, { type: "text" })}
              placeholder="Acme Construction Inc."
              className="input w-full"
              required
            />
          </label>
          <div id={fields.name.errorId} className="text-error text-sm">
            {fields.name.errors}
          </div>
        </div>

        <div className="grid gap-1">
          <label className="floating-label">
            <span>Email</span>
            <input
              {...getInputProps(fields.email, { type: "email" })}
              placeholder="contact@acme.com"
              className="input w-full"
            />
          </label>
          <div id={fields.email.errorId} className="text-error text-sm">
            {fields.email.errors}
          </div>
        </div>

        <div className="grid gap-1">
          <label className="floating-label">
            <span>Phone</span>
            <input
              {...getInputProps(fields.phone, { type: "tel" })}
              placeholder="+1 (555) 123-4567"
              className="input w-full"
            />
          </label>
          <div id={fields.phone.errorId} className="text-error text-sm">
            {fields.phone.errors}
          </div>
        </div>

        <div className="grid gap-1">
          <label className="floating-label">
            <span>Website</span>
            <input
              {...getInputProps(fields.website, { type: "url" })}
              placeholder="https://acme.com"
              className="input w-full"
            />
          </label>
          <div id={fields.website.errorId} className="text-error text-sm">
            {fields.website.errors}
          </div>
        </div>
      </div>

      <div className="grid gap-1">
        <label className="floating-label">
          <span>Logo URL</span>
          <input
            {...getInputProps(fields.logoUrl, { type: "url" })}
            placeholder="https://example.com/logo.png"
            className="input w-full"
          />
        </label>
        <div className="text-xs text-base-content/60 mt-1">
          Enter a URL for your organization's logo image
        </div>
        <div id={fields.logoUrl.errorId} className="text-error text-sm">
          {fields.logoUrl.errors}
        </div>
      </div>

      <div className="grid gap-1">
        <label className="floating-label">
          <span>Address</span>
          <textarea
            {...getInputProps(fields.address, { type: "text" })}
            placeholder="123 Main St, City, State 12345"
            className="textarea w-full"
            rows={3}
          />
        </label>
        <div id={fields.address.errorId} className="text-error text-sm">
          {fields.address.errors}
        </div>
      </div>

      <div id={form.errorId} className="text-error text-sm">
        {form.errors}
      </div>

      {lastResult?.status === "success" && (
        <div className="alert alert-success">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="stroke-current shrink-0 h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
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
    </form>
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
    lastResult,
    shouldValidate: "onBlur",
    shouldRevalidate: "onInput",
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: DeleteOrganizationFormSchema });
    },
    onSubmit(event, { formData }) {
      // Add organization ID to form data
      formData.append("organizationId", organizationId);
      startTransition(() => action(formData));
      event.preventDefault();
    },
  });

  return (
    <form {...getFormProps(form)} action={action} className="space-y-4">
      <div className="alert alert-warning">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="stroke-current shrink-0 h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>
        <span>
          This will permanently delete <strong>{organizationName}</strong> and
          all its data.
        </span>
      </div>

      <div className="grid gap-1">
        <label className="floating-label">
          <span>Type DELETE to confirm</span>
          <input
            {...getInputProps(fields.confirmationText, { type: "text" })}
            placeholder="DELETE"
            className="input w-full"
            autoComplete="off"
          />
        </label>
        <div
          id={fields.confirmationText.errorId}
          className="text-error text-sm"
        >
          {fields.confirmationText.errors}
        </div>
      </div>

      <div id={form.errorId} className="text-error text-sm">
        {form.errors}
      </div>

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
    </form>
  );
}
