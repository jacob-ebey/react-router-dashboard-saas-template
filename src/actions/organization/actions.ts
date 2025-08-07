"use server";

import { parseWithZod } from "@conform-to/zod/v4";
import { redirect } from "react-router";

import { getDb } from "@/db";
import {
  createOrganization,
  addUserToOrganization,
  updateOrganization,
  deleteOrganization,
} from "@/db/mutations/organization";
import { getOrganizationBySlug, getUserOrgRole } from "@/db/queries/organization";
import { requireUser } from "@/lib/auth";
import { CreateOrganizationFormSchema, UpdateOrganizationFormSchema, DeleteOrganizationFormSchema } from "./schema";
import type { SubmissionResult } from "@conform-to/react";

export async function createOrganizationAction(
  _: SubmissionResult | undefined,
  formData: FormData
): Promise<SubmissionResult> {
  const user = requireUser();

  const submission = parseWithZod(formData, {
    schema: CreateOrganizationFormSchema,
  });

  if (submission.status !== "success") {
    return submission.reply();
  }

  const db = getDb();

  try {
    // Check if slug is already taken
    const existingOrg = await getOrganizationBySlug(db, submission.value.slug);
    if (existingOrg) {
      return submission.reply({
        fieldErrors: {
          slug: ["This slug is already taken"],
        },
      });
    }

    // Create the organization
    const organization = await createOrganization(db, {
      name: submission.value.name,
      slug: submission.value.slug,
      address: submission.value.address || null,
      phone: submission.value.phone || null,
      email: submission.value.email || null,
      website: submission.value.website || null,
    });

    // Add the current user as the owner
    await addUserToOrganization(db, {
      organizationId: organization.id,
      userId: user.id,
      role: "owner",
      status: "active",
    });

    // Redirect to the app with the new organization context
    redirect(`/app/organization/${organization.slug}`);

    return submission.reply({ resetForm: true });
  } catch (error) {
    console.error("Failed to create organization:", error);
    return submission.reply({
      formErrors: ["Failed to create organization. Please try again."],
    });
  }
}

export async function updateOrganizationAction(
  _: SubmissionResult | undefined,
  formData: FormData
): Promise<SubmissionResult> {
  const user = requireUser();
  const organizationId = formData.get("organizationId") as string;

  const submission = parseWithZod(formData, {
    schema: UpdateOrganizationFormSchema,
  });

  if (submission.status !== "success") {
    return submission.reply();
  }

  const db = getDb();

  try {
    // Check if user has permission to update the organization
    const userRole = await getUserOrgRole(db, user.id, organizationId);
    if (userRole !== "owner" && userRole !== "admin") {
      return submission.reply({
        formErrors: ["You don't have permission to update this organization."],
      });
    }

    // Update the organization
    const updatedOrg = await updateOrganization(db, organizationId, {
      name: submission.value.name,
      address: submission.value.address || null,
      phone: submission.value.phone || null,
      email: submission.value.email || null,
      website: submission.value.website || null,
      logoUrl: submission.value.logoUrl || null,
    });

    if (!updatedOrg) {
      return submission.reply({
        formErrors: ["Failed to update organization. Organization not found."],
      });
    }

    return submission.reply({ resetForm: false });
  } catch (error) {
    console.error("Failed to update organization:", error);
    return submission.reply({
      formErrors: ["Failed to update organization. Please try again."],
    });
  }
}

export async function deleteOrganizationAction(
  _: SubmissionResult | undefined,
  formData: FormData
): Promise<SubmissionResult> {
  const user = requireUser();
  const organizationId = formData.get("organizationId") as string;

  const submission = parseWithZod(formData, {
    schema: DeleteOrganizationFormSchema,
  });

  if (submission.status !== "success") {
    return submission.reply();
  }

  const db = getDb();

  try {
    // Check if user has permission to delete the organization
    const userRole = await getUserOrgRole(db, user.id, organizationId);
    if (userRole !== "owner") {
      return submission.reply({
        formErrors: ["Only the owner can delete this organization."],
      });
    }

    // Delete the organization
    const deleted = await deleteOrganization(db, organizationId);

    if (!deleted) {
      return submission.reply({
        formErrors: ["Failed to delete organization. Organization not found."],
      });
    }

    // Redirect to the organization selection page
    redirect("/app");

    return submission.reply({ resetForm: true });
  } catch (error) {
    console.error("Failed to delete organization:", error);
    return submission.reply({
      formErrors: ["Failed to delete organization. Please try again."],
    });
  }
}
