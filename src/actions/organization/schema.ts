import { z } from "zod/v4";

export const CreateOrganizationFormSchema = z.object({
  name: z
    .string({ error: "Name is required." })
    .min(1, "Organization name is required.")
    .max(255, "Name too long."),
  slug: z
    .string({ error: "Slug is required." })
    .min(1, "Organization slug is required.")
    .max(100, "Slug too long.")
    .regex(
      /^[a-z0-9-]+$/,
      "Slug can only contain lowercase letters, numbers, and dashes."
    ),
  address: z.string().optional(),
  phone: z.string().optional(),
  email: z
    .string()
    .check(z.email({ message: "Please enter a valid email." }))
    .optional(),
  website: z
    .string()
    .check(z.url({ error: "Please enter a valid website URL." }))
    .optional(),
});

export type CreateOrganizationFormData = z.infer<
  typeof CreateOrganizationFormSchema
>;

export const UpdateOrganizationFormSchema = z.object({
  name: z
    .string({ error: "Name is required." })
    .min(1, "Organization name is required.")
    .max(255, "Name too long."),
  address: z.string().optional(),
  phone: z.string().optional(),
  email: z
    .string()
    .check(z.email({ message: "Please enter a valid email." }))
    .optional(),
  website: z
    .string()
    .check(z.url({ error: "Please enter a valid website URL." }))
    .optional(),
  logoUrl: z
    .string()
    .check(z.url({ error: "Please enter a valid logo URL." }))
    .optional(),
  organizationId: z.string(),
});

export type UpdateOrganizationFormData = z.infer<
  typeof UpdateOrganizationFormSchema
>;

export const DeleteOrganizationFormSchema = z.object({
  organizationId: z.string(),
  confirmationText: z.literal("DELETE", {
    error: "Please type DELETE to confirm.",
  }),
});

export const LeaveOrganizationFormSchema = z.object({
  organizationId: z.string(),
  confirmationText: z.literal("LEAVE", {
    error: "Please type LEAVE to confirm.",
  }),
});

export type DeleteOrganizationFormData = z.infer<
  typeof DeleteOrganizationFormSchema
>;

export const RemoveMemberFormSchema = z.object({
  memberId: z.string().uuid(),
  organizationId: z.string().uuid(),
});

export type RemoveMemberFormData = z.infer<typeof RemoveMemberFormSchema>;
