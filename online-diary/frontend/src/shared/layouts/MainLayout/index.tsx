import { ReactNode } from "react";
import styles from "./styles.module.scss";

interface MainLayoutProps {
  children: ReactNode;
}

export const MainLayout = ({ children }: MainLayoutProps) => {
  return (
    <div className={styles.layout}>
      <header className={styles.header}>
        <h1 className={styles.title}>Online Diary</h1>
        <p className={styles.subtitle}>Ваш центр управления дневником</p>
      </header>
      <main className={styles.content}>{children}</main>
    </div>
  );
};
