"use client";

import { isRouteErrorResponse, useRouteError } from "react-router";

function focusFirstInputAfterAnimation(modal: HTMLDialogElement) {
  setTimeout(() => {
    const firstInput = modal.querySelector("input");
    if (firstInput) {
      firstInput.focus();
    }
  }, 300);
}

export function openLoginModal(event: React.MouseEvent) {
  event.preventDefault();
  login_modal.showModal();
  focusFirstInputAfterAnimation(login_modal);
}

export function openSignupModal(event: React.MouseEvent) {
  event.preventDefault();
  signup_modal.showModal();
  focusFirstInputAfterAnimation(signup_modal);
}

export function ErrorBoundary() {
  const error = useRouteError();
  let status = 500;
  let message = "An unexpected error occurred.";

  if (isRouteErrorResponse(error)) {
    status = error.status;
    message = status === 404 ? "Page not found." : error.statusText || message;
  }

  return (
    <main className="mx-auto max-w-screen-xl px-4 py-8 lg:py-12">
      <article className="prose mx-auto">
        <h1>{status}</h1>
        <p>{message}</p>
      </article>
    </main>
  );
}
