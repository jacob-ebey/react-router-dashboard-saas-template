import { cn } from "@/lib/utils";

import icons from "./icons.html?raw";

type IconName =
  | "bars-3-bottom-left"
  | "bell"
  | "bell-alert"
  | "check-circle"
  | "chevron-left"
  | "chevron-right"
  | "cog-6-tooth"
  | "envelope-open"
  | "exclamation-triangle"
  | "information-circle"
  | "plus";

export function Icons() {
  return <svg className="hidden" dangerouslySetInnerHTML={{ __html: icons }} />;
}

export function Icon({
  className,
  name,
  ...props
}: Omit<React.ComponentProps<"svg">, "name"> & { name: IconName }) {
  return (
    <svg className={cn("size-6", className)} {...props}>
      <use href={`#${name}`} />
    </svg>
  );
}
