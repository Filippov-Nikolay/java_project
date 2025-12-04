"use client";

import { openModal } from "@features/modals/model/modalSlice";
import { showNotification } from "@features/notifications/model/notificationSlice";
import type { NotificationStatus } from "@features/notifications/model/types";
import { buildShowcase, type ShowcaseEntry } from "@app/dev/helpers/showcase";
import ThemeToggle from "@features/theme/ui/ThemeToggle";
import { useAppDispatch } from "@shared/store/hooks";

import styles from "./styles.module.scss";

const TWO_DAYS_MS = 2 * 24 * 60 * 60 * 1000;

const parseDateSafe = (date: string) => {
    const parts = date.split("-").map(Number);
    if (parts.length !== 3) return 0;
    const [year, month, day] = parts;
    if (!year || !month || !day) return 0;
    return Date.UTC(year, month - 1, day);
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
                message: `Dev check: ${status} notification`,
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

    const showcase: ShowcaseEntry[] = buildShowcase({
        onNotify: triggerNotification,
        onOpenConfirm: triggerModal,
    });

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
