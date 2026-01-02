"use client";

import { ReactNode } from "react";
import styles from "./styles.module.scss";

type DashboardCardProps = {
  title?: string;
  /** то, что справа от заголовка (фильтр, переключатель периода и т.д.) */
  rightSlot?: ReactNode;
  children: ReactNode;
  className?: string;
};

export const DashboardCard = ({
  title,
  rightSlot,
  children,
  className,
}: DashboardCardProps) => {
  return (
    <section
      className={
        className ? `${styles.root} ${className}` : styles.root
      }
    >
      {(title || rightSlot) && (
        <div className={styles.header}>
          {title && <h2 className={styles.title}>{title}</h2>}
          {rightSlot}
        </div>
      )}

      {children}
    </section>
  );
};
