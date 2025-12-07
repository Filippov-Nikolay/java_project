"use client";

import { useState } from "react";
import Input from "@shared/ui/Input";
import Button from "@shared/ui/Button";
import styles from "./styles.module.scss";
import PasswordField from "../PasswordField";


export type LoginFormValues = {
    login: string;
    password: string;
};

type LoginFormProps = {
    onSubmit: (values: LoginFormValues) => void;
    pending?: boolean;
    error?: string | null;
};

export default function LoginForm({ onSubmit, pending, error }: LoginFormProps) {
    const [login, setLogin] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit({ login, password });
    };

    return (
        <form className={styles.form} onSubmit={handleSubmit}>
            <Input
                value={login}
                onChange={(e) => setLogin(e.target.value)}
                autoComplete="username"
                placeholder="E-mail або логін"
            />

            <PasswordField
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Пароль"
                autoComplete="current-password"
            />

            {error && <p className={styles.error}>{error}</p>}

            <Button
                type="submit"
                label={pending ? "Вхід..." : "Увійти"}
                disabled={pending}
            />
        </form>
    );
}
