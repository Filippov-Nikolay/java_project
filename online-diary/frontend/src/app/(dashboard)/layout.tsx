import type { ReactNode } from "react";

import ModalRoot from "@features/modals/ui/ModalRoot";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div>
      {children}
      <ModalRoot />
    </div>
  );
}
