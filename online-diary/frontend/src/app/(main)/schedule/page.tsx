"use client";

import { useScheduleModel } from "@entities/schedule/model/useScheduleModel";
import { ScheduleSidebar } from "@widgets/schedule/sidebar";
import { ScheduleToolbar } from "@widgets/schedule/toolbar";
import { WeekView } from "@widgets/schedule/WeekView";
import { MonthView } from "@widgets/schedule/MonthView";
import clsx from "clsx";
import styles from "./styles.module.scss";

export default function SchedulePage() {
  const { 
    view, setView, currentDate, setCurrentDate,
    sidebarLessons, lessons, isSidebarOpen, setIsSidebarOpen,
    hours, weekDays, monthDays, now, actions 
  } = useScheduleModel();

  return (
    <div className={styles.page}>
      <div 
        className={clsx(styles.backdrop, isSidebarOpen && styles.backdropVisible)} 
        onClick={() => setIsSidebarOpen(false)} 
      />
      
      <ScheduleSidebar 
        isOpen={isSidebarOpen}
        currentDate={currentDate}
        onDateChange={setCurrentDate}
        lessons={lessons}
        sidebarLessons={sidebarLessons}
        onClose={() => setIsSidebarOpen(false)}
      />

      <main className={styles.main}>
        <ScheduleToolbar 
          currentDate={currentDate}
          view={view}
          weekDays={weekDays}
          onViewChange={setView}
          onOpenMenu={() => setIsSidebarOpen(true)}
          {...actions}
        />

        <div className={clsx(styles.scheduleContainer, view === "month" && styles.month)}>
          <div className={styles.scrollWrapper}>
            
            {/* Заголовки днів */}
            <div className={styles.daysHeader}>
              {view === "week" && <div className={styles.gutter} />}
              {weekDays.map((day) => (
                <div 
                    key={day.format()} 
                    className={clsx(styles.dayColHeader, day.isSame(now, "day") && styles.active)}
                >
                  <span className={styles.dayNum}>{day.date()}</span>
                  <span className={styles.dayLabel}>{day.format("ddd").toUpperCase()}</span>
                </div>
              ))}
            </div>

            {/* Тіло розкладу */}
            <div className={styles.gridBody}>
              {view === "week" ? (
                <WeekView hours={hours} weekDays={weekDays} events={lessons} now={now} />
              ) : (
                <MonthView monthDays={monthDays} currentDate={currentDate} events={lessons} />
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}