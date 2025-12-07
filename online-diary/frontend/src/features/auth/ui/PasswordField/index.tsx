"use client";

import { useState } from "react";
import type { ChangeEventHandler } from "react";
import styles from "./styles.module.scss";
import Input from "@shared/ui/Input";


type PasswordFieldProps = {
    value: string;
    onChange: ChangeEventHandler<HTMLInputElement>;
    placeholder?: string;
    autoComplete?: string;
};

export default function PasswordField({
    value,
    onChange,
    placeholder = "Пароль",
    autoComplete = "current-password",
}: PasswordFieldProps) {
    const [visible, setVisible] = useState(false);

    return (
        <div className={styles.wrapper}>
            <Input
                type={visible ? "text" : "password"}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                autoComplete={autoComplete}
                className={styles.input} // дадим дополнительный padding справа
            />

            <button
                type="button"
                className={styles.eye}
                onClick={() => setVisible((prev) => !prev)}
                aria-label={visible ? "Сховати пароль" : "Показати пароль"}
            >
                {visible ? (
                    <svg viewBox="0 0 24 24" className={styles.icon} aria-hidden="true">
                        <path
                            d="M3 12s2.5-5 9-5 9 5 9 5-2.5 5-9 5-9-5-9-5z"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.6"
                        />
                        <circle
                            cx="12"
                            cy="12"
                            r="3"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.6"
                        />
                    </svg>
                ) : (
                    <svg viewBox="0 0 24 24" className={styles.icon} aria-hidden="true">
                        <path
                            d="M3 12s2.5-5 9-5 9 5 9 5-2.5 5-9 5-9-5-9-5z"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.6"
                        />
                        <circle
                            cx="12"
                            cy="12"
                            r="3"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.6"
                        />
                        <line
                            x1="4"
                            y1="4"
                            x2="20"
                            y2="20"
                            stroke="currentColor"
                            strokeWidth="1.6"
                        />
                    </svg>
                )}
            </button>
        </div>
    );
}
