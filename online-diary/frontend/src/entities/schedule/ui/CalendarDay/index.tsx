"use client";

import { PickersDay, PickersDayProps } from "@mui/x-date-pickers/PickersDay";
import clsx from "clsx"; // Не забудь импорт, если его нет
import { ScheduleEvent } from "../../model/types"; 
import { useCalendarMarks } from "../../model/useCalendarMarks";
import styles from "./styles.module.scss";

interface CalendarDayProps extends PickersDayProps {
  lessons?: ScheduleEvent[];
}

export function CalendarDay(props: CalendarDayProps) {
  const { lessons = [], day, outsideCurrentMonth, ...other } = props;
  const { getDayTypes } = useCalendarMarks(lessons);
  const dayTypes = getDayTypes(day);

  return (
    // Обертка нужна, чтобы позиционировать точки относительно всего квадрата дня
    <div className={styles.dayWrapper}>
      <PickersDay
        {...other}
        day={day}
        outsideCurrentMonth={outsideCurrentMonth}
        disableMargin
        className={styles.day}
      />
      
      {/* Рендерим точки только если это текущий месяц и есть типы занятий */}
      {!outsideCurrentMonth && dayTypes.length > 0 && (
        <div className={styles.dotContainer}>
          {dayTypes.map((type) => (
            <span 
              key={type} 
              className={clsx(styles.dot, {
                [styles.dotLecture]: type === "lecture",
                [styles.dotPractice]: type === "practice",
                [styles.dotExam]: type === "exam",
              })} 
            />
          ))}
        </div>
      )}
    </div>
  );
}