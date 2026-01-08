import { useState, useMemo, useEffect, useCallback } from "react";
import dayjs, { Dayjs } from "dayjs";
import { scheduleApi } from "../api/scheduleApi";
import { ScheduleEvent } from "./types";
import { LESSON_TIMES } from "./constants";

export const useScheduleModel = () => {
    const [view, setView] = useState<"week" | "month">("week");
    const [currentDate, setCurrentDate] = useState(dayjs().locale("uk"));
    const [lessons, setLessons] = useState<ScheduleEvent[]>([]);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [now, setNow] = useState(dayjs());

    const loadScheduleData = useCallback(async () => {
        try {
            const start = currentDate.startOf(view).format("YYYY-MM-DD");
            const end = currentDate.endOf(view).format("YYYY-MM-DD");
            const data = await scheduleApi.fetchSchedule(start, end);
            setLessons(data);
        } catch (err) {
            console.error("Schedule Load Error:", err);
        }
    }, [currentDate, view]);

    useEffect(() => {
        loadScheduleData();
        const timer = setInterval(() => setNow(dayjs()), 60000);
        return () => clearInterval(timer);
    }, [loadScheduleData]);

    const isLessonActive = useCallback((lessonDate: string, lessonNumber: number) => {
        const time = LESSON_TIMES[lessonNumber];
        if (!time) return false;
        const start = dayjs(`${lessonDate} ${time.start}`, "YYYY-MM-DD HH:mm");
        const end = dayjs(`${lessonDate} ${time.end}`, "YYYY-MM-DD HH:mm");
        return now.isAfter(start) && now.isBefore(end);
    }, [now]);

    const hours = useMemo(() => Array.from({ length: 15 }, (_, i) => i + 7), []);

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
        const dateStr = currentDate.format("YYYY-MM-DD");
        return lessons
            .filter((l) => l.date === dateStr)
            .map((l) => ({
                ...l,
                title: l.subjectName,
                startTime: LESSON_TIMES[l.lessonNumber]?.start || "--:--",
                endTime: LESSON_TIMES[l.lessonNumber]?.end || "--:--",
                isActive: isLessonActive(l.date, l.lessonNumber),
            }))
            .sort((a, b) => a.lessonNumber - b.lessonNumber);
    }, [lessons, currentDate, isLessonActive]);
return {
        view, setView,
        currentDate, setCurrentDate,
        lessons,
        isSidebarOpen, setIsSidebarOpen,
        now, hours, weekDays, monthDays, sidebarLessons,
        actions: {
            onToday: () => setCurrentDate(dayjs()),
            onNext: () => setCurrentDate(currentDate.add(1, view)), 
            onPrev: () => setCurrentDate(currentDate.subtract(1, view)),
        }
    };
};