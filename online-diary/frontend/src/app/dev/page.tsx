"use client";

import { openModal } from "@features/modals/model/modalSlice";
import { showNotification } from "@features/notifications/model/notificationSlice";
import type { NotificationStatus } from "@features/notifications/model/types";
import { useAppDispatch } from "@shared/store/hooks";

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
        <main
            style={{
                padding: "24px",
                display: "grid",
                gap: "20px",
                maxWidth: "960px",
                margin: "0 auto",
            }}
        >
            <header style={{ display: "grid", gap: "8px" }}>
                <h1 style={{ margin: 0 }}>Dev Playground</h1>
                <p style={{ margin: 0, color: "#475569" }}>
                    Страница только для разработчиков: быстрый чек модалок и
                    уведомлений.
                </p>
            </header>

            <section
                style={{
                    border: "1px solid #e2e8f0",
                    borderRadius: "12px",
                    padding: "16px",
                    display: "grid",
                    gap: "12px",
                }}
            >
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <h2 style={{ margin: 0, fontSize: "18px" }}>Уведомления</h2>
                    <span style={{ color: "#94a3b8", fontSize: "14px" }}>
                        проверка статусов + автозакрытие
                    </span>
                </div>

                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
                        gap: "10px",
                    }}
                >
                    {(Object.keys(notificationMessages) as NotificationStatus[]).map(
                        (status) => (
                            <button
                                key={status}
                                type="button"
                                onClick={() => triggerNotification(status)}
                                style={{
                                    padding: "10px 12px",
                                    borderRadius: "10px",
                                    border: "1px solid #cbd5e1",
                                    background: "#f8fafc",
                                    cursor: "pointer",
                                }}
                            >
                                Показать: {status}
                            </button>
                        ),
                    )}
                </div>
            </section>

            <section
                style={{
                    border: "1px solid #e2e8f0",
                    borderRadius: "12px",
                    padding: "16px",
                    display: "grid",
                    gap: "12px",
                }}
            >
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <h2 style={{ margin: 0, fontSize: "18px" }}>Модалки</h2>
                    <span style={{ color: "#94a3b8", fontSize: "14px" }}>
                        проверка стека и закрытия
                    </span>
                </div>

                <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
                    <button
                        type="button"
                        onClick={triggerModal}
                        style={{
                            padding: "10px 12px",
                            borderRadius: "10px",
                            border: "1px solid #cbd5e1",
                            background: "#f8fafc",
                            cursor: "pointer",
                        }}
                    >
                        Открыть confirmation
                    </button>
                </div>
            </section>
        </main>
    );
}
