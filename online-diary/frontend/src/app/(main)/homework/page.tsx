"use client";

import { HomeworkList } from "@widgets/homework/homework-list";
import { useHomeworkFilters } from "@features/manage-homework/filter";
import { SubjectPicker } from "@features/manage-homework/subject-picker/ui";
import { CustomSelect } from "@shared/ui/Select";
import { useGetHomeworks } from "@entities/homework";
import styles from "./styles.module.scss";

export default function HomeworkPage() {

  const { homeworks, isLoading } = useGetHomeworks();

  const {
    filteredItems,
    activeTab, setActiveTab,
    setSubject, subject,
    sortByOverdue, setSortByOverdue,
    sortOrder, setSortOrder,
    totalCount
  } = useHomeworkFilters(homeworks);

  const subjectsList = Array.from(new Set(homeworks.map((i) => i.subjectName)));

  if (isLoading) return <div className={styles.loading}>Завантаження...</div>;

  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <div className={styles.tabs}>
          {['todo', 'pending', 'done'].map((tab) => (
            <button
              key={tab}
              className={activeTab === tab ? styles.tabActive : styles.tab}
              onClick={() => setActiveTab(tab as any)}
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

            <button
              className={`${styles.overdueToggle} ${sortByOverdue ? styles.overdueActive : ''}`}
              onClick={() => setSortByOverdue(!sortByOverdue)}
            >
              ⚠️ Спочатку протерміновані
            </button>
            
            <span className={styles.sortLabel}>Всього: {totalCount}</span>
          </div>

          <div className={styles.right}>
            <div className={styles.sortContainer}>
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