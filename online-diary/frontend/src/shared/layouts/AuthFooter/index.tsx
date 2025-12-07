import type { ReactNode } from "react";
import styles from "./styles.module.scss";

interface AuthFooterProps {
  /** Основной текст футера, по умолчанию с годом и брендом */
  children?: ReactNode;
  brandName?: string;
}

export const AuthFooter = ({
  children,
  brandName = "JByte",
}: AuthFooterProps) => {
  const year = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <span className={styles.muted}>
        {children ?? `© ${year} ${brandName}`}
      </span>
    </footer>
  );
};
