"use client";

import { openModal } from "@features/modals/model/modalSlice";
import { showNotification } from "@features/notifications/model/notificationSlice";
import type { NotificationStatus } from "@features/notifications/model/types";
import ThemeToggle from "@features/theme/ui/ThemeToggle";
import { useAppDispatch } from "@shared/store/hooks";

import styles from "./styles.module.scss";

const notificationMessages: Record<NotificationStatus, string> = {
    successful: "Dev check: successful notification.",
    warning: "Dev check: warning notice.",
    error: "Dev check: error state surfaced.",
    default: "Dev check: neutral info.",
};

export default function DevPlaygroundPage() {
    const dispatch = useAppDispatch();

    const triggerNotification = (status: NotificationStatus) => {
        dispatch(
            showNotification({
                status,
                message: notificationMessages[status],
            }),
        );
    };

    const triggerModal = () => {
        dispatch(
            openModal({
                type: "CONFIRMATION",
                data: {
                    text: "Тестовый модал подтверждения.",
                    onConfirmAction: { type: "devConfirm" },
                },
            }),
        );
    };

    return (
        <main className={styles.page}>
            <header className={styles.header}>
                <div>
                    <p className={styles.badge}>Dev only</p>
                    <h1 className={styles.title}>Dev Playground</h1>
                    <p className={styles.subtitle}>
                        Быстрые проверки модалок, уведомлений и темы (light/dark).
                    </p>
                </div>
                <ThemeToggle />
            </header>

            <section className={styles.card}>
                <div className={styles.sectionHeader}>
                    <h2>Уведомления</h2>
                    <span className={styles.hint}>
                        статусы, анимация появления/закрытия, автоскрытие
                    </span>
                </div>
                <div className={styles.grid}>
                    {(Object.keys(notificationMessages) as NotificationStatus[]).map(
                        (status) => (
                            <button
                                key={status}
                                type="button"
                                onClick={() => triggerNotification(status)}
                                className={styles.button}
                            >
                                Показать: {status}
                            </button>
                        ),
                    )}
                </div>
            </section>

            <section className={styles.card}>
                <div className={styles.sectionHeader}>
                    <h2>Модалки</h2>
                    <span className={styles.hint}>проверка стека и закрытия</span>
                </div>
                <div className={styles.row}>
                    <button
                        type="button"
                        onClick={triggerModal}
                        className={styles.button}
                    >
                        Открыть confirmation
                    </button>
                </div>
            </section>
        </main>
    );
}
