"use client";

import dayjs from "dayjs";
import "dayjs/locale/uk";
import { useMemo, useState } from "react";

import { DashboardCard } from "@shared/ui/DashboardCard";
import { DaySchedule } from "@entities/schedule";
import { AppCalendar } from "@entities/schedule/ui/AppCalendar";

import { useDaySchedule } from "@entities/schedule/model/useDaySchedule";
import { LESSON_TIMES } from "@shared/config/schedule";
import { ScheduleEvent } from "@entities/schedule/model/types";

import styles from "./styles.module.scss";

export const DashboardCalendarCard = () => {
  const [selectedDate, setSelectedDate] = useState(dayjs().locale("uk"));

  const { lessons } = useDaySchedule(selectedDate);

  const formattedLessons = useMemo(() => {
    return lessons
      .filter((l: ScheduleEvent) => dayjs(l.date).format("YYYY-MM-DD") === selectedDate.format("YYYY-MM-DD"))
      .map((l: ScheduleEvent) => {
        const lNum = l.lessonNumber as keyof typeof LESSON_TIMES;
        const time = LESSON_TIMES[lNum];

        return {
          ...l,
          title: l.subjectName,
          startTime: time?.start || "--:--",
          endTime: time?.end || "--:--",
        };
      })
      .sort((a, b) => a.lessonNumber - b.lessonNumber); 
  }, [lessons, selectedDate]);

  return (
    <DashboardCard 
       title={selectedDate.format("MMMM YYYY")} 
       className={styles.root}
    >
      <AppCalendar 
        key={lessons.length + selectedDate.month()} 
        value={selectedDate} 
        onChange={setSelectedDate} 
        lessons={lessons} 
      />

      <div className={styles.scheduleWrapper}>
        <DaySchedule 
          title={`Розклад на ${selectedDate.format("DD MMM")}`} 
          lessons={formattedLessons} 
        />
      </div>
    </DashboardCard>
  );
};