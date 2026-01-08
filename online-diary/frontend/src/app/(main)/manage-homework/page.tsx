"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useGetTeacherTasks } from "@entities/homework/model/useGetTeacherTasks";
import { deleteHomeworkRequest } from "@entities/homework/api/homeworkApi";
import { CreateHomeworkModal } from "@features/manage-homework/create-modal";
import Button from "@shared/ui/Button";
import styles from "./styles.module.scss";
import clsx from "clsx";

// Реакт іконки
import { 
  IoAdd, 
  IoStatsChartOutline, 
  IoCreateOutline, 
  IoTrashOutline, 
  IoPeopleOutline, 
  IoBookOutline,
  IoTimeOutline,
  IoCheckmarkDoneOutline,
  IoImageOutline
} from "react-icons/io5";

export default function ManageHomeworkPage() {
  const { tasks, isLoading, refetch } = useGetTeacherTasks();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();

  const totalSubmissions = tasks.reduce((acc, task) => acc + task.stats.submitted, 0);

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



  return (
    <main className={styles.container}>
      <header className={styles.header}>
        <div className={styles.headerText}>
          <h1>Керування завданнями</h1>
          <p className={styles.subtitle}>Створюйте та перевіряйте роботи ваших студентів</p>
        </div>
        <Button variant="primary" onClick={() => setIsModalOpen(true)} className={styles.createBtn}>
          <IoAdd size={20} />
          <span>Створити завдання</span>
        </Button>
      </header>

      {/* Статистичні картки */}
      <section className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={clsx(styles.statIcon, styles.blue)}>
            <IoBookOutline />
          </div>
          <div className={styles.statInfo}>
            <span>Активні курси</span>
            <strong>{Array.from(new Set(tasks.map(t => t.subjectName))).length}</strong>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={clsx(styles.statIcon, styles.orange)}>
            <IoTimeOutline />
          </div>
          <div className={styles.statInfo}>
            <span>Очікують дедлайну</span>
            <strong>{tasks.filter(t => !t.isOverdue).length}</strong>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={clsx(styles.statIcon, styles.green)}>
            <IoCheckmarkDoneOutline />
          </div>
          <div className={styles.statInfo}>
            <span>Здано робіт (всього)</span>
            <strong>{totalSubmissions}</strong>
          </div>
        </div>
      </section>

      <div className={styles.tableCard}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Завдання</th>
              <th>Група</th>
              <th>Прогрес здачі</th>
              <th>Терміни</th>
              <th>Статус</th>
              <th align="right">Дії</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((task) => (
              <tr key={task.id}>
                <td>
                  <div className={styles.taskCell}>
                    <div className={styles.taskIcon}>
                      {/* Якщо ми додали поле iconFileName раніше */}
                      {task.iconFileName ? (
                        <img src={`/api/files/download/${task.iconFileName}`} alt="" />
                      ) : (
                        <IoImageOutline />
                      )}
                    </div>
                    <div className={styles.taskMeta}>
                      <span className={styles.subjectName}>{task.subjectName}</span>
                      <strong className={styles.taskTitle}>{task.title}</strong>
                    </div>
                  </div>
                </td>
                <td>
                  <div className={styles.groupCell}>
                    <IoPeopleOutline />
                    <span>{task.groupName}</span>
                  </div>
                </td>
                <td>
                  <div className={styles.progressContainer}>
                    <div className={styles.progressHeader}>
                      <span>{Math.round((task.stats.submitted / task.stats.total) * 100)}%</span>
                      <small>{task.stats.submitted}/{task.stats.total}</small>
                    </div>
                    <div className={styles.progressTrack}>
                      <div 
                        className={styles.progressThumb} 
                        style={{ width: `${(task.stats.submitted / task.stats.total) * 100}%` }} 
                      />
                    </div>
                  </div>
                </td>
                <td>
                  <div className={styles.datesCell}>
                    <div className={styles.dateRow}>
                      <small>Від:</small> <span>{task.createdAt}</span>
                    </div>
                    <div className={clsx(styles.dateRow, task.isOverdue && styles.overdue)}>
                      <small>До:</small> <span>{task.deadline}</span>
                    </div>
                  </div>
                </td>
                <td>
                  <span className={clsx(styles.statusBadge, task.isOverdue ? styles.closed : styles.active)}>
                    {task.isOverdue ? "Завершено" : "Активне"}
                  </span>
                </td>
                <td>
                  <div className={styles.actions}>
                    <button 
                      className={styles.actionBtn} 
                      onClick={() => router.push(`/manage-homework/${task.id}/submissions`)}
                      title="Статистика та оцінювання"
                    >
                      <IoStatsChartOutline />
                    </button>

                    <button 
                      className={clsx(styles.actionBtn, styles.delete)} 
                      onClick={() => handleDelete(task.id)}
                      title="Видалити"
                    >
                      <IoTrashOutline />
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