import { useState, useEffect, useCallback } from "react";
import { userApi } from "../api/userApi";
import { User } from "./types";

export const useProfile = () => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    
    const [isAvatarSubmitting, setIsAvatarSubmitting] = useState(false);
    const [isPasswordSubmitting, setIsPasswordSubmitting] = useState(false);
    
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    const loadUser = useCallback(async () => {
        try {
            const data = await userApi.getMe();
            setUser(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { loadUser(); }, [loadUser]);

    const handleAvatarUpload = async (file: File) => {
        setIsAvatarSubmitting(true);
        try {
            const res = await userApi.updateAvatar(file);
            if (res.ok) {
                await loadUser();
            } else {
                alert("Помилка завантаження аватара");
            }
        } catch (err) {
            alert("Сервер недоступний");
        } finally {
            setIsAvatarSubmitting(false);
        }
    };

    const handlePasswordUpdate = async (password: string, confirm: string) => {
        setMessage(null);
        if (password.length < 6) {
            setMessage({ type: 'error', text: 'Пароль має бути не менше 6 символів' });
            return;
        }
        if (password !== confirm) {
            setMessage({ type: 'error', text: 'Паролі не збігаються' });
            return;
        }

        setIsPasswordSubmitting(true);
        try {
            const res = await userApi.updatePassword(password);
            if (res.ok) {
                setMessage({ type: 'success', text: 'Пароль успішно змінено!' });
            } else {
                setMessage({ type: 'error', text: 'Не вдалося оновити пароль' });
            }
        } catch (err) {
            setMessage({ type: 'error', text: 'Сервер недоступний' });
        } finally {
            setIsPasswordSubmitting(false);
        }
    };

    const initials = user ? `${user.firstName?.[0]}${user.lastName?.[0]}`.toUpperCase() : "??";

    return { 
        user, 
        loading, 
        isAvatarSubmitting, 
        isPasswordSubmitting, 
        message, 
        initials, 
        handleAvatarUpload, 
        handlePasswordUpdate 
    };
};