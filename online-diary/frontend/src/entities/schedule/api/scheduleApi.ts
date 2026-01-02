import { ScheduleEvent } from "../model/types";

const BASE_URL = "http://localhost:8080/api/schedule";


export const fetchSchedule = async (start?: string, end?: string): Promise<ScheduleEvent[]> => {
    const token = localStorage.getItem("token");
 
    const url = new URL(BASE_URL);
    if (start) url.searchParams.append("start", start);
    if (end) url.searchParams.append("end", end);

    const res = await fetch(url.toString(), {
        headers: {
            "Authorization": `Bearer ${token}`,
            "Accept": "application/json",
            "Content-Type": "application/json"
        }
    });

    if (!res.ok) {
        if (res.status === 401) throw new Error("Неавторизовано");
        throw new Error("Помилка завантаження розкладу");
    }

    return res.json();
};

export const fetchScheduleItem = async (id: number): Promise<ScheduleEvent> => {
    const token = localStorage.getItem("token");
    const res = await fetch(`${BASE_URL}/item/${id}`, {
        headers: { "Authorization": `Bearer ${token}` }
    });
    if (!res.ok) throw new Error("Запис не знайдено");
    return res.json();
};