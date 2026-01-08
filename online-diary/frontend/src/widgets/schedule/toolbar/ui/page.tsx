// @widgets/schedule/toolbar/index.tsx
"use client";

import { IoMenuOutline, IoCalendarOutline, IoAppsOutline } from "react-icons/io5";
import { Dayjs } from "dayjs";
import Button from "@shared/ui/Button";
import clsx from "clsx";
import styles from "./styles.module.scss";

interface ToolbarProps {
  currentDate: Dayjs;
  view: "week" | "month";
  weekDays: Dayjs[];
  onViewChange: (view: "week" | "month") => void;
  onOpenMenu: () => void;
  onToday: () => void;
  onPrev: () => void;
  onNext: () => void;
}

export const ScheduleToolbar = ({
  currentDate, view, weekDays, onViewChange,
  onOpenMenu, onToday, onPrev, onNext
}: ToolbarProps) => {
  const dateRangeLabel = view === "week" 
    ? `${weekDays[0].format("D MMM")} — ${weekDays[6].format("D MMM")}` 
    : currentDate.format("MMMM YYYY");

  return (
    <header className={styles.toolbar}>
      <div className={styles.toolbarLeft}>
        <button className={styles.mobileMenuBtn} onClick={onOpenMenu}>
          <IoMenuOutline size={24} />
        </button>

        <Button variant="secondary" onClick={onToday} className={styles.todayBtn}>
          Сьогодні
        </Button>
        
        <div className={styles.navArrows}>
          <button onClick={onPrev} className={styles.arrowBtn}>‹</button>
          <button onClick={onNext} className={styles.arrowBtn}>›</button>
        </div>
        
        <span className={styles.dateRange}>{dateRangeLabel}</span>
      </div>
      
      <div className={styles.toolbarRight}>
        <div className={styles.segmentedControl}>
          <button 
            className={clsx(styles.viewBtn, view === "week" && styles.viewBtnActive)} 
            onClick={() => onViewChange("week")}
          >
            <IoCalendarOutline size={18} />
            <span className={styles.btnText}>Тиждень</span>
          </button>
          <button 
            className={clsx(styles.viewBtn, view === "month" && styles.viewBtnActive)} 
            onClick={() => onViewChange("month")}
          >
            <IoAppsOutline size={18} />
            <span className={styles.btnText}>Місяць</span>
          </button>
        </div>
      </div>
    </header>
  );
};