"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useGetTeacherTasks } from "@entities/homework/model/useGetTeacherTasks";
import { deleteHomeworkRequest } from "@entities/homework/api/homeworkApi";
import { CreateHomeworkModal } from "@features/manage-homework/create-modal";
import Button from "@shared/ui/Button";
import styles from "./styles.module.scss";
import clsx from "clsx";

export default function ManageHomeworkPage() {
  const { tasks, isLoading, refetch } = useGetTeacherTasks();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();

  const pendingCheck = tasks.reduce((acc, task) => acc + task.stats.submitted, 0);

  const handleDelete = async (id: number | string) => {
    if (!window.confirm("Ви впевнені, що хочете видалити це завдання?")) return;

    try {
      const token = localStorage.getItem("token");
      await deleteHomeworkRequest(token, id);
      await refetch();
    } catch (err) {
      alert("Помилка при видаленні завдання");
    }
  };

  const handleViewSubmissions = (id: number | string) => {

    router.push(`/manage-homework/${id}/submissions`);
  };

  if (isLoading) return null;

  return (
    <main className={styles.container}>
      <header className={styles.header}>
        <div>
          <h1>Завдання</h1>
        </div>
        <Button variant="primary" onClick={() => setIsModalOpen(true)}>
          + Створити нове завдання
        </Button>
      </header>

      <section className={styles.stats}>
        <div className={styles.statCard}>
          <span>Активні завдання</span>
          <strong>{tasks.filter(t => !t.isOverdue).length}</strong>
        </div>
        <div className={styles.statCard}>
          <span>Всього відповідей учнів</span>
          <strong>{pendingCheck}</strong>
        </div>
      </section>

      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Предмет / Назва</th>
              <th>Група</th>
              <th>Здано робіт</th>
              <th>Задано</th>
              <th>Дедлайн</th>
              <th>Статус</th>
              <th>Дії</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((task) => (
              <tr key={task.id}>
                <td>
                  <div className={styles.taskTitleCell}>
                    <span className={styles.subjectBadge}>{task.subjectName}</span>
                    <strong>{task.title}</strong>
                  </div>
                </td>
                <td>{task.groupName}</td>
                <td>
                  <div className={styles.progressWrapper}>
                    <div className={styles.progressText}>
                      {task.stats.submitted} / {task.stats.total}
                    </div>
                    <div className={styles.progressBar}>
                      <div 
                        className={styles.progressFill} 
                        style={{ width: `${(task.stats.submitted / task.stats.total) * 100}%` }} 
                      />
                    </div>
                  </div>
                </td>
                <td className={styles.date}>{task.createdAt}</td>
                <td className={clsx(styles.date, task.isOverdue && styles.overdue)}>
                  {task.deadline}
                </td>
                <td>
                  <span className={task.isOverdue ? styles.statusClosed : styles.statusActive}>
                    {task.isOverdue ? "Завершено" : "Активне"}
                  </span>
                </td>
                <td>
                  <div className={styles.actions}>
                    <button 
                      className={styles.checkBtn} 
                      title="Переглянути список здач"
                      onClick={() => handleViewSubmissions(task.id)}
                    >
                      📊
                    </button>
                    <button className={styles.editBtn} title="Редагувати">✏️</button>
                    <button 
                      className={styles.deleteBtn} 
                      title="Видалити"
                      onClick={() => handleDelete(task.id)}
                    >
                      🗑️
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <CreateHomeworkModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        onSuccess={refetch}
      />
    </main>
  );
}