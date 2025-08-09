"use client";

import { useActionState, useState } from "react";

import {
  changePassword,
  deleteAccount,
  updateName,
} from "@/actions/profile/actions";
import {
  ChangePasswordSchema,
  DeleteAccountSchema,
  UpdateNameSchema,
} from "@/actions/profile/schema";
import { Form, FormErrors, Input, useForm } from "@/components/form";
import { Icon } from "@/components/icon";
import { Card } from "@/components/ui/card";
import type { User } from "@/db/schema";

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
    <Card>
      <div className="card-body space-y-4">
        <h2 className="card-title">Account Information</h2>
        <div className="grid gap-4">
          <div>
            <p className="text-sm text-neutral">Email</p>
            <p className="font-medium">{user.email}</p>
          </div>
          <div>
            <p className="text-sm text-neutral">Account Created</p>
            <p className="font-medium">{formatDate(user.createdAt)}</p>
          </div>
          {user.lastActiveAt && (
            <div>
              <p className="text-sm text-neutral">Last Active</p>
              <p className="font-medium">{formatDate(user.lastActiveAt)}</p>
            </div>
          )}
          <div>
            <p className="text-sm text-neutral">User ID</p>
            <p className="font-mono text-sm">{user.id}</p>
          </div>
        </div>
      </div>
    </Card>
  );
}

function UpdateNameForm({ currentName }: { currentName: string | null }) {
  const [lastResult, action, pending] = useActionState(updateName, undefined);

  const [form, fields] = useForm({
    action,
    lastResult,
    schema: UpdateNameSchema,
  });

  return (
    <Card>
      <div className="card-body space-y-4">
        <h2 className="card-title">Update Name</h2>
        <Form action={action} form={form}>
          <Input
            field={fields.name}
            label="Name"
            type="text"
            placeholder="Display Name"
            defaultValue={currentName || ""}
          />

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
          {lastResult && lastResult.status !== "error" && (
            <div className="alert alert-success">
              <span>Name updated successfully!</span>
            </div>
          )}
          {form.errors && (
            <div id={form.errorId} className="alert alert-error">
              <span>{form.errors}</span>
            </div>
          )}
        </Form>
      </div>
    </Card>
  );
}

function ChangePasswordForm() {
  const [lastResult, action, pending] = useActionState(
    changePassword,
    undefined
  );

  const [form, fields] = useForm({
    action,
    lastResult,
    schema: ChangePasswordSchema,
  });

  return (
    <Card>
      <div className="card-body space-y-4">
        <h2 className="card-title">Change Password</h2>
        <Form action={action} form={form}>
          <input hidden autoComplete="username" name="username" />
          <Input
            field={fields.currentPassword}
            label="Current Password"
            type="password"
            placeholder="Enter current password"
            autoComplete="current-password"
          />
          <Input
            field={fields.newPassword}
            label="New Password"
            type="password"
            placeholder="Enter new password"
            autoComplete="new-password"
          />
          <Input
            field={fields.confirmPassword}
            label="Confirm Password"
            type="password"
            placeholder="Confirm password"
            autoComplete="new-password"
          />

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
          <FormErrors form={form} />
          {lastResult && lastResult.status !== "error" && (
            <div className="alert alert-success">
              <span>Password changed successfully!</span>
            </div>
          )}
        </Form>
      </div>
    </Card>
  );
}

function DeleteAccountForm({ userEmail }: { userEmail: string }) {
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [lastResult, action, pending] = useActionState(
    deleteAccount,
    undefined
  );

  const [form, fields] = useForm({
    action,
    lastResult,
    schema: DeleteAccountSchema,
  });

  return (
    <Card className="border-error">
      <div className="card-body space-y-4">
        <h2 className="card-title text-error">Delete Account</h2>
        <p className="text-sm">
          This action is permanent and cannot be undone. All your data will be
          deleted.
        </p>

        {!showConfirmation ? (
          <div className="card-actions">
            <button
              className="btn btn-error"
              onClick={() => setShowConfirmation(true)}
            >
              Delete Account
            </button>
          </div>
        ) : (
          <Form action={action} form={form}>
            <div className="alert alert-warning">
              <Icon name="exclamation-triangle" className="h-6 w-6" />
              <span>
                Type your email address <strong>{userEmail}</strong> to confirm
                deletion.
              </span>
            </div>
            <Input
              field={fields.email}
              label="Email Confirmation"
              type="email"
              placeholder="Type your email to confirm"
              autoComplete="off"
            />
            <FormErrors form={form} />
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
          </Form>
        )}
      </div>
    </Card>
  );
}
