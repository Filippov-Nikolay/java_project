"use client";
import { Dayjs } from "dayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import { CalendarDay } from "../CalendarDay";
import { ScheduleEvent } from "../../model/types"; 
import styles from "./styles.module.scss";

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
          day: (ownerState) => ({
            lessons: lessons,
          }) as any,
        }}
        className={styles.muiCalendar}
      />
    </LocalizationProvider>
  </div>
);