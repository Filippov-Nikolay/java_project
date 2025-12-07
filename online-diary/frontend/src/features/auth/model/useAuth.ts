"use client";

import { useState } from "react";
import { useAppDispatch } from "@shared/store/hooks";
import { showNotification } from "@features/notifications/model/notificationSlice";

export type AuthCredentials = {
    login: string;
    password: string;
};

export const useAuth = () => {
    const dispatch = useAppDispatch();
    const [pending, setPending] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const login = async ({ login, password }: AuthCredentials) => {
        setPending(true);
        setError(null);

        try {
            const res = await fetch("/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ login, password }),
            });

            if (!res.ok) {
                throw new Error("Невірний логін або пароль");
            }

            dispatch(
                showNotification({
                    status: "successful",
                    message: "Вхід виконано успішно",
                }),
            );

            window.location.href = "/";
        } catch (err: any) {
            const msg = err.message ?? "Помилка входу";
            setError(msg);
            dispatch(
                showNotification({
                    status: "error",
                    message: msg,
                }),
            );
        } finally {
            setPending(false);
        }
    };

    return {
        login,
        pending,
        error,
    };
};
