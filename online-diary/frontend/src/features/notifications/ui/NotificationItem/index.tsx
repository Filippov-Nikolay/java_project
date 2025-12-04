import { useEffect, useRef, useState } from "react";

import type { NotificationStatus } from "@features/notifications/model/types";

import styles from "./styles.module.scss";

const statusTitle: Record<NotificationStatus, string> = {
    successful: "Success",
    warning: "Warning",
    error: "Error",
    default: "Notification",
};

type NotificationItemProps = {
    message: string;
    status: NotificationStatus;
    duration?: number;
    onRemove: () => void;
};

const CLOSE_ANIMATION_MS = 220;
const DEFAULT_DURATION_MS = 3000;

export default function NotificationItem({
    message,
    status,
    duration = DEFAULT_DURATION_MS,
    onRemove,
}: NotificationItemProps) {
    const [closing, setClosing] = useState(false);
    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const clearTimer = () => {
        if (timerRef.current) {
            clearTimeout(timerRef.current);
            timerRef.current = null;
        }
    };

    const startClose = () => {
        if (closing) return;
        clearTimer();
        setClosing(true);
        setTimeout(onRemove, CLOSE_ANIMATION_MS);
    };

    const scheduleClose = (delay: number) => {
        clearTimer();
        timerRef.current = setTimeout(startClose, delay);
    };

    useEffect(() => {
        scheduleClose(duration);
        return clearTimer;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [duration]);

    const handleMouseEnter = () => {
        if (closing) return;
        clearTimer();
    };

    const handleMouseLeave = () => {
        if (closing) return;
        scheduleClose(duration);
    };

    return (
        <div
            className={`${styles.notification} ${styles[status]} ${
                closing ? styles.closing : ""
            }`}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            <div className={styles.content}>
                <div className={styles.title}>{statusTitle[status]}</div>
                <div className={styles.message}>{message}</div>
            </div>
            <button
                type="button"
                className={styles.close}
                aria-label="Close notification"
                onClick={startClose}
            >
                ×
            </button>
        </div>
    );
}
