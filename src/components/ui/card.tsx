import { cn } from "@/lib/utils";

export type CardProps = React.ComponentProps<"div">;

export function Card({ children, className, ...props }: CardProps) {
  return (
    <div
      className={cn("card card-border shadow-sm bg-base-100", className)}
      {...props}
    >
      {children}
    </div>
  );
}
