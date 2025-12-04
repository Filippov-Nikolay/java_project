"use client";

import { openModal } from "@features/modals/model/modalSlice";
import { showNotification } from "@features/notifications/model/notificationSlice";
import type { NotificationStatus } from "@features/notifications/model/types";
import { useAppDispatch } from "@shared/store/hooks";

export default function DashboardPage() {
    const dispatch = useAppDispatch();

    const handleEdit = (assessmentId: number) => {
        dispatch(
            openModal({
                type: "CONFIRMATION",
                data: {
                    text: "Удалить выбранную оценку?",
                    onConfirmAction: { type: "deleteAssessment", id: assessmentId },
                },
            }),
        );
    };

    const handleNotify = (status: NotificationStatus) => {
        const messageMap: Record<NotificationStatus, string> = {
            successful: "Действие выполнено успешно.",
            warning: "Обратите внимание: требуется проверка.",
            error: "Произошла ошибка. Попробуйте снова.",
            default: "Информационное уведомление.",
        };

        dispatch(
            showNotification({
                status,
                message: messageMap[status],
            }),
        );
    };

    return (
        <div>
            <h1>Dashboard overview placeholder</h1>

            <button type="button" onClick={() => handleEdit(1)}>
                Click me for call modal!
            </button>

            <div style={{ display: "grid", gap: "8px", marginTop: "16px" }}>
                <button type="button" onClick={() => handleNotify("successful")}>
                    Show success notification
                </button>
                <button type="button" onClick={() => handleNotify("warning")}>
                    Show warning notification
                </button>
                <button type="button" onClick={() => handleNotify("error")}>
                    Show error notification
                </button>
                <button type="button" onClick={() => handleNotify("default")}>
                    Show default notification
                </button>
            </div>
        </div>
    );
}
