"use client";
import type { Dayjs } from "dayjs";
import { ScheduleEvent, ScheduleEventType } from "./types";
import dayjs from "dayjs";

export function useCalendarMarks(lessons: ScheduleEvent[] = []) {

  const getDayTypes = (day: Dayjs): ScheduleEventType[] => {
    if (!lessons || lessons.length === 0) return [];

    const dateStr = day.format("YYYY-MM-DD");
    const dayLessons = lessons.filter(l => 
      dayjs(l.date).format("YYYY-MM-DD") === dateStr
    );

    if (dayLessons.length === 0) return [];

    return Array.from(new Set(dayLessons.map(l => l.type)));
  };

  return { getDayTypes };
}