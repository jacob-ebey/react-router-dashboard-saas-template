"use server";

import { parseWithZod } from "@conform-to/zod/v4";
import { redirect } from "react-router";

import { getDb } from "@/db";
import {
  createOrganization,
  addUserToOrganization,
} from "@/db/mutations/organization";
import { getOrganizationBySlug } from "@/db/queries/organization";
import { requireUser } from "@/lib/auth";
import { CreateOrganizationFormSchema } from "./schema";
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
