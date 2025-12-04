"use client";

import NotificationItem from "@features/notifications/ui/NotificationItem";
import { removeNotification } from "@features/notifications/model/notificationSlice";
import { selectNotifications } from "@features/notifications/model/selectors";
import { useAppDispatch, useAppSelector } from "@shared/store/hooks";

import styles from "./styles.module.scss";

export default function NotificationRoot() {
    const dispatch = useAppDispatch();
    const notifications = useAppSelector(selectNotifications);

    if (!notifications.length) return null;

    return (
        <div className={styles.container}>
            {notifications.map((notification) => (
                <NotificationItem
                    key={notification.id}
                    message={notification.message}
                    status={notification.status}
                    onRemove={() =>
                        dispatch(removeNotification({ id: notification.id }))
                    }
                />
            ))}
        </div>
    );
}
