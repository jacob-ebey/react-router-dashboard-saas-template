"use client";

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
