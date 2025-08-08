import { Link } from "react-router";

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
      <div className="max-w-md w-full text-center">
        <div className="mb-8">
          {/* Error icon using daisyUI */}
          <svg
            className="mx-auto h-16 w-16 text-error"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>

        <h1 className="text-4xl font-bold text-base-content mb-4">{title}</h1>

        <p className="text-base-content/70 mb-8">{message}</p>

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
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="stroke-current shrink-0 h-6 w-6"
        fill="none"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
      <div>
        <h3 className="font-bold">{title}</h3>
        <div className="text-xs">{message}</div>
      </div>
    </div>
  );
}
