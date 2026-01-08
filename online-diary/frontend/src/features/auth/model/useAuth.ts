"use client";

import { useState } from "react";
import { useAppDispatch } from "@shared/store/hooks";
import { showNotification } from "@features/notifications/model/notificationSlice";
import Cookies from "js-cookie";

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
            const res = await fetch("http://localhost:8080/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ login, password }),
            });

            if (!res.ok) {
                throw new Error("Невірний логін або пароль");
            }

            const data = await res.json(); 

            localStorage.setItem("token", data.token);
            localStorage.setItem("userRole", data.role);


            Cookies.set("token", data.token, { expires: 7, path: "/" });
            Cookies.set("userRole", data.role, { expires: 7, path: "/" });

            dispatch(
                showNotification({
                    status: "successful",
                    message: "Вхід виконано успішно!",
                }),
            );

            window.location.href = "/dashboard"; 

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


    const logout = () => {

        localStorage.removeItem("token");
        localStorage.removeItem("userRole");

        Cookies.remove("token", { path: "/" });
        Cookies.remove("userRole", { path: "/" });

        dispatch(
            showNotification({
                status: "default",
                message: "Ви вийшли з облікового запису",
            }),
        );

        window.location.href = "/auth/login";
    };

    return { login, logout, pending, error };
};