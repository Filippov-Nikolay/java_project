"use client";
import { ReactNode } from "react";
import Link from "next/link";
import { useUser } from "@entities/user/model/useUser"; // Імпортуємо ваш хук
import styles from "./styles.module.scss";

interface Props {
  title: ReactNode;          
  lessons: any[];
  emptyText?: string;
}

export const DaySchedule = ({ title, lessons, emptyText = "Немає пар 🎉" }: Props) => {
  const { user } = useUser(); // Отримуємо дані користувача

  return (
    <div className={styles.root}>
      <div className={styles.title}>{title}</div>
      {lessons.length === 0 ? (
        <div className={styles.empty}>{emptyText}</div>
      ) : (
        <div className={styles.list}>
          {lessons.map((l) => {
            // Перевірка: чи може користувач редагувати журнал?
            const canManageJournal = user?.role === "ADMIN" || user?.role === "TEACHER";
            const isClickable = l.isActive && canManageJournal;

            const cardBody = (
              <div className={`${styles.item} ${l.isActive ? styles.active : styles.locked}`}>
                <div className={styles.itemTitle}>{l.title}</div>
                <div className={styles.meta}>
                  <span>{l.startTime} – {l.endTime}</span>
                  {l.room && <span>Каб. {l.room}</span>}
                </div>
                {l.teacherFullName && (
                  <div className={styles.teacherName}>{l.teacherFullName}</div>
                )}
                {l.isActive && <div className={styles.liveBadge}>LIVE</div>}
                <div className={`${styles.typeBadge} ${styles[l.type || 'lecture']}`} />
              </div>
            );

            if (isClickable) {
              return (
                <Link 
                  href={`/admin/journal/${l.id}`} 
                  key={l.id} 
                  style={{ textDecoration: 'none', display: 'block' }}
                >
                  {cardBody}
                </Link>
              );
            }

            // Для студентів або неактивних пар повертаємо просто div
            return (
              <div key={l.id} className={styles.disabledClick}>
                {cardBody}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};