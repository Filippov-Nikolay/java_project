import type { ReactNode } from "react";
import ThemeToggle from "@features/theme/ui/ThemeToggle";
import styles from "./styles.module.scss";
import Link from "next/link";
import LogoMark from "@shared/ui/Logo";
interface AuthHeaderProps {
  logoText?: string;
  /** Дополнительный контент справа (например, выбор языка) */
  rightSlot?: ReactNode;
}

export const AuthHeader = ({
  logoText = "JByte",
  rightSlot,
}: AuthHeaderProps) => {
  return (
    <header className={styles.header}>
      <div className={styles.brand}>
        <Link href="/auth/login"><LogoMark/></Link>
        <span className={styles.logoText}>{logoText}</span>
      </div>

      <div className={styles.headerRight}>
        {rightSlot}
        <ThemeToggle />
      </div>
    </header>
  );
};
