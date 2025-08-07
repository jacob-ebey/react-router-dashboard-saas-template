"use client";

import { getFormProps, getInputProps, useForm } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod/v4";
import { startTransition, useActionState, useState } from "react";

import type { User } from "@/db/schema";
import {
  updateName,
  changePassword,
  deleteAccount,
} from "@/actions/profile/actions";
import {
  UpdateNameSchema,
  ChangePasswordSchema,
  DeleteAccountSchema,
} from "@/actions/profile/schema";

export function ProfileForms({ user }: { user: User }) {
  return (
    <div className="grid gap-8">
      <UserInfoSection user={user} />
      <UpdateNameForm currentName={user.name} />
      <ChangePasswordForm />
      <DeleteAccountForm userEmail={user.email} />
    </div>
  );
}

function UserInfoSection({ user }: { user: User }) {
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  return (
    <div className="card bg-base-200">
      <div className="card-body">
        <h2 className="card-title">Account Information</h2>
        <div className="grid gap-4">
          <div>
            <p className="text-sm text-base-content/70">Email</p>
            <p className="font-medium">{user.email}</p>
          </div>
          <div>
            <p className="text-sm text-base-content/70">Account Created</p>
            <p className="font-medium">{formatDate(user.createdAt)}</p>
          </div>
          {user.lastActiveAt && (
            <div>
              <p className="text-sm text-base-content/70">Last Active</p>
              <p className="font-medium">{formatDate(user.lastActiveAt)}</p>
            </div>
          )}
          <div>
            <p className="text-sm text-base-content/70">User ID</p>
            <p className="font-mono text-sm">{user.id}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function UpdateNameForm({ currentName }: { currentName: string | null }) {
  const [lastResult, action, pending] = useActionState(updateName, undefined);

  const [form, fields] = useForm({
    lastResult,
    shouldValidate: "onBlur",
    shouldRevalidate: "onInput",
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: UpdateNameSchema });
    },
    onSubmit(event, { formData }) {
      startTransition(() => action(formData));
      event.preventDefault();
    },
  });

  return (
    <div className="card bg-base-200">
      <div className="card-body">
        <h2 className="card-title">Update Name</h2>
        <form {...getFormProps(form)} action={action} className="grid gap-4 mt-4">
          <div className="grid gap-1">
            <label className="floating-label">
              <span>Name</span>
              <input
                {...getInputProps(fields.name, { type: "text" })}
                placeholder="Your name"
                defaultValue={currentName || ""}
                className="input w-full"
              />
            </label>
            <div id={fields.name.errorId} className="text-error">
              {fields.name.errors}
            </div>
          </div>
          <div className="card-actions">
            <button className="btn btn-primary" type="submit">
              {pending ? (
                <span
                  className="loading loading-dots loading-md"
                  aria-label="Updating name..."
                />
              ) : (
                "Update Name"
              )}
            </button>
          </div>
          {lastResult?.status === "success" && (
            <div className="alert alert-success">
              <span>Name updated successfully!</span>
            </div>
          )}
          {form.errors && (
            <div id={form.errorId} className="alert alert-error">
              <span>{form.errors}</span>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}

function ChangePasswordForm() {
  const [lastResult, action, pending] = useActionState(
    changePassword,
    undefined
  );

  const [form, fields] = useForm({
    lastResult,
    shouldValidate: "onBlur",
    shouldRevalidate: "onInput",
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: ChangePasswordSchema });
    },
    onSubmit(event, { formData }) {
      startTransition(() => action(formData));
      event.preventDefault();
    },
  });

  return (
    <div className="card bg-base-200">
      <div className="card-body">
        <h2 className="card-title">Change Password</h2>
        <form {...getFormProps(form)} action={action} className="grid gap-4 mt-4">
          <div className="grid gap-1">
            <label className="floating-label">
              <span>Current Password</span>
              <input
                {...getInputProps(fields.currentPassword, {
                  type: "password",
                })}
                placeholder="Enter current password"
                autoComplete="current-password"
                className="input w-full"
              />
            </label>
            <div id={fields.currentPassword.errorId} className="text-error">
              {fields.currentPassword.errors}
            </div>
          </div>
          <div className="grid gap-1">
            <label className="floating-label">
              <span>New Password</span>
              <input
                {...getInputProps(fields.newPassword, { type: "password" })}
                placeholder="Enter new password"
                autoComplete="new-password"
                className="input w-full"
              />
            </label>
            <div id={fields.newPassword.errorId} className="text-error">
              {fields.newPassword.errors}
            </div>
          </div>
          <div className="grid gap-1">
            <label className="floating-label">
              <span>Confirm New Password</span>
              <input
                {...getInputProps(fields.confirmPassword, {
                  type: "password",
                })}
                placeholder="Confirm new password"
                autoComplete="new-password"
                className="input w-full"
              />
            </label>
            <div id={fields.confirmPassword.errorId} className="text-error">
              {fields.confirmPassword.errors}
            </div>
          </div>
          <div className="card-actions">
            <button className="btn btn-primary" type="submit">
              {pending ? (
                <span
                  className="loading loading-dots loading-md"
                  aria-label="Changing password..."
                />
              ) : (
                "Change Password"
              )}
            </button>
          </div>
          {lastResult?.status === "success" && (
            <div className="alert alert-success">
              <span>Password changed successfully!</span>
            </div>
          )}
          {form.errors && (
            <div id={form.errorId} className="alert alert-error">
              <span>{form.errors}</span>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}

function DeleteAccountForm({ userEmail }: { userEmail: string }) {
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [lastResult, action, pending] = useActionState(
    deleteAccount,
    undefined
  );

  const [form, fields] = useForm({
    lastResult,
    shouldValidate: "onBlur",
    shouldRevalidate: "onInput",
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: DeleteAccountSchema });
    },
    onSubmit(event, { formData }) {
      startTransition(() => action(formData));
      event.preventDefault();
    },
  });

  return (
    <div className="card bg-error/10 border-error">
      <div className="card-body">
        <h2 className="card-title text-error">Delete Account</h2>
        <p className="text-sm">
          This action is permanent and cannot be undone. All your data will be
          deleted.
        </p>

        {!showConfirmation ? (
          <div className="card-actions mt-4">
            <button
              className="btn btn-error"
              onClick={() => setShowConfirmation(true)}
            >
              Delete Account
            </button>
          </div>
        ) : (
          <form {...getFormProps(form)} action={action} className="grid gap-4 mt-4">
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
                Type your email address <strong>{userEmail}</strong> to confirm
                deletion.
              </span>
            </div>
            <div className="grid gap-1">
              <label className="floating-label">
                <span>Email Confirmation</span>
                <input
                  {...getInputProps(fields.email, { type: "email" })}
                  placeholder="Type your email to confirm"
                  autoComplete="off"
                  className="input w-full"
                />
              </label>
              <div id={fields.email.errorId} className="text-error">
                {fields.email.errors}
              </div>
            </div>
            <div className="card-actions gap-2">
              <button
                type="button"
                className="btn"
                onClick={() => setShowConfirmation(false)}
              >
                Cancel
              </button>
              <button className="btn btn-error" type="submit">
                {pending ? (
                  <span
                    className="loading loading-dots loading-md"
                    aria-label="Deleting account..."
                  />
                ) : (
                  "Permanently Delete Account"
                )}
              </button>
            </div>
            {form.errors && (
              <div id={form.errorId} className="alert alert-error">
                <span>{form.errors}</span>
              </div>
            )}
          </form>
        )}
      </div>
    </div>
  );
}
