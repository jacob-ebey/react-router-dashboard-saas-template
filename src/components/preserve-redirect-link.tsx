"use client";

import { useMemo } from "react";
import { Link, useSearchParams, useHref } from "react-router";

export function PreserveRedirectLink({
  to,
  relative,
  ...props
}: React.ComponentProps<typeof Link>) {
  const [searchParams] = useSearchParams();
  const href = useHref(to, { relative });

  const hrefWithRedirect = useMemo(() => {
    const redirectTo = searchParams.get("redirectTo");
    const hrefWithRedirect = new URL(href, "http://dummy.com");
    if (redirectTo) {
      hrefWithRedirect.searchParams.set("redirectTo", redirectTo);
    }
    return hrefWithRedirect;
  }, [href, searchParams]);

  return (
    <Link to={hrefWithRedirect.pathname + hrefWithRedirect.search} {...props} />
  );
}
