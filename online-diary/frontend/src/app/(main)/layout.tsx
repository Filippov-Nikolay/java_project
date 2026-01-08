import type { ReactNode } from "react";
import { AppHeader } from "@shared/layouts/AppHeader";
import { AppSidebar } from "@shared/layouts/AppSidebar";
import { AppAuthWrapper } from "@app/(main)/AppAuthWrapper/page"; 
import { SidebarProvider } from "@shared/lib/context/SidebarContext";
import styles from "./styles.module.scss";

export default function MainLayout({ children }: { children: ReactNode }) {
  return (
    <SidebarProvider>
      <AppAuthWrapper>
        <div className={styles.wrapper}>
          <AppHeader />
          <div className={styles.body}>
            <AppSidebar />
            <main className={styles.content}>{children}</main>
          </div>
        </div>
      </AppAuthWrapper>
    </SidebarProvider>
  );
}