import type { ReactNode } from "react";
import { AppHeader } from "@shared/layouts/AppHeader";
import { AppSidebar } from "@shared/layouts/AppSidebar";

import styles from "./styles.module.scss";

export default function MainLayout({ children }: { children: ReactNode }) {
  return (
    <div className={styles.wrapper}>
      <AppHeader />

      <div className={styles.body}>
        <AppSidebar />
        <main className={styles.content}>{children}</main>
      </div>
    </div>
  );
}
