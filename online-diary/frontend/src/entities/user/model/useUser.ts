// src/entities/user/model/useUser.ts

import { useState, useEffect } from "react";
import { User } from "./types";
import { userApi } from "../api/userApi";

export const useUser = () => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const token = localStorage.getItem("token");

        if (!token) {
            setIsLoading(false);
            return;
        }

        userApi.getMe(token)
            .then(data => setUser(data))
            .catch(err => setError(err.message))
            .finally(() => setIsLoading(false));
    }, []);

    const initials = user 
        ? `${user.firstName[0] || ''}${user.lastName[0] || ''}`.toUpperCase() 
        : "??";

    return { initials, user, isLoading, error };
};