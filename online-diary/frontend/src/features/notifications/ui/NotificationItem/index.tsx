import { useEffect, useState } from "react";

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

export default function NotificationItem({
    message,
    status,
    duration = 5000,
    onRemove,
}: NotificationItemProps) {
    const [closing, setClosing] = useState(false);

    useEffect(() => {
        const timerId = setTimeout(() => startClose(), duration);
        return () => clearTimeout(timerId);
    }, [duration]);

    const startClose = () => {
        if (closing) return;
        setClosing(true);
        setTimeout(onRemove, 220);
    };

    return (
        <div
            className={`${styles.notification} ${styles[status]} ${
                closing ? styles.closing : ""
            }`}
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
