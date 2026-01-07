"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import DashboardIcon from '@mui/icons-material/Dashboard';
import FactCheckRoundedIcon from '@mui/icons-material/FactCheckRounded';
import CalendarMonthRoundedIcon from '@mui/icons-material/CalendarMonthRounded';
import { useUser } from "@entities/user"; 
import { IconRailArrowRight, IconRailArrowLeft } from "@shared/assets";
import styles from "./styles.module.scss";

export function AppSidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const { user, isLoading } = useUser();

  if (isLoading) return null; 

  const isTeacher = user?.role === "TEACHER" || user?.role === "ADMIN";

  const navItems = isTeacher 
    ? [
        { href: "/manage-homework", icon: <FactCheckRoundedIcon />, label: "Homework" },
        { href: "/schedule", icon: <CalendarMonthRoundedIcon />, label: "Schedule" }
      ]
    : [
        { href: "/dashboard", icon: <DashboardIcon />, label: "Main" },
        { href: "/homework", icon: <FactCheckRoundedIcon />, label: "Homework" },
        { href: "/schedule", icon: <CalendarMonthRoundedIcon />, label: "Schedule" }
      ];

  return (
    <>
      <aside className={styles.rail}>
        <nav className={styles.railNav}>
          {navItems.map((item) => (
            <Link 
              key={item.href} 
              href={item.href} 
              className={`${styles.railItem} ${pathname.startsWith(item.href) ? styles.railItemActive : ""}`}
            >
              <span className={styles.railIcon}>{item.icon}</span>
            </Link>
          ))}
        </nav>
        <button type="button" className={styles.railToggle} onClick={() => setIsOpen(true)}>
          <IconRailArrowRight />
        </button>
      </aside>

      <div className={`${styles.backdrop} ${isOpen ? styles.backdropOpen : ""}`} onClick={() => setIsOpen(false)} />
      <div className={`${styles.drawer} ${isOpen ? styles.drawerOpen : ""}`}>
        <nav className={styles.drawerNav}>
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} className={styles.drawerItem} onClick={() => setIsOpen(false)}>
              <span className={styles.drawerItemIcon}>{item.icon}</span>
              <span className={styles.drawerItemLabel}>{item.label}</span>
            </Link>
          ))}
        </nav>
        <button type="button" className={styles.drawerToggle} onClick={() => setIsOpen(false)}>
          <IconRailArrowLeft />
        </button>
      </div>
    </>
  );
}