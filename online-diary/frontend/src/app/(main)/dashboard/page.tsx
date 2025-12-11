// src/app/dashboard/page.tsx
import Link from "next/link";
import styles from "./styles.module.scss";
import KeyboardArrowRightRoundedIcon from '@mui/icons-material/KeyboardArrowRightRounded';


/* моковые данные*/

type Accrual = {
  date: string;
  title: string;
  type: string;
  delta: string;
};

type Leader = {
  place: number;
  name: string;
  score: number;
};

type Feedback = {
  subject: string;
  text: string;
  author: string;
  date: string;
};

type TodayLesson = {
  time: string;
  title: string;
  room: string;
};

const ACCRUALS: Accrual[] = [
  {
    date: "10 December",
    title: "Розробка хмарних додатків",
    type: "Відвідування заняття",
    delta: "+1 💎",
  },
  {
    date: "10 December",
    title: "Оцінка уроку викладача студентом",
    type: "Опитування",
    delta: "+1 💎",
  },
  {
    date: "09 December",
    title: "Інтелектуальний аналіз даних",
    type: "Відвідування заняття",
    delta: "+1 💎",
  },
];

const LEADERS: Leader[] = [
  { place: 1, name: "Руденко Олена Костянтинівна", score: 8176 },
  { place: 2, name: "Шевченко Марія Василівна", score: 8103 },
  { place: 3, name: "Філіппов Микола Олегович", score: 8017 },
  { place: 4, name: "Одійцов Андрій Георгійович", score: 7714 },
  { place: 5, name: "Джосан Дмитро Валерійович", score: 7086 },
];

const FEEDBACKS: Feedback[] = [
  {
    subject: "Економіка та бізнес",
    text: "По ДЗ все добре, але треба бути активнішим на парах.",
    author: "Разинкин Нікіта",
    date: "23.05.2024",
  },
  {
    subject: "Теорія ймовірностей та матстатистика",
    text: "Все гаразд. Залік зданий.",
    author: "Касьянова Валерія",
    date: "18.03.2024",
  },
];

const TODAY_LESSONS: TodayLesson[] = [
  {
    time: "08:50 – 10:10",
    title: "Програмування з використанням Java",
    room: "ауд. онлайн 2",
  },
  {
    time: "10:20 – 11:40",
    title: "Програмування з використанням Java",
    room: "ауд. онлайн 2",
  },
];

const studentName = "Данило";
const todayLessonsCount = 3;  
const group = "КН-П-221";
const allHomework = 25;
const dedlineHomework = 5;

const initials = studentName
  .split(" ")
  .filter(Boolean)
  .map((p) => p[0])
  .join("")
  .slice(0, 2)
  .toUpperCase();


const quickStats = [
  {
    value: todayLessonsCount,
    label: "пар(и) сьогодні",
    href: "/schedule",
  },
  {
    value: allHomework,
    label: "Завдання до виконання",
    href: "/homework",
  },
  {
    value: dedlineHomework,
    label: "Завдань протерміновано",
    href: "/homework",
  },
];


