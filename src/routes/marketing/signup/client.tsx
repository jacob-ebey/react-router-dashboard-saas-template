"use client";

import { useActionState } from "react";
import { useSearchParams } from "react-router";

import { signup } from "@/actions/auth/actions";
import { SignupFormSchema } from "@/actions/auth/schema";
import { Form, FormErrors, Input, useForm } from "@/components/form";

export function SignupForm() {
  const [lastResult, action, pending] = useActionState(signup, undefined);

  const [form, fields] = useForm({
    action,
    lastResult,
    schema: SignupFormSchema,
  });

  const [searchParams] = useSearchParams();
  const redirectTo = searchParams.get("redirectTo") || undefined;

  return (
    <Form action={action} form={form}>
      <input type="hidden" name="username" value="user" />
      <input type="hidden" name={fields.redirectTo.name} value={redirectTo} />
      <Input
        field={fields.name}
        label="Display Name"
        type="text"
        placeholder="John Doe"
        required
      />
      <Input
        field={fields.email}
        label="Email"
        type="email"
        placeholder="john.doe@example.com"
        required
      />
      <Input
        field={fields.password}
        label="Password"
        type="password"
        placeholder="********"
        required
      />
      <Input
        field={fields.confirmPassword}
        label="Confirm Password"
        type="password"
        placeholder="********"
        required
      />
      <FormErrors form={form} />
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
    </Form>
  );
}
