// @widgets/schedule/sidebar/index.tsx
"use client";

import { IoCloseOutline } from "react-icons/io5";
import { AppCalendar } from "@entities/schedule/ui/AppCalendar";
import { DaySchedule, ScheduleEvent } from "@entities/schedule";
import { Dayjs } from "dayjs";
import clsx from "clsx";
import styles from "./styles.module.scss";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  currentDate: Dayjs;
  onDateChange: (date: Dayjs) => void;
  lessons: ScheduleEvent[];
  sidebarLessons: any[];
}

export const ScheduleSidebar = ({
  isOpen, onClose, currentDate, onDateChange, lessons, sidebarLessons
}: SidebarProps) => {
  return (
    <aside className={clsx(styles.sidebar, isOpen && styles.sidebarOpen)}>
      <div className={styles.sidebarHeader}>
        <span className={styles.logo}>JByte</span>
        <button className={styles.closeBtn} onClick={onClose}>
          <IoCloseOutline size={24} />
        </button>
      </div>
      
      <div className={styles.miniCalendarWrapper}>
        <AppCalendar 
          value={currentDate} 
          onChange={onDateChange} 
          lessons={lessons} 
        />
      </div>

      <div className={styles.sidebarSchedule}>
        <DaySchedule 
          title={`План на ${currentDate.format("DD MMM")}`} 
          lessons={sidebarLessons} 
        />
      </div>
    </aside>
  );
};