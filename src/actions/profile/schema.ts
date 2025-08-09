import { z } from "zod/v4";

export const UpdateNameSchema = z.object({
  name: z
    .string({ error: "Name is required." })
    .trim()
    .min(1, "Name is required.")
    .max(255, "Name is too long."),
});

export const ChangePasswordSchema = z
  .object({
    currentPassword: z
      .string({ error: "Current password is required." })
      .min(1, "Current password is required."),
    newPassword: z
      .string({ error: "Password is required." })
      .min(8, { error: "Must be at least 8 characters long." })
      .regex(/[a-zA-Z]/, { error: "Must contain at least one letter." })
      .regex(/[0-9]/, { error: "Must contain at least one number." })
      .regex(/[^a-zA-Z0-9]/, {
        error: "Must contain at least one special character.",
      }),
    confirmPassword: z.string({ error: "Confirm password is required." }),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match.",
    path: ["confirmPassword"],
  })
  .refine((data) => data.currentPassword !== data.newPassword, {
    message: "New password must be different from current password.",
    path: ["newPassword"],
  });

export const DeleteAccountSchema = z.object({
  email: z
    .string({
      error: "Email is required.",
    })
    .check(z.email({ error: "Please enter a valid email address." })),
});
