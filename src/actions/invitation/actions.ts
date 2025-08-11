"use server";

import type { SubmissionResult } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod/v4";
import { eq } from "drizzle-orm";

import { getDb } from "@/db";
import { requireUser } from "@/lib/auth";
import { organizationInvitations } from "@/db/schema";
import {
  queryUserOrgRole,
  queryOrganizationById,
} from "@/db/queries/organization";
import {
  queryPendingInvitationByEmailAndOrg,
  queryInvitationById,
} from "@/db/queries/invitation";
import {
  createInvitation,
  acceptInvitation as acceptInvitationMutation,
  deleteInvitation as deleteInvitationMutation,
} from "@/db/mutations/invitation";
import {
  addUserToOrganization,
  removeUserFromOrganization,
} from "@/db/mutations/organization";
import { queryUserByEmail, queryUserById } from "@/db/queries/user";

import {
  InviteUserFormSchema,
  AcceptInvitationFormSchema,
  DeleteInvitationFormSchema,
} from "./schema";

export async function inviteUserAction(
  _prevState: SubmissionResult | undefined,
  formData: FormData
): Promise<SubmissionResult> {
  const user = requireUser();
  const db = getDb();

  const submission = parseWithZod(formData, {
    schema: InviteUserFormSchema,
  });

  if (submission.status !== "success") {
    return submission.reply();
  }

  const { organizationId, email, role } = submission.value;

  try {
    // Check if user has permission to invite
    const userRole = await queryUserOrgRole(db, user.id, organizationId);
    if (
      userRole !== "owner" &&
      userRole !== "admin" &&
      userRole !== "manager"
    ) {
      return submission.reply({
        formErrors: [
          "You don't have permission to invite users to this organization",
        ],
      });
    }

    // Check if invitation already exists
    const existingInvitation = await queryPendingInvitationByEmailAndOrg(
      db,
      email,
      organizationId
    );
    if (existingInvitation) {
      return submission.reply({
        fieldErrors: {
          email: ["An invitation has already been sent to this email address"],
        },
      });
    }

    // Check if user is already a member
    const existingUser = await queryUserByEmail(db, email);
    if (existingUser) {
      const existingRole = await queryUserOrgRole(
        db,
        existingUser.id,
        organizationId
      );
      if (existingRole) {
        return submission.reply({
          fieldErrors: {
            email: ["This user is already a member of the organization"],
          },
        });
      }
    }

    // Create invitation with 7 day expiry
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    await createInvitation(db, {
      organizationId,
      invitedByUserId: user.id,
      email,
      role,
      status: "pending",
      expiresAt,
    });

    // TODO: Send invitation email

    return submission.reply({ resetForm: true });
  } catch (error) {
    console.error("Error inviting user:", error);
    return submission.reply({
      formErrors: ["Failed to send invitation. Please try again."],
    });
  }
}

export async function acceptInvitationAction(
  _prevState: SubmissionResult | undefined,
  formData: FormData
): Promise<SubmissionResult> {
  const userId = requireUser();
  const db = getDb();

  const submission = parseWithZod(formData, {
    schema: AcceptInvitationFormSchema,
  });

  if (submission.status !== "success") {
    return submission.reply();
  }

  const { invitationId } = submission.value;

  try {
    // Get user details
    const user = await queryUserById(db, userId.id);
    if (!user) {
      return submission.reply({
        formErrors: ["User not found"],
      });
    }

    // Get invitation details
    const invitation = await queryInvitationById(db, invitationId);
    if (!invitation) {
      return submission.reply({
        formErrors: ["Invitation not found"],
      });
    }

    // Check if invitation is valid
    if (invitation.status !== "pending") {
      return submission.reply({
        formErrors: ["This invitation has already been used or revoked"],
      });
    }

    if (invitation.expiresAt < new Date()) {
      return submission.reply({
        formErrors: ["This invitation has expired"],
      });
    }

    // Check if the invitation is for the current user
    if (invitation.email !== user.email) {
      return submission.reply({
        formErrors: ["This invitation is for a different email address"],
      });
    }

    // Accept the invitation
    await acceptInvitationMutation(db, invitationId);

    // Add user to organization
    await addUserToOrganization(db, {
      organizationId: invitation.organizationId,
      userId: user.id,
      role: invitation.role || "member",
      status: "active",
    });

    // Get organization for redirect
    const organization = await queryOrganizationById(
      db,
      invitation.organizationId
    );
    if (!organization) {
      return submission.reply({
        formErrors: ["Organization not found"],
      });
    }

    return submission.reply({ resetForm: true });
  } catch (error) {
    if (error instanceof Response) {
      throw error;
    }
    console.error("Error accepting invitation:", error);
    return submission.reply({
      formErrors: ["Failed to accept invitation. Please try again."],
    });
  }
}

