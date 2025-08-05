"use client";

import { useRef } from "react";

import { ScrollRestoration } from "@/components/scroll-restoration";

export function openSidebar() {
  sidebar.showModal();
}

export function closeSidebar() {
  sidebar.close();
}

export function ScrollRestorationDiv({
  ref: propsRef,
  ...props
}: React.ComponentProps<"div">) {
  const localRef = useRef<HTMLDivElement>(null);
  const ref = propsRef ?? localRef;

  if (!props.id) {
    throw new Error("id is required");
  }

  return (
    <>
      <div {...props} ref={ref} />
      <ScrollRestoration
        getKey={({ key }) => `${props.id}-${key}`}
        scrollRef={ref}
      />
    </>
  );
}
