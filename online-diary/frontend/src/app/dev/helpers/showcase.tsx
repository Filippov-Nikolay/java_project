import type { CSSProperties, ReactNode } from "react";

import { showNotification } from "@features/notifications/model/notificationSlice";
import type { NotificationStatus } from "@features/notifications/model/types";
import ThemeToggle from "@features/theme/ui/ThemeToggle";
import Button from "@shared/ui/Button";

export type ShowcaseEntry = {
    id?: string;
    addedAt: string; // YYYY-MM-DD
    title: string;
    description: string;
    render: () => ReactNode;
};

type BuildShowcaseParams = {
    onNotify: (status: NotificationStatus) => void;
    onOpenConfirm: () => void;
};

const rowStyle: CSSProperties = {
    display: "flex",
    gap: "12px",
    flexWrap: "wrap",
};

export const buildShowcase = ({
    onNotify,
    onOpenConfirm,
}: BuildShowcaseParams): ShowcaseEntry[] => [
    {
        id: "theme-toggle",
        addedAt: "2025-12-04",
        title: "Переключатель темы",
        description: "Кнопка с сохранением выбора и моментальной инициализацией темы.",
        render: () => <ThemeToggle />,
    },
    {
        id: "notifications-all",
        addedAt: "2025-12-04",
        title: "Уведомления (все статусы)",
        description: "Четыре кнопки для всех статусов в одном месте.",
        render: () => (
            <div style={rowStyle}>
                {(["successful", "warning", "error", "default"] as NotificationStatus[]).map(
                    (status) => (
                        <Button
                            key={status}
                            label={`Показать ${status}`}
                            onClick={() => onNotify(status)}
                        />
                    ),
                )}
            </div>
        ),
    },
    {
        id: "modal-confirm",
        addedAt: "2025-12-04",
        title: "Модал: confirmation",
        description: "Проверка открытия/закрытия модала подтверждения.",
        render: () => <Button label="Открыть confirmation" onClick={onOpenConfirm} />,
    },
    {
        id: "button-demo",
        addedAt: "2025-12-04",
        title: "Новая кнопка (UI)",
        description: "Градиентная кнопка с темой, иконкой, загрузкой.",
        render: () => (
            <div style={rowStyle}>
                <Button label="Обычная кнопка" />
                <Button
                    label="С иконкой"
                    icon="⭐"
                    iconPosition="left"
                    onClick={() => onNotify("successful")}
                />
                <Button label="Загрузка..." isLoading />
            </div>
        ),
    },
];
