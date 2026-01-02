"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./layout.module.scss";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const menuItems = [
    { name: "Статистика", href: "/admin" },
    { name: "Користувачі", href: "/admin/users" },
    { name: "Предмети", href: "/admin/subjects" },
    { name: "Розклад", href: "/admin/schedule" },
  ];

  return (
    <div className={styles.adminContainer}>
      <aside className={styles.sidebar}>
        <div className={styles.logo}>JByte Admin</div>
        <nav className={styles.nav}>
          {menuItems.map((item) => (
            <Link 
              key={item.href} 
              href={item.href} 
              className={`${styles.navLink} ${pathname === item.href ? styles.active : ""}`}
            >
              {item.name}
            </Link>
          ))}
        </nav>
        <div className={styles.footer}>
          <Link href="/dashboard" className={styles.backLink}>← На сайт</Link>
        </div>
      </aside>
      
      <main className={styles.content}>
        {children}
      </main>
    </div>
  );
}