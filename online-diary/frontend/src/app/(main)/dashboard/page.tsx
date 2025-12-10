// src/app/dashboard/page.tsx
import styles from "./styles.module.scss";

type TodayLesson = {
  time: string;
  title: string;
  type: string;
  teacher: string;
  room: string;
};

type LastGrade = {
  subject: string;
  workType: string;
  date: string;
  teacher: string;
  grade: string;
};

const TODAY_LESSONS: TodayLesson[] = [
  {
    time: "08:30 – 10:00",
    title: "Математичний аналіз",
    type: "Лекція",
    teacher: "к. Петренко",
    room: "ауд. 204",
  },
  {
    time: "10:20 – 11:50",
    title: "ООП (Java)",
    type: "Лабораторна",
    teacher: "к. Іваненко",
    room: "ауд. 305",
  },
];

const LAST_GRADES: LastGrade[] = [
  {
    subject: "Математичний аналіз",
    workType: "Самостійна робота",
    date: "08.12.2025",
    teacher: "к. Петренко",
    grade: "95 / 100",
  },
  {
    subject: "ООП (Java)",
    workType: "Лабораторна",
    date: "07.12.2025",
    teacher: "к. Іваненко",
    grade: "4.5 / 5",
  },
  {
    subject: "Історія",
    workType: "Тест",
    date: "05.12.2025",
    teacher: "к. Коваленко",
    grade: "88 / 100",
  },
];

export default function DashboardPage() {
  return (
    <div className={styles.page}>
      {/* верхняя сетка: приветствие + середній бал */}
      <div className={styles.topGrid}>
        <section className={`${styles.card} ${styles.welcome}`}>
          <div className={styles.welcomeHeader}>
            <h1 className={styles.welcomeTitle}>Привіт, Студенте 👋</h1>
            <p className={styles.welcomeSubtitle}>
              Гарного дня! Ось що чекає на тебе сьогодні:
            </p>
          </div>

          <div className={styles.chipsRow}>
            <span className={styles.chip}>3 пари</span>
            <span className={styles.chip}>2 домашні</span>
            <span className={styles.chip}>1 дедлайн</span>
          </div>

          <div className={styles.homeworkBlock}>
            <div>
              <div className={styles.blockLabel}>Домашні завдання</div>
              <div className={styles.homeworkList}>
                <span>Математика</span>
                <span>ООП (Java)</span>
              </div>
            </div>
            <div className={styles.homeworkMeta}>
              <span>завтра · 12:00</span>
              <span>пʼятниця · 18:00</span>
            </div>
          </div>

          <button type="button" className={styles.linkButton}>
            Перейти до всіх завдань
          </button>
        </section>

        <section className={`${styles.card} ${styles.avgGrade}`}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Середній бал</h2>
          </div>

          <div className={styles.avgGradeMain}>
            <div className={styles.avgGradeValue}>4.3 / 5.0</div>
            <div className={styles.avgGradeHint}>за поточний семестр</div>
          </div>

          <dl className={styles.avgGradeList}>
            <div className={styles.avgGradeRow}>
              <dt>Математика</dt>
              <dd>4.6</dd>
            </div>
            <div className={styles.avgGradeRow}>
              <dt>ООП (Java)</dt>
              <dd>4.1</dd>
            </div>
            <div className={styles.avgGradeRow}>
              <dt>Англійська</dt>
              <dd>4.7</dd>
            </div>
          </dl>
        </section>
      </div>

      {/* останні оцінки */}
      <section className={`${styles.card} ${styles.lastGrades}`}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Останні оцінки</h2>
          <button type="button" className={styles.textButton}>
            Всі оцінки
          </button>
        </div>

        <div className={styles.lastGradesList}>
          {LAST_GRADES.map((g) => (
            <div key={`${g.subject}-${g.date}`} className={styles.gradeItem}>
              <div className={styles.gradeMain}>
                <div className={styles.gradeSubject}>{g.subject}</div>
                <div className={styles.gradeValue}>{g.grade}</div>
              </div>
              <div className={styles.gradeMeta}>
                <span>{g.workType}</span>
                <span>{g.date}</span>
                <span>{g.teacher}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* сетка: відвідуваність + календар + пари сьогодні */}
      <div className={styles.bottomGrid}>
        <section className={`${styles.card} ${styles.attendance}`}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Відвідуваність</h2>
            <span className={styles.sectionNote}>за останній місяць</span>
          </div>

          <div className={styles.attendanceRow}>
            <div className={styles.attendanceCard}>
              <div className={styles.attendanceValue}>87%</div>
              <div className={styles.attendanceLabel}>Присутність</div>
              <div className={styles.attendanceHint}>усі заняття</div>
            </div>
            <div className={styles.attendanceCard}>
              <div className={styles.attendanceValue}>6%</div>
              <div className={styles.attendanceLabel}>Запізнення</div>
              <div className={styles.attendanceHint}>від усіх пар</div>
            </div>
            <div className={styles.attendanceCard}>
              <div className={styles.attendanceValue}>7%</div>
              <div className={styles.attendanceLabel}>Пропуски</div>
              <div className={styles.attendanceHint}>без поважної причини</div>
            </div>
          </div>
        </section>

        <section className={`${styles.card} ${styles.calendar}`}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Календар</h2>
            <span className={styles.sectionNote}>Грудень 2025</span>
          </div>

          <div className={styles.calendarGrid}>
            {["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Нд"].map((d) => (
              <div key={d} className={styles.calendarWeekday}>
                {d}
              </div>
            ))}

            {/* просто демо-сетка – числа можно потом генерить реально */}
            {Array.from({ length: 31 }).map((_, i) => {
              const day = i + 1;
              const isToday = day === 8;
              const hasEvents = [3, 5, 12, 19, 24].includes(day);

              return (
                <button
                  key={day}
                  type="button"
                  className={`${styles.calendarDay} ${
                    isToday ? styles.calendarDayToday : ""
                  } ${hasEvents ? styles.calendarDayWithEvents : ""}`}
                >
                  {day}
                </button>
              );
            })}
          </div>
        </section>

        <section className={`${styles.card} ${styles.todayLessons}`}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Пари сьогодні</h2>
            <span className={styles.sectionNote}>2 заняття</span>
          </div>

          <div className={styles.todayLessonsList}>
            {TODAY_LESSONS.map((l) => (
              <div key={l.time} className={styles.lessonItem}>
                <div className={styles.lessonTime}>{l.time}</div>
                <div className={styles.lessonMain}>
                  <div className={styles.lessonTitle}>{l.title}</div>
                  <div className={styles.lessonMeta}>
                    <span>{l.type}</span>
                    <span>{l.teacher}</span>
                    <span>{l.room}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
