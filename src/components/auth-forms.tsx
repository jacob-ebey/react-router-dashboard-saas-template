"use client";

import { getFormProps, getInputProps, useForm } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod/v4";
import { startTransition, useActionState } from "react";
import { useSearchParams } from "react-router";

import { login, logout, signup } from "@/actions/auth/actions";
import { LoginFormSchema, SignupFormSchema } from "@/actions/auth/schema";

export function LogoutForm() {
  const [_, action, pending] = useActionState(logout, undefined);

  return (
    <form action={action}>
      <button className="btn btn-error btn-soft" type="submit">
        {pending ? (
          <span
            className="loading loading-dots loading-md"
            aria-label="Logging out...."
          />
        ) : (
          "Logout"
        )}
      </button>
    </form>
  );
}

export function LoginForm() {
  const [searchParams] = useSearchParams();
  const redirectTo = searchParams.get("redirectTo") || undefined;

  const [lastResult, action, pending] = useActionState(login, undefined);

  const [form, fields] = useForm({
    lastResult,
    shouldValidate: "onBlur",
    shouldRevalidate: "onInput",
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: LoginFormSchema });
    },
    onSubmit(event, { formData }) {
      startTransition(() => action(formData));
      event.preventDefault();
    },
  });

  return (
    <form {...getFormProps(form)} action={action} className="grid gap-4">
      <input type="hidden" name="redirectTo" value={redirectTo} />

      <div className="grid gap-1">
        <label className="floating-label">
          <span>Email</span>
          <input
            {...getInputProps(fields.email, { type: "email" })}
            placeholder="mail@site.com"
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
          <span>Password</span>
          <input
            {...getInputProps(fields.password, { type: "password" })}
            placeholder="password"
            autoComplete="current-password"
            className="input w-full"
          />
        </label>
        <div id={fields.password.errorId} className="text-error">
          {fields.password.errors}
        </div>
        <div id={form.errorId} className="text-error">
          {form.errors}
        </div>
      </div>
      <div className="grid gap-1">
        <button className="btn btn-primary" type="submit">
          {pending ? (
            <span
              className="loading loading-dots loading-md"
              aria-label="Logging in...."
            />
          ) : (
            "Login"
          )}
        </button>
      </div>
    </form>
  );
}

export function SignupForm() {
  const [searchParams] = useSearchParams();
  const redirectTo = searchParams.get("redirectTo") || undefined;

  const [lastResult, action, pending] = useActionState(signup, undefined);

  const [form, fields] = useForm({
    lastResult,
    shouldValidate: "onBlur",
    shouldRevalidate: "onInput",
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: SignupFormSchema });
    },
    onSubmit(event, { formData }) {
      startTransition(() => action(formData));
      event.preventDefault();
    },
  });

  return (
    <form {...getFormProps(form)} action={action} className="grid gap-4">
      <input type="hidden" name="redirectTo" value={redirectTo} />

      <div className="grid gap-1">
        <label className="floating-label">
          <span>Display Name</span>
          <input
            {...getInputProps(fields.name, { type: "text" })}
            placeholder="display name"
            autoComplete="display-name"
            defaultValue={form.initialValue?.name}
            className="input w-full"
          />
        </label>
        <div id={fields.name.errorId} className="text-error">
          {fields.name.errors}
        </div>
      </div>
      <div className="grid gap-1">
        <label className="floating-label">
          <span>Email</span>
          <input
            {...getInputProps(fields.email, { type: "email" })}
            placeholder="mail@site.com"
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
          <span>Password</span>
          <input
            {...getInputProps(fields.password, { type: "password" })}
            placeholder="password"
            autoComplete="new-password"
            className="input w-full"
          />
        </label>
        <div id={fields.password.errorId} className="text-error">
          {fields.password.errors}
        </div>
      </div>
      <div className="grid gap-1">
        <label className="floating-label">
          <span>Confirm Password</span>
          <input
            {...getInputProps(fields.confirmPassword, { type: "password" })}
            placeholder="confirm password"
            autoComplete="new-password"
            className="input w-full"
          />
        </label>
        <div id={fields.confirmPassword.errorId} className="text-error">
          {fields.confirmPassword.errors}
        </div>
        <div id={form.errorId} className="text-error">
          {form.errors}
        </div>
      </div>
      <div className="grid gap-1">
        <button className="btn btn-primary" type="submit">
          {pending ? (
            <span
              className="loading loading-dots loading-md"
              aria-label="Signing up...."
            />
          ) : (
            "Signup"
          )}
        </button>
      </div>
    </form>
  );
}
