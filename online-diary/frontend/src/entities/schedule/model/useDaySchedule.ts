import { useState, useEffect } from "react";
import { Dayjs } from "dayjs";
import { fetchSchedule } from "../api/scheduleApi";
import { ScheduleEvent } from "../model/types";

export const useDaySchedule = (currentDate: Dayjs) => {
    const [lessons, setLessons] = useState<ScheduleEvent[]>([]);
    const [loading, setLoading] = useState(false);

    const dateKey = currentDate.format("YYYY-MM-DD"); 

    useEffect(() => {
        const load = async () => {
            setLoading(true);
            try {
                const start = currentDate.startOf("week").format("YYYY-MM-DD");
                const end = currentDate.endOf("week").format("YYYY-MM-DD");
                
                const data = await fetchSchedule(start, end);
                setLessons(data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        load();
    }, [dateKey]); 

    return { lessons, loading };
};