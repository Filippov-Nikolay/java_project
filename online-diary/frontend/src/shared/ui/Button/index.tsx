"use client";

import type {
    ButtonHTMLAttributes,
    ReactNode,
} from "react";

import styles from "./styles.module.scss";

type IconPosition = "left" | "right";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
    label?: string;
    icon?: ReactNode;
    iconPosition?: IconPosition;
    isLoading?: boolean;
};

export default function Button({
    label,
    children,
    icon,
    iconPosition = "left",
    isLoading = false,
    className,
    disabled,
    ...rest
}: ButtonProps) {
    const textContent = label ?? children;
    const mergedClassName = [styles.button, className].filter(Boolean).join(" ");
    const showIcon = icon && !isLoading;

    return (
        <button
            type="button"
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
