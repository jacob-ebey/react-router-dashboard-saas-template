import { z } from "zod/v4";

export const InviteUserFormSchema = z.object({
  organizationId: z.string().uuid(),
  email: z
    .string({ error: "Email is required." })
    .check(z.email({ error: "Please enter a valid email address." })),
  role: z.enum(["admin", "manager", "member", "guest"], {
    error: "Please select a role.",
  }),
});

export const AcceptInvitationFormSchema = z.object({
  invitationId: z.string().uuid(),
});

export const DeleteInvitationFormSchema = z.object({
  invitationId: z.string().uuid(),
});
