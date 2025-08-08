import { Outlet } from "react-router";

import { Document } from "./client";
import "./styles.css";

export { ErrorBoundary } from "./client";

export function Layout({ children }: { children: React.ReactNode }) {
  // This is necessary for the bundler to inject the needed CSS assets.
  return (
    <>
      <Document>{children}</Document>
    </>
  );
}

export default Outlet;
