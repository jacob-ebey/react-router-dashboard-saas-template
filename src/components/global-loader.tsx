"use client";

import { useNavigation } from "react-router";

export function GloablLoader() {
  const navigation = useNavigation();

  if (navigation.state === "idle") {
    return null;
  }

  return (
    <span
      className="loading loading-dots loading-md"
      aria-label="Page is loading."
    />
  );
}
