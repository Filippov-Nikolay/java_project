"use client";
import { useState, useMemo, useEffect, useCallback } from "react";
import dayjs from "dayjs";
import "dayjs/locale/uk"; 
import isToday from "dayjs/plugin/isToday";
import { IoCalendarOutline, IoAppsOutline } from "react-icons/io5";
import clsx from "clsx";

import { DaySchedule, ScheduleEvent } from "@entities/schedule";
import { fetchSchedule } from "@entities/schedule/api/scheduleApi"; 
import { AppCalendar } from "@entities/schedule/ui/AppCalendar";
import { IoMenuOutline, IoCloseOutline } from "react-icons/io5";
import Button from "@shared/ui/Button";
import { WeekView } from "@widgets/schedule/WeekView";
import { MonthView } from "@widgets/schedule/MonthView";
import { LESSON_TIMES } from "@shared/config/schedule";
import styles from "./styles.module.scss";

dayjs.extend(isToday);
dayjs.locale("uk");

export default function SchedulePage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [view, setView] = useState<"week" | "month">("week");
  const [currentDate, setCurrentDate] = useState(dayjs().locale("uk"));
  const [lessons, setLessons] = useState<ScheduleEvent[]>([]);
  const [isMounted, setIsMounted] = useState(false);
  const [now, setNow] = useState(dayjs());

  const hours = useMemo(() => Array.from({ length: 15 }, (_, i) => i + 7), []);

  const loadScheduleData = useCallback(async () => {
    try {
      const start = currentDate.startOf(view).format("YYYY-MM-DD");
      const end = currentDate.endOf(view).format("YYYY-MM-DD");
      const data = await fetchSchedule(start, end);
      setLessons(data);
    } catch (err) { console.error(err); } 
  }, [currentDate, view]);

  useEffect(() => {
    setIsMounted(true);
    const timer = setInterval(() => setNow(dayjs()), 60000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => { if (isMounted) loadScheduleData(); }, [currentDate, view, isMounted, loadScheduleData]);

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

  const sidebarLessons = useMemo(() => {
    return lessons
      .filter((l) => l.date === currentDate.format("YYYY-MM-DD"))
      .map((l) => ({
        ...l,
        title: l.subjectName,
        startTime: LESSON_TIMES[l.lessonNumber as keyof typeof LESSON_TIMES]?.start || "--:--",
        endTime: LESSON_TIMES[l.lessonNumber as keyof typeof LESSON_TIMES]?.end || "--:--",
        isActive: true
      })).sort((a, b) => a.lessonNumber - b.lessonNumber);
  }, [lessons, currentDate]);

  return (
    <div className={styles.page} suppressHydrationWarning>
      {/* Бекдроп (затемнення) для мобілки */}
      <div 
        className={clsx(styles.backdrop, isSidebarOpen && styles.backdropVisible)} 
        onClick={() => setIsSidebarOpen(false)} 
      />

      <aside className={clsx(styles.sidebar, isSidebarOpen && styles.sidebarOpen)}>
        <div className={styles.sidebarHeader}>
           <span className={styles.logo}>JByte</span>
           <button className={styles.closeBtn} onClick={() => setIsSidebarOpen(false)}>
             <IoCloseOutline size={24} />
           </button>
        </div>
        
        <div className={styles.miniCalendarWrapper}>
          {isMounted && <AppCalendar value={currentDate} onChange={setCurrentDate} lessons={lessons} />}
        </div>
        <div className={styles.sidebarSchedule}>
          <DaySchedule title={`План на ${currentDate.format("DD MMM")}`} lessons={sidebarLessons} />
        </div>
      </aside>

      <main className={styles.main}>
        <header className={styles.toolbar}>
          <div className={styles.toolbarLeft}>
            {/* Кнопка бургера — видима тільки на мобільних */}
            <button className={styles.mobileMenuBtn} onClick={() => setIsSidebarOpen(true)}>
              <IoMenuOutline size={24} />
            </button>

            <Button variant="secondary" onClick={() => setCurrentDate(dayjs())} className={styles.todayBtn}>
              Сьогодні
            </Button>
            
            <div className={styles.navArrows}>
              <button onClick={() => setCurrentDate(currentDate.subtract(1, view))} className={styles.arrowBtn}>‹</button>
              <button onClick={() => setCurrentDate(currentDate.add(1, view))} className={styles.arrowBtn}>›</button>
            </div>
            <span className={styles.dateRange}>
              {view === "week" ? `${weekDays[0].format("D MMM")} — ${weekDays[6].format("D MMM")}` : currentDate.format("MMMM YYYY")}
            </span>
          </div>
          
          <div className={styles.toolbarRight}>
            <div className={styles.segmentedControl}>
              <button className={clsx(styles.viewBtn, view === "week" && styles.viewBtnActive)} onClick={() => setView("week")}>
                <IoCalendarOutline size={18} />
                <span className={styles.btnText}>Тиждень</span>
              </button>
              <button className={clsx(styles.viewBtn, view === "month" && styles.viewBtnActive)} onClick={() => setView("month")}>
                <IoAppsOutline size={18} />
                <span className={styles.btnText}>Місяць</span>
              </button>
            </div>
          </div>
        </header>

        <div className={clsx(styles.scheduleContainer, styles[view])}>
          {/* Тут важливо, щоб заголовок (дні тижня) скролився разом з сіткою */}
          <div className={styles.scrollWrapper}>
             <div className={styles.daysHeader}>
               <div className={styles.gutter} />
               {weekDays.map((day) => (
                 <div key={day.format()} className={clsx(styles.dayColHeader, day.isToday() && styles.active)}>
                   <span className={styles.dayNum}>{day.date()}</span>
                   <span className={styles.dayLabel}>{day.format("ddd").toUpperCase()}</span>
                 </div>
               ))}
             </div>
             <div className={styles.gridBody}>
               {isMounted && (view === "week" 
                 ? <WeekView hours={hours} weekDays={weekDays} events={lessons} now={now} />
                 : <MonthView monthDays={monthDays} currentDate={currentDate} events={lessons} />
               )}
             </div>
          </div>
        </div>
      </main>
    </div>
  );
}