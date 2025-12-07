import type { ReactNode } from "react";
import ThemeToggle from "@features/theme/ui/ThemeToggle";
import styles from "./styles.module.scss";

interface AuthHeaderProps {
  logoShort?: string;
  logoText?: string;
  /** Дополнительный контент справа (например, выбор языка) */
  rightSlot?: ReactNode;
}

export const AuthHeader = ({
  logoShort = "JB",
  logoText = "JByte",
  rightSlot,
}: AuthHeaderProps) => {
  return (
    <header className={styles.header}>
      <div className={styles.brand}>
        <span className={styles.logoMark}>{logoShort}</span>
        <span className={styles.logoText}>{logoText}</span>
      </div>

      <div className={styles.headerRight}>
        {rightSlot}
        <ThemeToggle />
      </div>
    </header>
  );
};
