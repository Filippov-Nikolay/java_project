import { Subject } from "../model/types";

const BASE_URL = "/api"; 

const getHeaders = () => ({
    "Authorization": `Bearer ${localStorage.getItem("token")}`,
    "Content-Type": "application/json",
});

export const subjectApi = {
    async getAllSubjects(): Promise<Subject[]> {
        const response = await fetch(`${BASE_URL}/subjects`, {
            method: "GET",
            headers: getHeaders(),
        });

        if (!response.ok) throw new Error("Помилка при завантаженні предметів");
        return response.json();
    },

    async getSubjectsByGroupId(groupId: string | number): Promise<Subject[]> {
        const response = await fetch(`${BASE_URL}/groups/${groupId}/subjects`, {
            method: "GET",
            headers: getHeaders(),
        });

        if (!response.ok) throw new Error(`Не вдалося завантажити предмети для групи ${groupId}`);
        return response.json();
    }
};

export const getMySubjectsRequest = async (token: string | null) => {
    if (!token) throw new Error("No token found");

    const response = await fetch('/api/subjects/my', {
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    });

    if (!response.ok) throw new Error('Failed to fetch teacher subjects');
    return response.json();
};