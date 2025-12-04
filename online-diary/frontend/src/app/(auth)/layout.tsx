import type { ReactNode } from "react";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return <section>{children}</section>;
}
