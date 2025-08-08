import {
  getFormProps,
  getInputProps,
  getSelectProps,
  useForm as useConformForm,
  type FieldMetadata,
  type FormMetadata,
  type SubmissionResult,
} from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod/v4";
import { startTransition } from "react";
import type { input, output, ZodType } from "zod/v4";

import { cn } from "@/lib/utils";

export function useForm<Schema extends ZodType>({
  action,
  lastResult,
  onSubmit,
  schema,
}: {
  action: React.ComponentProps<"form">["action"];
  lastResult: SubmissionResult | undefined;
  onSubmit?: React.ComponentProps<"form">["onSubmit"];
  schema: Schema;
}) {
  return useConformForm<
    input<Schema> extends Record<string, any> ? input<Schema> : never,
    output<Schema>,
    string[]
  >({
    lastResult,
    shouldValidate: "onBlur",
    shouldRevalidate: "onInput",
    onValidate({ formData }) {
      return parseWithZod(formData, { schema });
    },
    onSubmit(event, context) {
      onSubmit?.(event);
      if (event.defaultPrevented) return;
      if (typeof action === "function") {
        startTransition(async () => {
          await action(context.formData);
        });
        event.preventDefault();
      }
    },
  });
}

export type FormProps<Schema extends Record<string, unknown>> =
  React.ComponentProps<"form"> & {
    form: FormMetadata<Schema>;
  };

export function Form<Schema extends Record<string, unknown>>({
  action,
  className,
  form,
  ...props
}: FormProps<Schema>) {
  return (
    <form
      {...props}
      {...getFormProps(form)}
      action={action}
      className={cn("grid gap-4", className)}
    />
  );
}

export type InputProps = Omit<
  React.ComponentProps<"input">,
  "label" | "name" | "type" | "form"
> & {
  label: React.ReactNode;
  field: FieldMetadata<any>;
  type:
    | "color"
    | "date"
    | "datetime-local"
    | "email"
    | "file"
    | "hidden"
    | "month"
    | "number"
    | "password"
    | "range"
    | "search"
    | "tel"
    | "text"
    | "time"
    | "url"
    | "week";
};

export function Input({
  children,
  className,
  field,
  label,
  type,
  ...props
}: InputProps & {
  children?: React.ReactNode;
}) {
  return (
    <div className={cn("grid gap-1", className)}>
      <label className="floating-label">
        <span>{label}</span>
        <input
          {...getInputProps(field, { type })}
          {...props}
          className="input w-full"
        />
      </label>
      <div id={field.errorId} className="text-error">
        {field.errors?.map((error, index) => (
          <div key={`${index} | ${error}`}>{error}</div>
        ))}
      </div>
      {children}
    </div>
  );
}

export type TextareaProps = Omit<
  React.ComponentProps<"textarea">,
  "label" | "name"
> & {
  label: React.ReactNode;
  field: FieldMetadata<any>;
};

export function Textarea({ className, field, label, ...props }: TextareaProps) {
  return (
    <div className={cn("grid gap-1", className)}>
      <label className="floating-label">
        <span>{label}</span>
        <textarea
          {...getInputProps(field, { type: "text" })}
          {...props}
          className="textarea w-full"
        />
      </label>
      <div id={field.errorId} className="text-error text-sm">
        {field.errors?.map((error, index) => (
          <div key={`${index} | ${error}`}>{error}</div>
        ))}
      </div>
    </div>
  );
}

export type SelectProps = Omit<
  React.ComponentProps<"select">,
  "label" | "name"
> & {
  label: React.ReactNode;
  field: FieldMetadata<any>;
};

export function Select({ className, field, label, ...props }: SelectProps) {
  return (
    <div className={cn("grid gap-1", className)}>
      <label className="floating-label">
        <span>Role</span>
        <select
          {...getSelectProps(field)}
          {...props}
          className="select w-full"
        />
      </label>
      <div id={field.errorId} className="text-error">
        {field.errors?.map((error, index) => (
          <div key={`${index} | ${error}`}>{error}</div>
        ))}
      </div>
    </div>
  );
}

export type FormErrorsProps<Schema extends Record<string, unknown>> = Omit<
  React.ComponentProps<"div">,
  "children" | "id"
> & {
  form: FormMetadata<Schema>;
};

export function FormErrors<Schema extends Record<string, unknown>>({
  className,
  form,
  ...props
}: FormErrorsProps<Schema>) {
  if (!form.errors?.length) return null;

  return (
    <div {...props} id={form.errorId} className={cn("text-error", className)}>
      {form.errors?.map((error, index) => (
        <div key={`${index} | ${error}`}>{error}</div>
      ))}
    </div>
  );
}
