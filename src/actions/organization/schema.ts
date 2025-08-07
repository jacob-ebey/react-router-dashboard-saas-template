import { z } from "zod";

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
