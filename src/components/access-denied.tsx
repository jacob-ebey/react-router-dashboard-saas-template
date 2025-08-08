import { Link } from "react-router";

import { Icon } from "./icon";

interface AccessDeniedProps {
  title?: string;
  message?: string;
  returnTo?: string;
  returnLabel?: string;
}

export function AccessDenied({
  title = "Access Denied",
  message = "You don't have permission to access this resource.",
  returnTo = "/app",
  returnLabel = "Go to Dashboard",
}: AccessDeniedProps) {
  return (
    <main className="h-full grid items-center justify-center px-4 py-8">
      <div className="max-w-md w-full text-center space-y-8">
        <Icon
          name="exclamation-triangle"
          className="h-16 w-16 text-error mx-auto"
        />

        <h1 className="text-4xl font-bold text-base-content mb-4">{title}</h1>

        <p className="text-neutral mb-8">{message}</p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to={returnTo} className="btn btn-primary">
            {returnLabel}
          </Link>
        </div>
      </div>
    </main>
  );
}

// Alternative layout for when used within an existing page structure
export function AccessDeniedSection({
  title = "Access Denied",
  message = "You don't have permission to view this section.",
  className = "",
}: AccessDeniedProps & { className?: string }) {
  return (
    <div className={`alert alert-error ${className}`}>
      <Icon name="exclamation-triangle" className="h-6 w-6 shrink-0" />

      <div>
        <h3 className="font-bold">{title}</h3>
        <div className="text-xs">{message}</div>
      </div>
    </div>
  );
}
