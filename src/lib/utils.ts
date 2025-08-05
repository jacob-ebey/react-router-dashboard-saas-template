import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function assert(
  condition: any,
  message?: string | (() => string)
): asserts condition {
  if (condition) {
    return;
  }

  throw new Error(typeof message === "function" ? message() : message);
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function validateRedirect(
  redirectTo: string | null | undefined,
  defaultRedirect: string
) {
  if (!redirectTo || !redirectTo.startsWith("/") || redirectTo[1] === "/") {
    return defaultRedirect;
  }

  return redirectTo;
}
