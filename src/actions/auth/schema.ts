import * as z from "zod/v4";

export const LoginFormSchema = z.object({
  redirectTo: z.string({}).optional(),
  email: z
    .string({ error: "Email is required." })
    .trim()
    .check(z.email({ message: "Please enter a valid email." })),
  password: z.string({ error: "Password is required." }),
});

export const SignupFormSchema = z
  .object({
    redirectTo: z.string().optional(),
    name: z
      .string({ error: "Display name is required." })
      .trim()
      .min(2, { error: "Display name must be at least 2 characters long." })
      .max(30, { error: "Display name must be at most 30 characters long." }),
    email: z
      .string({ error: "Email is required." })
      .trim()
      .check(z.email({ error: "Please enter a valid email." })),
    password: z
      .string({ error: "Password is required." })
      .min(8, { error: "Must be at least 8 characters long." })
      .regex(/[a-zA-Z]/, { error: "Must contain at least one letter." })
      .regex(/[0-9]/, { error: "Must contain at least one number." })
      .regex(/[^a-zA-Z0-9]/, {
        error: "Must contain at least one special character.",
      }),
    confirmPassword: z.string({ error: "Confirm password is required." }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    error: "Passwords do not match.",
  });
