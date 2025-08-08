"use client";

import {
  getFormProps,
  getInputProps,
  getSelectProps,
  useForm,
} from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod/v4";
import { startTransition, useActionState } from "react";

import {
  deleteInvitationAndRemoveUser,
  inviteUser,
} from "@/actions/invitation/actions";
import {
  DeleteInvitationFormSchema,
  InviteUserFormSchema,
} from "@/actions/invitation/schema";
import { closeModal } from "@/components/ui/modal";
import type { Organization } from "@/db/schema";

export function InviteUserForm({
  organization,
  onSuccess,
}: {
  organization: Organization;
  onSuccess?: () => void;
}) {
  const [lastResult, action, pending] = useActionState(
    (async (prevState, formData) => {
      const result = await inviteUser(prevState, formData);
      if (onSuccess && result.status !== "error") {
        onSuccess();
      }
      return result;
    }) satisfies typeof inviteUser,
    undefined
  );

  const [form, fields] = useForm({
    lastResult,
    shouldValidate: "onBlur",
    shouldRevalidate: "onInput",
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: InviteUserFormSchema });
    },
    onSubmit(event, { formData }) {
      startTransition(() => action(formData));
      event.preventDefault();
    },
  });

  return (
    <form {...getFormProps(form)} action={action} className="grid gap-4">
      <input type="hidden" name="organizationId" value={organization.id} />

      <div className="grid gap-1">
        <label className="floating-label">
          <span>Email</span>
          <input
            {...getInputProps(fields.email, { type: "email" })}
            placeholder="colleague@company.com"
            autoComplete="email"
            defaultValue={form.initialValue?.email}
            className="input w-full"
          />
        </label>
        <div id={fields.email.errorId} className="text-error">
          {fields.email.errors}
        </div>
      </div>

      <div className="grid gap-1">
        <label className="floating-label">
          <span>Role</span>
          <select
            {...getSelectProps(fields.role)}
            className="select w-full"
            defaultValue={form.initialValue?.role || "member"}
          >
            <option value="member">Member</option>
            <option value="manager">Manager</option>
            <option value="admin">Admin</option>
            <option value="guest">Guest</option>
          </select>
        </label>
        <div id={fields.role.errorId} className="text-error">
          {fields.role.errors}
        </div>
        <div className="text-xs text-base-content/60 mt-1">
          <ul className="list-disc list-inside space-y-1">
            <li>
              <strong>Admin:</strong> Can manage organization settings and
              invite users
            </li>
            <li>
              <strong>Manager:</strong> Can manage projects and team members
            </li>
            <li>
              <strong>Member:</strong> Can access and contribute to projects
            </li>
            <li>
              <strong>Guest:</strong> Limited read-only access
            </li>
          </ul>
        </div>
      </div>

      <div id={form.errorId} className="text-error">
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
          <span>Invitation sent successfully!</span>
        </div>
      )}

      <div className="grid gap-1">
        <button className="btn btn-primary" type="submit" disabled={pending}>
          {pending ? (
            <span
              className="loading loading-dots loading-md"
              aria-label="Sending invitation..."
            />
          ) : (
            "Send Invitation"
          )}
        </button>
      </div>
    </form>
  );
}

export function DeleteInvitationForm({
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
    lastResult,
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: DeleteInvitationFormSchema });
    },
    onSubmit(event, { formData }) {
      closeModal("delete-invitation-modal");
      startTransition(() => action(formData));
      event.preventDefault();
    },
  });

  return (
    <form {...getFormProps(form)} action={action} className="space-y-4">
      <input type="hidden" name="invitationId" value={invitationId} />

      <div className="alert alert-error">
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
    </form>
  );
}
