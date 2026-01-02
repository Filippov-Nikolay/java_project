import { User } from "../model/types";

export const userApi = {
    async getMe(token: string): Promise<User> {

        const response = await fetch("/api/auth/me", {
            headers: { 
                "Authorization": `Bearer ${token}`,
                "Accept": "application/json"
            }
        });

        if (!response.ok) {

            const text = await response.text();
            if (text.startsWith("<!DOCTYPE")) {
                throw new Error("Сервер повернув HTML замість JSON. Перевірте проксі у next.config.ts");
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
    }
};