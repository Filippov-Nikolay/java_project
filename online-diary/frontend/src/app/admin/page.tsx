"use client";

import { useState, useEffect } from "react";
import { FiUsers, FiBook, FiGrid, FiBriefcase, FiClock } from "react-icons/fi";
import styles from "./page.module.scss";

interface RecentUser {
  id: number;
  firstName: string;
  lastName: string;
  role: string;
  login: string;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState({ users: 0, teachers: 0, groups: 0, subjects: 0 });
  const [recentUsers, setRecentUsers] = useState<RecentUser[]>([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const headers = { Authorization: `Bearer ${token}`, "Accept": "application/json" };

    const safeFetch = async (url: string) => {
      try {
        const res = await fetch(url, { headers });
        return res.ok ? await res.json() : [];
      } catch (err) { return []; }
    };

    Promise.all([
      safeFetch("http://localhost:8080/api/auth/users/all"),
      safeFetch("http://localhost:8080/api/auth/users/teachers"),
      safeFetch("http://localhost:8080/api/groups"),
      safeFetch("http://localhost:8080/api/subjects"),
    ]).then(([users, teachers, groups, subjects]) => {
      setStats({
        users: users?.length || 0,
        teachers: teachers?.length || 0,
        groups: groups?.length || 0,
        subjects: subjects?.length || 0,
      });

      if (Array.isArray(users)) {
        setRecentUsers([...users].sort((a, b) => b.id - a.id).slice(0, 5));
      }
    });
  }, []);

  const statCards = [
    { label: "Всього користувачів", value: stats.users, icon: <FiUsers />, color: "#3b82f6" },
    { label: "Викладачі", value: stats.teachers, icon: <FiBriefcase />, color: "#10b981" },
    { label: "Групи", value: stats.groups, icon: <FiGrid />, color: "#f59e0b" },
    { label: "Предмети", value: stats.subjects, icon: <FiBook />, color: "#ef4444" },
  ];

  return (
    <div className={styles.dashboard}>
      <header className={styles.header}>
        <h1>Панель керування</h1>
        <p>Огляд стану вашої системи онлайн-щоденника</p>
      </header>

      <div className={styles.statsGrid}>
        {statCards.map((card, index) => (
          <div key={index} className={styles.statCard}>
            <div className={styles.icon} style={{ color: card.color, backgroundColor: `${card.color}15` }}>
              {card.icon}
            </div>
            <div className={styles.info}>
              <span className={styles.value}>{card.value}</span>
              <span className={styles.label}>{card.label}</span>
            </div>
          </div>
        ))}
      </div>
      <div className={styles.recentSection}>
        <div className={styles.sectionHeader}>
          <FiClock /> <h2>Останні реєстрації</h2>
        </div>
        <div className={styles.tableCard}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Користувач</th>
                <th>Логін</th>
                <th>Роль</th>
              </tr>
            </thead>
            <tbody>
              {recentUsers.map(user => (
                <tr key={user.id}>
                  <td className={styles.name}>{user.lastName} {user.firstName}</td>
                  <td className={styles.login}>@{user.login}</td>
                  <td>
                    <span className={`${styles.badge} ${styles[user.role.toLowerCase()]}`}>
                      {user.role}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}