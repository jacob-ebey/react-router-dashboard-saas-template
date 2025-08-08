"use client";

import { useActionState } from "react";
import { useSearchParams } from "react-router";

import { login } from "@/actions/auth/actions";
import { LoginFormSchema } from "@/actions/auth/schema";
import { Form, FormErrors, Input, useForm } from "@/components/form";

export function LoginForm() {
  const [lastResult, action, pending] = useActionState(login, undefined);

  const [form, fields] = useForm({
    action,
    lastResult,
    schema: LoginFormSchema,
  });

  const [searchParams] = useSearchParams();
  const redirectTo = searchParams.get("redirectTo") || undefined;

  return (
    <Form action={action} form={form}>
      <input type="hidden" name={fields.redirectTo.name} value={redirectTo} />
      <input
        hidden
        autoComplete="username"
        name="username"
        defaultValue="user"
      />
      <Input
        field={fields.email}
        label="Email"
        type="email"
        placeholder="john.doe@example.com"
        autoComplete="email"
        required
      />
      <Input
        field={fields.password}
        label="Password"
        type="password"
        placeholder="********"
        autoComplete="current-password"
        required
      />
      <FormErrors form={form} />
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
    </Form>
  );
}
