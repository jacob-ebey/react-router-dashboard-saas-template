"use client";

import { useActionState } from "react";

import { logout } from "@/actions/auth/actions";

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
