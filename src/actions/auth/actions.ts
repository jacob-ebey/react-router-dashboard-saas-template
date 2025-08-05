"use server";

import type { SubmissionResult } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod/v4";
import { redirect } from "react-router";

import {
  DEFAULT_LOGIN_REDIRECT_PATH,
  DEFAULT_LOGOUT_REDIRECT_PATH,
} from "@/constants";
import { getDb } from "@/db";
import { createUser } from "@/db/mutations/user";
import { getUserByEmailAndPassword } from "@/db/queries/user";
import { destroySession, getSession } from "@/lib/session";
import { validateRedirect } from "@/lib/utils";

import { LoginFormSchema, SignupFormSchema } from "./schema";

export async function logout() {
  destroySession();
  redirect(DEFAULT_LOGOUT_REDIRECT_PATH);
}

export async function login(
  _: SubmissionResult | undefined,
  formData: FormData
): Promise<SubmissionResult> {
  const submission = parseWithZod(formData, { schema: LoginFormSchema });

  if (submission.status !== "success") {
    return submission.reply({ hideFields: ["password"], resetForm: false });
  }

  const { redirectTo, email, password } = submission.value;

  const db = getDb();

  const user = await getUserByEmailAndPassword(db, email, password);

  if (!user) {
    return submission.reply({
      formErrors: ["Invalid email or password."],
      hideFields: ["password"],
      resetForm: false,
    });
  }

  const session = getSession();
  session.set("user", {
    id: user.id,
    publicId: user.publicId,
  });

  redirect(validateRedirect(redirectTo, DEFAULT_LOGIN_REDIRECT_PATH));

  return submission.reply({ resetForm: true });
}

export async function signup(
  _: SubmissionResult | undefined,
  formData: FormData
): Promise<SubmissionResult> {
  const submission = parseWithZod(formData, { schema: SignupFormSchema });

  if (submission.status !== "success") {
    return submission.reply({ hideFields: ["password", "confirmPassword"] });
  }

  const { redirectTo, email, password, name } = submission.value;

  const db = getDb();

  const user = await createUser(db, {
    email,
    password,
    name,
  });

  if (!user) {
    return submission.reply({
      hideFields: ["password", "confirmPassword"],
      formErrors: ["Failed to create user."],
    });
  }

  const session = getSession();
  session.set("user", {
    id: user.id,
    publicId: user.publicId,
  });

  redirect(validateRedirect(redirectTo, DEFAULT_LOGIN_REDIRECT_PATH));

  return submission.reply({ resetForm: true });
}
