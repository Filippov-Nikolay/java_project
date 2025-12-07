"use client";

import type { InputHTMLAttributes } from "react";
import styles from "./styles.module.scss";

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
    label?: string;
    error?: string;
};

export default function Input({
    label,
    error,
    className,
    ...rest
}: InputProps) {
    const rootClassName = [styles.root, className].filter(Boolean).join(" ");
    const inputClassName = [
        styles.input,
        error ? styles.inputError : null,
    ]
        .filter(Boolean)
        .join(" ");

    return (
        <label className={rootClassName}>
            {label && <span className={styles.label}>{label}</span>}
            <input className={inputClassName} {...rest} />
            {error && <span className={styles.error}>{error}</span>}
        </label>
    );
}
