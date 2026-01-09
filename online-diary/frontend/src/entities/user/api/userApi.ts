import Cookies from "js-cookie";
import { User } from "../model/types";


const BASE_URL = "/api/auth"; 

export const userApi = {

    async getMe(): Promise<User> {
        const token = Cookies.get("token");
        
        const response = await fetch(`${BASE_URL}/me`, {
            headers: { 
                "Authorization": `Bearer ${token}`,
                "Accept": "application/json"
            }
        });

        if (!response.ok) {
            const text = await response.text();
            if (text.startsWith("<!DOCTYPE")) {
                throw new Error("Сервер повернув HTML. Перевірте проксі у next.config.ts");
            }
            throw new Error("Помилка авторизації");
        }

        const data = await response.json();

        return {
            id: data.id,
            login: data.login,
            firstName: data.firstName,
            lastName: data.lastName,
            email: data.email,
            role: data.role,
            groupId: data.groupId,
            groupName: data.groupName || data.group?.name || "Група не вказана", 
            avatarUrl: data.avatar ? `data:image/jpeg;base64,${data.avatar}` : undefined,
        };
    },

    async updateAvatar(file: File) {
        const token = Cookies.get("token");
        const formData = new FormData();
        formData.append("file", file);

        return fetch(`${BASE_URL}/avatar`, {
            method: "POST",
            headers: { 
                "Authorization": `Bearer ${token}` 
 
            },
            body: formData
        });
    },

    async updatePassword(password: string) {
        const token = Cookies.get("token");
        
        return fetch(`${BASE_URL}/update-password`, {
            method: "POST",
            headers: { 
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}` 
            },
            body: JSON.stringify({ password })
        });
    },

    async register(data: any, avatarFile?: File) {
        const formData = new FormData();
        
        formData.append("firstName", data.firstName);
        formData.append("lastName", data.lastName);
        formData.append("email", data.email);
        formData.append("password", data.password);
        formData.append("role", data.role || "STUDENT");

        if (data.groupId) {
            formData.append("groupId", data.groupId.toString());
        }

        if (avatarFile) {
            formData.append("file", avatarFile);
        }

        const response = await fetch(`${BASE_URL}/register`, {
            method: "POST",
            body: formData,
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || "Помилка реєстрації. Можливо, email вже зайнятий.");
        }

        return response.json();
    }
};