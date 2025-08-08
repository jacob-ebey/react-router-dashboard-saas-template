"use client";

import { useActionState } from "react";

import { inviteUser } from "@/actions/invitation/actions";
import { InviteUserFormSchema } from "@/actions/invitation/schema";
import { Form, Input, Select, useForm } from "@/components/form";
import { Icon } from "@/components/icon";
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
    action,
    defaultValue: {
      role: "member",
    },
    lastResult,
    schema: InviteUserFormSchema,
  });

  return (
    <Form action={action} form={form}>
      <input type="hidden" name="organizationId" value={organization.id} />

      <Input
        field={fields.email}
        label="Email"
        type="email"
        placeholder="colleague@company.com"
        autoComplete="email"
      />

      <div>
        <Select field={fields.role} label="Role">
          <option value="member">Member</option>
          <option value="manager">Manager</option>
          <option value="admin">Admin</option>
          <option value="guest">Guest</option>
        </Select>
        <div className="text-xs text-neutral mt-1">
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

      {!pending && lastResult && lastResult.status !== "error" && (
        <div className="alert alert-success">
          <Icon name="check-circle" className="h-6 w-6 shrink-0" />
          <span>Invitation sent successfully!</span>
        </div>
      )}
    </Form>
  );
}
