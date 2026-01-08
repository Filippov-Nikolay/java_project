"use client";

import dayjs, { Dayjs } from "dayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import { CalendarDay } from "../CalendarDay";
import { ScheduleEvent } from "../../model/types"; 
 
import styles from "./styles.module.scss";

import "dayjs/locale/uk";

interface Props {
  value: Dayjs;
  onChange: (date: Dayjs) => void;
  onMonthChange?: (date: Dayjs) => void;
  lessons: ScheduleEvent[];
}

export const AppCalendar = ({ value, onChange, onMonthChange, lessons }: Props) => (
  <div className={styles.calendarWrap}>
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="uk">
      <DateCalendar
        value={value}
        onChange={(v) => v && onChange(v)}
        onMonthChange={(m) => onMonthChange?.(m.startOf("month"))}
        slots={{ 
          day: CalendarDay as any 
        }}
        slotProps={{
          day: {
            lessons: lessons,
          } as any,
        }}
        className={styles.muiCalendar}
        showDaysOutsideCurrentMonth
        fixedWeekNumber={6} 
      />
    </LocalizationProvider>

    <div className={styles.legend}>
      <div className={styles.legendItem}>
        <span className={`${styles.legendDot} ${styles.dotLecture}`} />
        <span>Лекція</span>
      </div>
      <div className={styles.legendItem}>
        <span className={`${styles.legendDot} ${styles.dotPractice}`} />
        <span>Практика</span>
      </div>
      <div className={styles.legendItem}>
        <span className={`${styles.legendDot} ${styles.dotExam}`} />
        <span>Іспит</span>
      </div>
    </div>
  </div>
);