"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useUser } from "@entities/user/model/useUser"; 
import { useAuth } from "@features/auth/model/useAuth"; 
import { IoLogOutOutline } from "react-icons/io5"; 
import styles from "./layout.module.scss";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user } = useUser();
  const { logout } = useAuth(); 

  const isAdmin = user?.role === "ADMIN";

  const menuItems = [
    { name: "Статистика", href: "/admin" },
    { name: "Користувачі", href: "/admin/users" },
    { name: "Предмети", href: "/admin/subjects" },
    { name: "Розклад", href: "/admin/schedule" },
  ];

  return (
    <div className={styles.adminContainer}>
      {isAdmin && (
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

            <button onClick={logout} className={styles.logoutBtn}>
              <IoLogOutOutline /> <span>Вийти</span>
            </button>
          </div>
        </aside>
      )}

      <main className={isAdmin ? styles.content : styles.fullWidthContent}>
        {children}
      </main>
    </div>
  );
}