"use client";

import { PickersDay, PickersDayProps } from "@mui/x-date-pickers/PickersDay";
import clsx from "clsx";
import { useCalendarMarks } from "@entities/schedule/model/useCalendarMarks";
import { ScheduleEvent } from "../../model/types"; 
import styles from "./styles.module.scss";

interface CalendarDayProps extends PickersDayProps {
  lessons?: ScheduleEvent[];
}

export function CalendarDay(props: any) {
  const lessons = props.lessons || [];
  const { getDayTypes } = useCalendarMarks(lessons);
  const dayTypes = getDayTypes(props.day); 

  return (
    <PickersDay
      {...props}
      className={clsx(
        styles.day,
        dayTypes.includes("lecture") && styles.hasLecture,
        dayTypes.includes("practice") && styles.hasPractice,
        dayTypes.includes("exam") && styles.hasExam,
        props.className
      )}
    />
  );
}