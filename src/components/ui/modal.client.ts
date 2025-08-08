"use client";

export function openModal(id: string) {
  (document.getElementById(id) as HTMLDialogElement).showModal();
}

export function closeModal(id: string) {
  (document.getElementById(id) as HTMLDialogElement).close();
}
