import Cookies from "js-cookie";
import { ScheduleEvent } from "../model/types";

const BASE_URL = "/api/schedule";

export const scheduleApi = {
    async fetchSchedule(start?: string, end?: string): Promise<ScheduleEvent[]> {
        const token = Cookies.get("token");
        const url = new URL(BASE_URL, window.location.origin);
        
        if (start) url.searchParams.append("start", start);
        if (end) url.searchParams.append("end", end);

        const res = await fetch(url.toString(), {
            headers: {
                "Authorization": `Bearer ${token}`,
                "Accept": "application/json"
            }
        });

        if (!res.ok) throw new Error("Помилка завантаження розкладу");
        return res.json();
    },

    async fetchScheduleItem(id: number): Promise<ScheduleEvent> {
        const token = Cookies.get("token");
        const res = await fetch(`${BASE_URL}/item/${id}`, {
            headers: { "Authorization": `Bearer ${token}` }
        });
        if (!res.ok) throw new Error("Запис не знайдено");
        return res.json();
    }
};