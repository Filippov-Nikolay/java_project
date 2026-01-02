"use client";

import type {
    ButtonHTMLAttributes,
    ReactNode,
} from "react";

import styles from "./styles.module.scss";

type IconPosition = "left" | "right";
// 1. Описываем допустимые варианты
type ButtonVariant = "primary" | "secondary" | "outline" | "ghost"; 

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
    label?: string;
    icon?: ReactNode;
    iconPosition?: IconPosition;
    isLoading?: boolean;
    variant?: ButtonVariant; // 2. Добавляем в типы
};

export default function Button({
    label,
    children,
    icon,
    iconPosition = "left",
    isLoading = false,
    variant = "primary", // 3. Значение по умолчанию
    className,
    disabled,
    type,
    ...rest
}: ButtonProps) {
    const textContent = label ?? children;
    
    // 4. Добавляем styles[variant] в список классов
    const mergedClassName = [
        styles.button, 
        styles[variant], 
        className
    ].filter(Boolean).join(" ");
    
    const showIcon = icon && !isLoading;

    return (
        <button
            type={type ?? "button"} 
            className={mergedClassName}
            disabled={disabled || isLoading}
            {...rest}
        >
            {isLoading ? (
                <span className={styles.loading}>
                    <span className={styles.spinner} aria-hidden />
                    <span>Загрузка...</span>
                </span>
            ) : (
                <span className={styles.content}>
                    {showIcon && iconPosition === "left" ? (
                        <span className={styles.icon}>{icon}</span>
                    ) : null}
                    {textContent}
                    {showIcon && iconPosition === "right" ? (
                        <span className={styles.icon}>{icon}</span>
                    ) : null}
                </span>
            )}
        </button>
    );
}