export async function deleteInvitationAndRemoveUserAction(
  _prevState: SubmissionResult | undefined,
  formData: FormData
): Promise<SubmissionResult> {
  const user = requireUser();
  const db = getDb();

  const submission = parseWithZod(formData, {
    schema: DeleteInvitationFormSchema,
  });

  if (submission.status !== "success") {
    return submission.reply();
  }

  const { invitationId } = submission.value;

  try {
    // Get invitation details
    const invitation = await queryInvitationById(db, invitationId);
    if (!invitation) {
      return submission.reply({
        formErrors: ["Invitation not found"],
      });
    }

    // Check if user has permission to delete
    const userRole = await queryUserOrgRole(
      db,
      user.id,
      invitation.organizationId
    );
    if (
      userRole !== "owner" &&
      userRole !== "admin" &&
      userRole !== "manager"
    ) {
      return submission.reply({
        formErrors: ["You don't have permission to delete invitations"],
      });
    }

    // If invitation was accepted, remove the user from the organization
    if (invitation.status === "accepted") {
      const invitedUser = await queryUserByEmail(db, invitation.email);
      if (invitedUser) {
        await removeUserFromOrganization(
          db,
          invitation.organizationId,
          invitedUser.id
        );
      }
    }

    // Delete the invitation
    await deleteInvitationMutation(db, invitationId);

    return submission.reply();
  } catch (error) {
    console.error("Error deleting invitation:", error);
    return submission.reply({
      formErrors: ["Failed to delete invitation. Please try again."],
    });
  }
}

export async function declineInvitationAction(
  _prevState: SubmissionResult | undefined,
  formData: FormData
): Promise<SubmissionResult> {
  const userId = requireUser();
  const db = getDb();

  const submission = parseWithZod(formData, {
    schema: AcceptInvitationFormSchema,
  });

  if (submission.status !== "success") {
    return submission.reply();
  }

  try {
    // Get user details
    const user = await queryUserById(db, userId.id);
    if (!user) {
      return submission.reply({
        formErrors: ["User not found"],
      });
    }

    // Get the invitation
    const invitation = await queryInvitationById(
      db,
      submission.value.invitationId
    );
    if (!invitation) {
      return submission.reply({
        fieldErrors: {
          invitationId: ["Invitation not found"],
        },
      });
    }

    // Check if it's for the current user
    if (invitation.email !== user.email) {
      return submission.reply({
        formErrors: ["This invitation is not for you"],
      });
    }

    // Check if already processed
    if (invitation.status !== "pending") {
      return submission.reply({
        formErrors: ["This invitation has already been processed"],
      });
    }

    // Update invitation status to revoked
    await db
      .update(organizationInvitations)
      .set({
        status: "revoked",
      })
      .where(eq(organizationInvitations.id, invitation.id));

    return submission.reply({ resetForm: true });
  } catch (error) {
    console.error("Error declining invitation:", error);
    return submission.reply({
      formErrors: ["Failed to decline invitation"],
    });
  }
}
