"use client";

import { getFormProps, getInputProps, useForm } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod/v4";
import { startTransition, useActionState, useState } from "react";
import { Link } from "react-router";

import { createOrganizationAction } from "@/actions/organization/actions";
import { CreateOrganizationFormSchema } from "@/actions/organization/schema";
import type { Organization, OrganizationMember } from "@/db/schema";

type OrganizationWithMembership = Organization & {
  membership: OrganizationMember;
};

interface OrganizationSelectionProps {
  user: { id: string; name?: string | null; email: string };
  organizations: OrganizationWithMembership[];
}

export function OrganizationSelection({
  user,
  organizations,
}: OrganizationSelectionProps) {
  const [showCreateForm, setShowCreateForm] = useState(false);

  return (
    <div>
      <div className="max-w-4xl w-full mx-auto">
        {/* Welcome Section */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-primary mb-4">
            Welcome{user.name ? `, ${user.name}` : ""}! 👋
          </h1>
          <p className="text-xl text-base-content/70 mb-2">
            Let's get you set up with your organization
          </p>
          <p className="text-base-content/60">
            You can join existing organizations or create a new one to get
            started
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          {/* Existing Organizations */}
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="card-title text-secondary mb-4">
                🏢 Your Organizations
              </h2>

              {organizations.length > 0 ? (
                <div className="space-y-3">
                  {organizations.map((org) => (
                    <Link
                      key={org.id}
                      to={`/app/organization/${org.slug}`}
                      className="block p-4 rounded-lg border border-base-300 hover:border-primary hover:bg-primary/5 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-semibold text-base-content">
                            {org.name}
                          </h3>
                          <p className="text-sm text-base-content/70">
                            Role: {org.membership.role}
                          </p>
                        </div>
                        <div className="text-primary">
                          <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 5l7 7-7 7"
                            />
                          </svg>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="text-6xl mb-4">🏗️</div>
                  <p className="text-base-content/70 mb-4">
                    You're not part of any organizations yet
                  </p>
                  <p className="text-sm text-base-content/60">
                    Create your first organization to get started with project
                    management
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Create New Organization */}
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="card-title text-accent mb-4">
                ✨ Create New Organization
              </h2>

              {!showCreateForm ? (
                <div className="text-center py-8">
                  <div className="text-6xl mb-4">🚀</div>
                  <p className="text-base-content/70 mb-6">
                    Start fresh with a new organization for your projects and
                    team
                  </p>
                  <button
                    onClick={() => setShowCreateForm(true)}
                    className="btn btn-primary btn-lg"
                  >
                    Create Organization
                  </button>
                </div>
              ) : (
                <CreateOrganizationForm
                  onCancel={() => setShowCreateForm(false)}
                />
              )}
            </div>
          </div>
        </div>

        {/* Additional Help */}
        <div className="mt-8 text-center">
          <div className="alert alert-info">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              className="stroke-current shrink-0 w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>
              <strong>Need help?</strong> Organizations help you manage
              projects, team members, and keep everything organized in one
              place.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

function CreateOrganizationForm({ onCancel }: { onCancel: () => void }) {
  const [lastResult, action, pending] = useActionState(
    createOrganizationAction,
    undefined
  );

  const [form, fields] = useForm({
    lastResult,
    shouldValidate: "onBlur",
    shouldRevalidate: "onInput",
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: CreateOrganizationFormSchema });
    },
    onSubmit(event, { formData }) {
      startTransition(() => action(formData));
      event.preventDefault();
    },
  });

  // Auto-generate slug from name
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "");

    // Update the slug field
    const slugInput = document.querySelector(
      'input[name="slug"]'
    ) as HTMLInputElement;
    if (slugInput) {
      slugInput.value = slug;
    }
  };

  return (
    <form {...getFormProps(form)} action={action} className="space-y-4">
      <div className="grid gap-4">
        <div className="grid gap-1">
          <label className="floating-label">
            <span>Organization Name *</span>
            <input
              {...getInputProps(fields.name, { type: "text" })}
              placeholder="Acme Construction Inc."
              className="input w-full"
              onChange={handleNameChange}
              required
            />
          </label>
          <div id={fields.name.errorId} className="text-error text-sm">
            {fields.name.errors}
          </div>
        </div>

        <div className="grid gap-1">
          <label className="floating-label">
            <span>Organization Slug *</span>
            <input
              {...getInputProps(fields.slug, { type: "text" })}
              placeholder="acme-construction"
              className="input w-full"
              required
            />
          </label>
          <div className="text-xs text-base-content/60 mt-1">
            Used in URLs (lowercase letters, numbers, and dashes only)
          </div>
          <div id={fields.slug.errorId} className="text-error text-sm">
            {fields.slug.errors}
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
      </div>

      <div id={form.errorId} className="text-error text-sm">
        {form.errors}
      </div>

      <div className="flex gap-3 pt-4">
        <button
          type="submit"
          className="btn btn-primary flex-1"
          disabled={pending}
        >
          {pending ? (
            <span
              className="loading loading-dots loading-md"
              aria-label="Creating organization..."
            />
          ) : (
            "Create Organization"
          )}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="btn btn-ghost"
          disabled={pending}
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
