"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FiPlus, FiTrash2, FiEdit2 } from "react-icons/fi";
import Button from "@shared/ui/Button";
import styles from "./page.module.scss";

interface User {
  group: any;
  id: number;
  login: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  groupName?: string;
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const fetchUsers = async () => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch("http://localhost:8080/api/auth/users/all", {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setUsers(data);
      }
    } catch (err) {
      console.error("Помилка завантаження користувачів:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDelete = async (id: number) => {
    if (!confirm("Ви впевнені, що хочете видалити цього користувача?")) return;
    
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`http://localhost:8080/api/auth/users/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) fetchUsers();
    } catch (err) {
      alert("Помилка при видаленні");
    }
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div>
          <h1>Користувачі</h1>
          <p>Керування обліковими записами студентів та викладачів</p>
        </div>
        <Link href="/admin/users/create">
          <Button label="Новий користувач" />
        </Link>
      </header>

      <div className={styles.tableCard}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Прізвище та ім'я</th>
              <th>Email / Логін</th>
              <th>Роль</th>
              <th>Група</th>
              <th style={{ textAlign: "right" }}>Дії</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td className={styles.userName}>
                  {user.lastName} {user.firstName}
                </td>
                <td>
                  <div className={styles.email}>{user.email}</div>
                  <div className={styles.login}>{user.login}</div>
                </td>
                <td>
                  <span className={`${styles.badge} ${styles[user.role.toLowerCase()]}`}>
                    {user.role}
                  </span>
                </td>
                <td>{user.groupName || "—"}</td>
                <td className={styles.actions}>
                  <button 
                    className={styles.editBtn} 
                    onClick={() => router.push(`/admin/users/edit/${user.id}`)}
                  >
                    <FiEdit2 />
                  </button>
                  <button className={styles.actionBtn} onClick={() => handleDelete(user.id)}>
                    <FiTrash2 />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {loading && <div className={styles.loader}>Завантаження...</div>}
        {!loading && users.length === 0 && <div className={styles.empty}>Користувачів не знайдено</div>}
      </div>
    </div>
  );
}