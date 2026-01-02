"use client";
import { ReactNode } from "react";
import Link from "next/link";
import styles from "./styles.module.scss";

interface Props {
  title: ReactNode;          
  lessons: any[];
  emptyText?: string;
}

export const DaySchedule = ({ title, lessons, emptyText = "Немає пар 🎉" }: Props) => {
  return (
    <div className={styles.root}>
      <div className={styles.title}>{title}</div>
      {lessons.length === 0 ? (
        <div className={styles.empty}>{emptyText}</div>
      ) : (
        <div className={styles.list}>
          {lessons.map((l) => {

            console.log(`Lesson ${l.title}: ID=${l.id}, Active=${l.isActive}`);

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

            if (l.isActive) {
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