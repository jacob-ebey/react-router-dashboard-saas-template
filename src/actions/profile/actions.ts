"use server";

import type { SubmissionResult } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod/v4";
import { redirect } from "react-router";

import { DEFAULT_LOGOUT_REDIRECT_PATH } from "@/constants";
import { getDb } from "@/db";
import {
  deleteUser,
  updateUserName,
  updateUserPassword,
  verifyUserPassword,
} from "@/db/mutations/user";
import { queryUserById } from "@/db/queries/user";
import { requireUser } from "@/lib/auth";
import { destroySession } from "@/lib/session";

import {
  ChangePasswordSchema,
  DeleteAccountSchema,
  UpdateNameSchema,
} from "./schema";

export async function updateName(
  _: SubmissionResult | undefined,
  formData: FormData
): Promise<SubmissionResult> {
  const submission = parseWithZod(formData, { schema: UpdateNameSchema });

  if (submission.status !== "success") {
    return submission.reply();
  }

  const { id } = requireUser();
  const { name } = submission.value;

  const db = getDb();
  const success = await updateUserName(db, id, name);

  if (!success) {
    return submission.reply({
      formErrors: ["Failed to update name. Please try again."],
    });
  }

  return submission.reply({ resetForm: false });
}

export async function changePassword(
  _: SubmissionResult | undefined,
  formData: FormData
): Promise<SubmissionResult> {
  const submission = parseWithZod(formData, { schema: ChangePasswordSchema });

  if (submission.status !== "success") {
    return submission.reply({
      hideFields: ["currentPassword", "newPassword", "confirmPassword"],
    });
  }

  const { id } = requireUser();
  const { currentPassword, newPassword } = submission.value;

  const db = getDb();

  // Verify current password
  const isValid = await verifyUserPassword(db, id, currentPassword);
  if (!isValid) {
    return submission.reply({
      fieldErrors: {
        currentPassword: ["Current password is incorrect"],
      },
      hideFields: ["currentPassword", "newPassword", "confirmPassword"],
    });
  }

  // Update password
  const success = await updateUserPassword(db, id, newPassword);

  if (!success) {
    return submission.reply({
      formErrors: ["Failed to update password. Please try again."],
      hideFields: ["currentPassword", "newPassword", "confirmPassword"],
    });
  }

  return submission.reply({ resetForm: true });
}

export async function deleteAccount(
  _: SubmissionResult | undefined,
  formData: FormData
): Promise<SubmissionResult> {
  const submission = parseWithZod(formData, { schema: DeleteAccountSchema });

  if (submission.status !== "success") {
    return submission.reply();
  }

  const { id } = requireUser();
  const { email } = submission.value;

  const db = getDb();
  const user = await queryUserById(db, id);

  if (!user) {
    return submission.reply({
      formErrors: ["User not found"],
    });
  }

  // Verify email matches
  if (user.email !== email) {
    return submission.reply({
      fieldErrors: {
        email: ["Email address does not match your account"],
      },
    });
  }

  // Delete user
  const success = await deleteUser(db, id);

  if (!success) {
    return submission.reply({
      formErrors: ["Failed to delete account. Please try again."],
    });
  }

  // Destroy session and redirect
  destroySession();
  redirect(DEFAULT_LOGOUT_REDIRECT_PATH);

  return submission.reply({ resetForm: true });
}
