"use client";

import { useActionState, useState } from "react";

import { createOrganizationAction } from "@/actions/organization/actions";
import { CreateOrganizationFormSchema } from "@/actions/organization/schema";
import { Form, FormErrors, Input, Textarea, useForm } from "@/components/form";

export function CreateOrganizationForm() {
  const [lastResult, action, pending] = useActionState(
    createOrganizationAction,
    undefined
  );

  const [form, fields] = useForm({
    action,
    lastResult,
    schema: CreateOrganizationFormSchema,
  });

  const [showCreateForm, setShowCreateForm] = useState(false);

  return !showCreateForm ? (
    <div className="text-center space-y-4">
      <div className="text-6xl">🚀</div>
      <p className="text-neutral">
        Start fresh with a new organization for your projects and team
      </p>
      <button
        onClick={() => setShowCreateForm(true)}
        className="btn btn-primary btn-lg"
      >
        Create Organization
      </button>
    </div>
  ) : (
    <Form action={action} form={form}>
      <Input
        field={fields.name}
        type="text"
        label="Organization Name*"
        required
        placeholder="Acme Inc."
      />
      <Input
        field={fields.slug}
        type="text"
        label="Organization Slug*"
        required
        placeholder="acme-inc"
      />
      <Input
        field={fields.email}
        type="email"
        label="Email"
        placeholder="info@acme.com"
      />
      <Input
        field={fields.phone}
        type="tel"
        label="Phone"
        placeholder="(123) 456-7890"
      />
      <Input
        field={fields.website}
        type="url"
        label="Website"
        placeholder="https://acme.com"
      />
      <Textarea
        field={fields.address}
        label="Address"
        placeholder="123 Main St, City, State 12345"
        rows={3}
      />
      <FormErrors form={form} />
      <div className="grid grid-flow-col gap-1">
        <button className="btn btn-primary" type="submit">
          {pending ? "Creating..." : "Create Organization"}
        </button>
        <button
          className="btn btn-ghost"
          type="button"
          onClick={() => {
            setShowCreateForm(false);
            form.reset();
          }}
        >
          Cancel
        </button>
      </div>
    </Form>
  );
}
