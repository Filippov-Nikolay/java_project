"use client";

import type { ReactNode } from "react";

import { openModal } from "@features/modals/model/modalSlice";
import { showNotification } from "@features/notifications/model/notificationSlice";
import type { NotificationStatus } from "@features/notifications/model/types";
import Button from "@shared/ui/Button";
import ThemeToggle from "@features/theme/ui/ThemeToggle";
import { useAppDispatch } from "@shared/store/hooks";

import styles from "./styles.module.scss";

const notificationMessages: Record<NotificationStatus, string> = {
    successful: "Dev check: successful notification.",
    warning: "Dev check: warning notice.",
    error: "Dev check: error state surfaced.",
    default: "Dev check: neutral info.",
};

type ShowcaseEntry = {
    id?: string;
    addedAt: string; // YYYY-MM-DD
    title: string;
    description: string;
    render: () => ReactNode;
};

const TWO_DAYS_MS = 2 * 24 * 60 * 60 * 1000;
const parseDateSafe = (date: string) => {
    const ms = Date.parse(`${date}T00:00:00`);
    return Number.isFinite(ms) ? ms : 0;
};
const isNewEntry = (date: string, now: number) => {
    const ms = parseDateSafe(date);
    if (!ms) return false;
    return now - ms < TWO_DAYS_MS;
};

export default function DevPlaygroundPage() {
    const dispatch = useAppDispatch();
    const now = Date.now();

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

    const showcase: ShowcaseEntry[] = [
        {
            id: "theme-toggle",
            addedAt: "2025-04-12",
            title: "Переключатель темы",
            description: "Кнопка с сохранением выбора и моментальной инициализацией темы.",
            render: () => <ThemeToggle />,
        },
        {
            id: "notifications-all",
            addedAt: "2025-04-12",
            title: "Уведомления (все статусы)",
            description: "Четыре кнопки для всех статусов в одном месте.",
            render: () => (
                <div className={styles.row}>
                    {(["successful", "warning", "error", "default"] as NotificationStatus[]).map(
                        (status) => (
                            <Button
                                key={status}
                                label={`Показать ${status}`}
                                onClick={() => triggerNotification(status)}
                            />
                        ),
                    )}
                </div>
            ),
        },
        {
            id: "modal-confirm",
            addedAt: "2025-04-12",
            title: "Модал: confirmation",
            description: "Проверка открытия/закрытия модала подтверждения.",
            render: () => (
                <Button label="Открыть confirmation" onClick={triggerModal} />
            ),
        },
        {
            id: "button-demo",
            addedAt: "2025-04-12",
            title: "Новая кнопка (UI)",
            description: "Градиентная кнопка с темой, иконкой, загрузкой.",
            render: () => (
                <div className={styles.row}>
                    <Button label="Обычная кнопка" />
                    <Button
                        label="С иконкой"
                        icon="⭐"
                        iconPosition="left"
                        onClick={() => triggerNotification("successful")}
                    />
                    <Button label="Загрузка..." isLoading />
                </div>
            ),
        },
    ];

    const newEntries = showcase
        .filter((entry) => isNewEntry(entry.addedAt, now))
        .sort((a, b) => parseDateSafe(b.addedAt) - parseDateSafe(a.addedAt));

    const oldEntries = showcase
        .filter((entry) => !isNewEntry(entry.addedAt, now))
        .sort((a, b) => parseDateSafe(b.addedAt) - parseDateSafe(a.addedAt));

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

            <section className={`${styles.card} ${styles.newSection}`}>
                <div className={styles.sectionHeader}>
                    <h2>New</h2>
                    <span className={styles.hint}>компоненты за последние 2 дня</span>
                </div>
                <div className={styles.newList}>
                    {newEntries.length === 0 ? (
                        <p className={styles.newItemDescription}>Новых компонентов нет.</p>
                    ) : (
                        newEntries.map((item) => (
                            <div key={item.id ?? item.title} className={styles.newItem}>
                                <div className={styles.newItemHeader}>
                                    <div>
                                        <p className={styles.newItemTitle}>{item.title}</p>
                                        <p className={styles.newItemDate}>
                                            Добавлено: {item.addedAt}
                                        </p>
                                    </div>
                                    <span className={styles.badgeNew}>NEW</span>
                                </div>
                                <p className={styles.newItemDescription}>{item.description}</p>
                                <div className={styles.newContent}>{item.render()}</div>
                            </div>
                        ))
                    )}
                </div>
            </section>

            <section className={styles.card}>
                <div className={styles.sectionHeader}>
                    <h2>Остальные</h2>
                    <span className={styles.hint}>отсортированы по дате добавления</span>
                </div>
                <div className={styles.newList}>
                    {oldEntries.length === 0 ? (
                        <p className={styles.newItemDescription}>Нет старых компонентов.</p>
                    ) : (
                        oldEntries.map((item) => (
                            <div key={item.id ?? item.title} className={styles.newItem}>
                                <div className={styles.newItemHeader}>
                                    <div>
                                        <p className={styles.newItemTitle}>{item.title}</p>
                                        <p className={styles.newItemDate}>
                                            Добавлено: {item.addedAt}
                                        </p>
                                    </div>
                                </div>
                                <p className={styles.newItemDescription}>{item.description}</p>
                                <div className={styles.newContent}>{item.render()}</div>
                            </div>
                        ))
                    )}
                </div>
            </section>
        </main>
    );
}