export default function DashboardPage() {
  return (
    <div className={styles.page}>
      <div className={styles.grid}>
        {/* ЛЕВАЯ КОЛОНКА */}
        <div className={styles.colLeft}>
          <section className={`${styles.card} ${styles.profile}`}>
            <div className={styles.profileTop}>
              <div className={styles.profileHeader}>
                <div className={styles.profileAvatar}>
                  <span>{initials}</span>
                </div>

                <div className={styles.profileText}>
                  <p className={styles.profileGreeting}>
                    Привіт,{" "}
                    <span className={styles.profileName}>{studentName}</span> 👋
                  </p>
                  <p className={styles.profileSub}>{group}</p>
                </div>
              </div>

              <Link
                href="/profile"
                className={styles.profileMore}
                aria-label="Перейти в профіль"
              >
                <KeyboardArrowRightRoundedIcon className={styles.profileMoreIcon} />
              </Link>
            </div>

            {/* кликабельные карточки со стрелками */}
            <div className={styles.profileInfoRow}>
              {quickStats.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className={styles.profileInfoItem}
                >
                  <div className={styles.profileInfoTexts}>
                    <span className={styles.profileInfoValue}>{item.value}</span>
                    <span className={styles.profileInfoLabel}>{item.label}</span>
                  </div>

                  <KeyboardArrowRightRoundedIcon className={styles.profileInfoChevron} />
                </Link>
              ))}
            </div>
          </section>

          {/* 2. Середній бал + мини-график */}
          <section className={`${styles.card} ${styles.avgSection}`}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>Середній бал</h2>
              <button className={styles.chipSmall} type="button">
                Рік
              </button>
            </div>

            <div className={styles.avgTopRow}>
              <div className={styles.avgStatBlock}>
                <div className={styles.avgStatValue}>10</div>
                <div className={styles.avgStatLabel}>Класна робота</div>
              </div>
              <div className={styles.avgStatBlock}>
                <div className={styles.avgStatValue}>11</div>
                <div className={styles.avgStatLabel}>Самостійна робота</div>
              </div>
              <div className={styles.avgStatBlock}>
                <div className={styles.avgStatValue}>9.6</div>
                <div className={styles.avgStatLabel}>Контрольні</div>
              </div>
              <div className={styles.avgStatBlock}>
                <div className={styles.avgStatValue}>12</div>
                <div className={styles.avgStatLabel}>Тематична</div>
              </div>
            </div>

            {/* заглушка под график */}
            <div className={styles.chartStub}>
              <div className={styles.chartGrid} />
              <div className={styles.chartLine} />
            </div>
          </section>

          {/* 3. Оцінки-календарем */}
          <section className={`${styles.card} ${styles.marksSection}`}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>Оцінки</h2>
            </div>

            <div className={styles.marksFilterRow}>
              <label className={styles.checkbox}>
                <input type="checkbox" defaultChecked /> <span>Класна робота</span>
              </label>
              <label className={styles.checkbox}>
                <input type="checkbox" defaultChecked />{" "}
                <span>Самостійна робота</span>
              </label>
              <label className={styles.checkbox}>
                <input type="checkbox" defaultChecked /> <span>Контрольні</span>
              </label>
            </div>

            <div className={styles.marksCalendar}>
              <div className={styles.marksMonth}>December</div>
              <div className={styles.marksRow}>
                <span className={styles.marksDot}>2</span>
                <span className={styles.marksDot}>2</span>
                <span className={styles.marksDot}>12</span>
                <span className={`${styles.marksDot} ${styles.marksDotAccent}`}>
                  2
                </span>
              </div>

              <div className={styles.marksMonth}>November</div>
              <div className={styles.marksRow}>
                {["10", "12", "2", "2", "12", "2", "11", "10", "12", "11", "12"].map(
                  (d, index) => (
                    <span key={`${d}-${index}`} className={styles.marksDot}>
                      {d}
                    </span>
                  ),
                )}
              </div>
            </div>
          </section>
        </div>

        {/* ЦЕНТРАЛЬНАЯ КОЛОНКА */}
        <div className={styles.colCenter}>
          {/* Нарахування */}
          <section className={`${styles.card} ${styles.accrualsSection}`}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>Нарахування</h2>
              <div className={styles.accrualBadges}>
                <span className={styles.chipSmall}>👑 11</span>
                <span className={styles.chipSmall}>3993</span>
                <span className={styles.chipSmall}>2964 💎</span>
              </div>
            </div>

            <div className={styles.accrualList}>
              {ACCRUALS.map((acc) => (
                <div key={`${acc.title}-${acc.date}`} className={styles.accrualItem}>
                  <div className={styles.accrualLeft}>
                    <div className={styles.accrualIcon}>📅</div>
                  </div>
                  <div className={styles.accrualMiddle}>
                    <div className={styles.accrualTitle}>{acc.title}</div>
                    <div className={styles.accrualMeta}>
                      <span>{acc.type}</span>
                      <span>{acc.date}</span>
                    </div>
                  </div>
                  <div className={styles.accrualRight}>{acc.delta}</div>
                </div>
              ))}
            </div>
          </section>

          {/* Таблиця лідерів */}
          <section className={`${styles.card} ${styles.leadersSection}`}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>Таблиця лідерів</h2>
              <button type="button" className={styles.chipSmall}>
                Група
              </button>
            </div>

            <div className={styles.leadersList}>
              {LEADERS.map((l) => (
                <div key={l.place} className={styles.leaderItem}>
                  <div className={styles.leaderPlace}>{l.place}</div>
                  <div className={styles.leaderInfo}>
                    <div className={styles.leaderName}>{l.name}</div>
                  </div>
                  <div className={styles.leaderScore}>{l.score} ⭐</div>
                </div>
              ))}
            </div>
          </section>

          {/* Відгуки */}
          <section className={`${styles.card} ${styles.feedbackSection}`}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>Відгуки</h2>
            </div>

            <div className={styles.feedbackList}>
              {FEEDBACKS.map((fb) => (
                <div key={fb.date + fb.author} className={styles.feedbackItem}>
                  <div className={styles.feedbackSubject}>{fb.subject}</div>
                  <div className={styles.feedbackText}>{fb.text}</div>
                  <div className={styles.feedbackMeta}>
                    <span>{fb.author}</span>
                    <span>{fb.date}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* ПРАВАЯ КОЛОНКА */}
        <div className={styles.colRight}>
          {/* Календар + легенда */}
          <section className={`${styles.card} ${styles.calendarSection}`}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>Грудень 2025</h2>

              <div className={styles.calendarNav}>
                <button className={styles.navIcon} type="button">
                  {"<"}
                </button>
                <button className={styles.navIcon} type="button">
                  {">"}
                </button>
              </div>
            </div>

            <div className={styles.calendarGrid}>
              {["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Нд"].map((d) => (
                <div key={d} className={styles.calendarWeekday}>
                  {d}
                </div>
              ))}

              {Array.from({ length: 31 }).map((_, i) => {
                const day = i + 1;
                const hasLesson = [1, 8, 11, 18, 25].includes(day);
                const isExam = [15].includes(day);
                const isHoliday = [29, 30, 31].includes(day);

                return (
                  <div
                    key={day}
                    className={`${styles.calendarDay} ${
                      hasLesson ? styles.calendarDayLesson : ""
                    } ${isExam ? styles.calendarDayExam : ""} ${
                      isHoliday ? styles.calendarDayHoliday : ""
                    }`}
                  >
                    {day}
                  </div>
                );
              })}
            </div>

            <div className={styles.calendarLegend}>
              <span>
                <span className={`${styles.legendDot} ${styles.legendLesson}`} />
                Є заняття
              </span>
              <span>
                <span className={`${styles.legendDot} ${styles.legendExam}`} />
                Екзамен
              </span>
              <span>
                <span className={`${styles.legendDot} ${styles.legendHoliday}`} />
                Канікули
              </span>
            </div>
          </section>

          {/* Розклад на сьогодні */}
          <section className={`${styles.card} ${styles.todaySection}`}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>Розклад на сьогодні</h2>
            </div>

            <div className={styles.todayList}>
              {TODAY_LESSONS.map((l) => (
                <div key={l.time} className={styles.todayItem}>
                  <div className={styles.todayTitle}>{l.title}</div>
                  <div className={styles.todayMeta}>
                    <span>{l.time}</span>
                    <span>{l.room}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
