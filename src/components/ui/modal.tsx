import { cn } from "@/lib/utils";

export { closeModal, openModal } from "./modal.client";

export type ModalProps = React.ComponentProps<"dialog"> & {
  id: string;
  position?: "middle" | "top" | "bottom" | "start" | "end";
};

export function Modal({
  className,
  position = "middle",
  ...props
}: ModalProps) {
  return (
    <dialog
      {...props}
      className={cn(
        "modal",
        {
          "modal-middle": position === "middle",
          "modal-top": position === "top",
          "modal-bottom": position === "bottom",
          "modal-start": position === "start",
          "modal-end": position === "end",
        },
        className
      )}
    />
  );
}

export type ModalContentProps = React.ComponentProps<"div"> & {
  closeButton?: "left" | "right";
};

export function ModalContent({
  children,
  className,
  closeButton,
  ...props
}: ModalContentProps) {
  return (
    <div className={cn("modal-box", className)} {...props}>
      {!!closeButton && (
        <form method="dialog">
          <button
            className={cn("btn btn-sm btn-circle btn-ghost absolute", {
              "right-2 top-2": closeButton === "right",
              "left-2 top-2": closeButton === "left",
            })}
            type="submit"
            aria-label="Close"
          >
            ✕
          </button>
        </form>
      )}
      {children}
    </div>
  );
}

export function ModalActions({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return <div className={cn("modal-action", className)} {...props} />;
}

export function CloseModalForm(
  props: Omit<React.ComponentProps<"form">, "method" | "action">
) {
  return <form {...props} method="dialog" />;
}
