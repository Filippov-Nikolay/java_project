import { Subject } from "../model/types";

// Базовий URL твого Spring Boot бекенда
const BASE_URL = "http://localhost:8080/api";

export const subjectApi = {

    async getAllSubjects(): Promise<Subject[]> {
        const response = await fetch(`${BASE_URL}/subjects`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            throw new Error("Помилка при завантаженні предметів");
        }

        const data = await response.json();

        return data as Subject[];
    },

    async getSubjectById(id: string): Promise<Subject> {
        const response = await fetch(`${BASE_URL}/subjects/${id}`);
        if (!response.ok) throw new Error("Предмет не знайдено");
        return response.json();
    },

    async getSubjectsByGroupId(groupId: string | number): Promise<Subject[]> {
        const response = await fetch(`${BASE_URL}/groups/${groupId}/subjects`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            throw new Error(`Не вдалося завантажити предмети для групи ${groupId}`);
        }

        const data = await response.json();

        return data as Subject[];
    }
};