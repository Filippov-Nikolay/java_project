"use client";

import { useEffect } from "react";
import NProgress from "nprogress";
import "nprogress/nprogress.css"; // Імпорт стилів полоски
import { HomeworkList } from "@widgets/homework/homework-list";
import { useHomeworkFilters } from "@features/manage-homework/filter";
import { SubjectPicker } from "@features/manage-homework/subject-picker/ui";
import { CustomSelect } from "@shared/ui/Select";
import { useGetHomeworks } from "@entities/homework";
import styles from "./styles.module.scss";

// Налаштування nprogress
NProgress.configure({ showSpinner: false, speed: 400, minimum: 0.2 });

export default function HomeworkPage() {
  const { homeworks, isLoading, refetch } = useGetHomeworks();

  const {
    filteredItems,
    activeTab, setActiveTab,
    setSubject, subject,
    sortByOverdue, setSortByOverdue,
    sortOrder, setSortOrder,
    totalCount
  } = useHomeworkFilters(homeworks);

  const subjectsList = Array.from(new Set(homeworks.map((i) => i.subjectName)));

  // Оновлена функція зміни таби з візуальним прогресом
  const handleTabChange = async (tab: any) => {
    setActiveTab(tab);
    
    NProgress.start(); // Запускаємо полоску зверху
    try {
      await refetch(); // Чекаємо завершення завантаження даних
    } finally {
      NProgress.done(); // Зупиняємо полоску
    }
  };

  if (isLoading) return null; 

  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <div className={styles.tabs}>
           {['todo', 'pending', 'done'].map((tab) => (
             <button
               key={tab}
               className={activeTab === tab ? styles.tabActive : styles.tab}
               onClick={() => handleTabChange(tab as any)}
             >
               {tab === 'todo' ? 'До виконання' : tab === 'pending' ? 'На перевірці' : 'Виконані'}
             </button>
           ))}
        </div>

        <div className={styles.filterRow}>
          <div className={styles.left}>
            <SubjectPicker
              subjects={subjectsList}
              selected={subject}
              onSelect={setSubject}
            />

            
            
            <span className={styles.sortLabel}>Доступно завдань: {totalCount}</span>
          </div>

          <div className={styles.right}>
            <div className={styles.sortContainer}>
              {activeTab === 'todo' && (
              <button
                className={`${styles.overdueToggle} ${sortByOverdue ? styles.overdueActive : ''}`}
                onClick={() => setSortByOverdue(!sortByOverdue)}
              >
                ⚠️ Протерміновані
              </button>
            )}
            
              <span className={styles.sortLabel}>Сортувати:</span>
              <CustomSelect
                options={[
                  { value: 'newest', label: 'Спочатку нові' },
                  { value: 'oldest', label: 'Спочатку старі' }
                ]}
                value={sortOrder}
                onChange={setSortOrder}
                className={styles.compactSelect}
              />
            </div>
          </div>
        </div>
      </header>

      <HomeworkList items={filteredItems} />
    </main>
  );
}