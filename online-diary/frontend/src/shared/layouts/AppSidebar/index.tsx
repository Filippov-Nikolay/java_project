"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, ReactNode } from "react";
import DashboardIcon from '@mui/icons-material/Dashboard';
import FactCheckRoundedIcon from '@mui/icons-material/FactCheckRounded';
import CalendarMonthRoundedIcon from '@mui/icons-material/CalendarMonthRounded';

import styles from "./styles.module.scss";

type NavItem = {
  href: string;
  icon: ReactNode;
  label: string;
};

const NAV_ITEMS: NavItem[] = [
  {href: "/dashboard", icon: <DashboardIcon/>, label: "Main"},
  {href: "/groups", icon: <FactCheckRoundedIcon/>, label: "homework"},
  {href: "/schedule", icon: <CalendarMonthRoundedIcon/>, label: "schedule"}
];

export function AppSidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const handleOpen = () => setIsOpen(true);
  const handleClose = () => setIsOpen(false);

  return (
    <>
      {/* Левый узкий rail — всегда виден */}
      <aside className={styles.rail} aria-label="Навігація">
        <nav className={styles.railNav}>
          {NAV_ITEMS.map((item) => {
            const active = pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`${styles.railItem} ${
                  active ? styles.railItemActive : ""
                }`}
              >
                <span className={styles.railIcon}>{item.icon}</span>
              </Link>
            );
          })}
        </nav>

        {/* кнопка открытия панели */}
        <button
          type="button"
          className={styles.railToggle}
          aria-label="Відкрити меню"
          onClick={handleOpen}
        >
          ⮞
        </button>
      </aside>

      {/* затемнение фона */}
      <div
        className={`${styles.backdrop} ${
          isOpen ? styles.backdropOpen : ""
        }`}
        onClick={handleClose}
      />

      {/* большая выдвижная панель */}
      <div
        className={`${styles.drawer} ${
          isOpen ? styles.drawerOpen : ""
        }`}
      >
        <nav className={styles.drawerNav}>
          {NAV_ITEMS.map((item) => {
            const active = pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`${styles.drawerItem} ${
                  active ? styles.drawerItemActive : ""
                }`}
                onClick={handleClose}
              >
                <span className={styles.drawerItemIcon}>{item.icon}</span>
                <span className={styles.drawerItemLabel}>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Кнопка закрытия снизу, стрелка в другую сторону */}
        <button
          type="button"
          className={styles.drawerToggle}
          aria-label="Закрити меню"
          onClick={handleClose}
        >
          ⮜
        </button>
      </div>
    </>
  );
}
