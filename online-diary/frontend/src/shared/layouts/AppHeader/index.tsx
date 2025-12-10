// src/shared/layouts/AppHeader/index.tsx
"use client";

import ThemeToggle from "@features/theme/ui/ThemeToggle";
import LogoMark from "@shared/ui/Logo";
import { NotificationsDropdown } from "@features/notifications/ui/NotificationsDropdown";

import Link from "next/link";
import { ReactNode } from "react";
import styles from "./styles.module.scss";

interface AuthHeaderProps {
  logoText?: string;
  rightSlot?: ReactNode;
}

export const AppHeader = ({
  logoText = "JByte",
  rightSlot,
}: AuthHeaderProps) => {
  return (
    <header className={styles.header}>
      <div className={styles.left}>
        <Link href="/">
          <LogoMark />
        </Link>
        <span className={styles.logoText}>{logoText}</span>
      </div>

      <div className={styles.right}>
        {rightSlot}

        <div className={styles.themeToggleWrapper}>
          <ThemeToggle />
        </div>

        <NotificationsDropdown />

        <button
          type="button"
          className={styles.avatarButton}
          aria-label="Профіль"
        >
          <span className={styles.avatarInitials}>JB</span>
        </button>
      </div>
    </header>
  );
};
