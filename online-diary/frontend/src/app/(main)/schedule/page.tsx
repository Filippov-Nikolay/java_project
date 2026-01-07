"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import dayjs from "dayjs";
import "dayjs/locale/uk"; 
import isToday from "dayjs/plugin/isToday";

import { DaySchedule, ScheduleEvent } from "@entities/schedule";
import { fetchSchedule } from "@entities/schedule/api/scheduleApi"; 
import { AppCalendar } from "@entities/schedule/ui/AppCalendar";
import Button from "@shared/ui/Button";
import styles from "./styles.module.scss";
import { WeekView } from "@widgets/schedule/WeekView";
import { MonthView } from "@widgets/schedule/MonthView";
import { LESSON_TIMES } from "@shared/config/schedule";

dayjs.extend(isToday);
dayjs.locale("uk");

export default function SchedulePage() {
  const [view, setView] = useState<"week" | "month">("week");
  const [currentDate, setCurrentDate] = useState(dayjs().locale("uk"));
  const [lessons, setLessons] = useState<ScheduleEvent[]>([]);

  const [now, setNow] = useState(dayjs());
  const [isMounted, setIsMounted] = useState(false);

  const hours = useMemo(() => Array.from({ length: 15 }, (_, i) => i + 7), []);

  const loadScheduleData = useCallback(async () => {

    try {
      const start = currentDate.startOf(view).format("YYYY-MM-DD");
      const end = currentDate.endOf(view).format("YYYY-MM-DD");
      
      const data = await fetchSchedule(start, end);
      setLessons(data);
    } catch (err) {
      console.error("Помилка завантаження розкладу:", err);
    } 
 
  }, [currentDate, view]);

  useEffect(() => {
    setIsMounted(true);
    const timer = setInterval(() => setNow(dayjs()), 60000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (isMounted) {
      loadScheduleData();
    }
  }, [currentDate, view, isMounted, loadScheduleData]);

  const isLessonActive = (lessonDate: string, lessonNumber: number) => {
    const time = LESSON_TIMES[lessonNumber as keyof typeof LESSON_TIMES];
    if (!time) return false;
    const start = dayjs(`${lessonDate} ${time.start}`, "YYYY-MM-DD HH:mm");
    const end = dayjs(`${lessonDate} ${time.end}`, "YYYY-MM-DD HH:mm");
    return now.isAfter(start) && now.isBefore(end);
  };

  const weekDays = useMemo(() => {
    const start = currentDate.startOf("week");
    return Array.from({ length: 7 }, (_, i) => start.add(i, "day"));
  }, [currentDate]);

  const monthDays = useMemo(() => {
    const start = currentDate.startOf("month").startOf("week");
    const end = currentDate.endOf("month").endOf("week");
    let days = [], day = start;
    while (day <= end) { days.push(day); day = day.add(1, "day"); }
    return days;
  }, [currentDate]);

  const indicatorPos = useMemo(() => (now.hour() * 80) + (now.minute() / 60) * 80, [now]);

  const sidebarLessons = useMemo(() => {
    return lessons
      .filter((l: ScheduleEvent) => l.date === currentDate.format("YYYY-MM-DD"))
      .map((l: ScheduleEvent) => {
        const lNum = l.lessonNumber as keyof typeof LESSON_TIMES;
        const time = LESSON_TIMES[lNum];
        return {
          ...l,
          title: l.subjectName,
          startTime: time?.start || "--:--",
          endTime: time?.end || "--:--",
          teacherFullName: l.teacherFullName || "Викладач не вказаний",
          isActive: isLessonActive(l.date, l.lessonNumber)
        };
      })
      .sort((a, b) => a.lessonNumber - b.lessonNumber);
  }, [lessons, currentDate, now]);

  return (
    <div className={styles.page}>
      <aside className={styles.sidebar}>
        <div className={styles.miniCalendarWrapper}>
          {isMounted && (
            <AppCalendar 
              key={lessons.length}
              value={currentDate} 
              onChange={setCurrentDate} 
              lessons={lessons} 
            />
          )}
        </div>
        <div className={styles.sidebarSchedule}>
          <DaySchedule 
            title={`План на ${currentDate.format("DD MMM")}`} 
            lessons={sidebarLessons} 
          />
        </div>
      </aside>

      <main className={styles.main}>
        <header className={styles.toolbar}>
            <div className={styles.toolbarLeft}>
                <Button variant="secondary" onClick={() => setCurrentDate(dayjs().locale("uk"))}>Сьогодні</Button>
                <div className={styles.navArrows}>
                    <button onClick={() => setCurrentDate(currentDate.subtract(1, view))} className={styles.arrowBtn}>‹</button>
                    <button onClick={() => setCurrentDate(currentDate.add(1, view))} className={styles.arrowBtn}>›</button>
                </div>
                <span className={styles.dateRange}>
                    {view === "week" ? `${weekDays[0].format("D MMM")} — ${weekDays[6].format("D MMM YYYY")}` : currentDate.format("MMMM YYYY")}
                </span>
            </div>
            <div className={styles.toolbarRight}>
                <select className={styles.viewSelect} value={view} onChange={(e) => setView(e.target.value as any)}>
                    <option value="week">Тиждень</option>
                    <option value="month">Місяць</option>
                </select>
            </div>
        </header>

        <div className={`${styles.scheduleContainer} ${styles[view]}`}>
          <div className={styles.daysHeader}>
            {view === "week" && <div className={styles.gutter} />}
            {weekDays.map((day) => (
              <div key={day.format()} className={`${styles.dayColHeader} ${day.isToday() ? styles.active : ""}`}>
                {view === "week" && <span className={styles.dayNum}>{day.date()}</span>}
                <span className={styles.dayLabel}>
                  {view === "week" ? day.format("ddd").toUpperCase() : day.format("dddd").toUpperCase()}
                </span>
              </div>
            ))}
          </div>

          <div className={styles.gridBody}>
            {isMounted && view === "week" ? (
              <WeekView 
                hours={hours} 
                weekDays={weekDays} 
                events={lessons} 
                now={now} 
                indicatorPos={indicatorPos} 
              />
            ) : isMounted ? (
              <MonthView 
                monthDays={monthDays} 
                currentDate={currentDate} 
                events={lessons} 
              />
            ) : null}
          </div>
        </div>
      </main>
    </div>
  );
}