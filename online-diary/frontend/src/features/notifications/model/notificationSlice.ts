import { createSlice, nanoid, type PayloadAction } from "@reduxjs/toolkit";

import type {
    NotificationItem,
    NotificationState,
    NotificationStatus,
} from "./types";

type ShowNotificationPayload = {
    message: string;
    status?: NotificationStatus;
};

const initialState: NotificationState = {
    queue: [],
};

const notificationsSlice = createSlice({
    name: "notifications",
    initialState,
    reducers: {
        showNotification: (
            state,
            action: PayloadAction<ShowNotificationPayload>,
        ) => {
            const id = nanoid();
            const status: NotificationStatus = action.payload.status ?? "default";

            const notification: NotificationItem = {
                id,
                message: action.payload.message,
                status,
            };

            state.queue.push(notification);
        },
        removeNotification: (state, action: PayloadAction<{ id: string }>) => {
            state.queue = state.queue.filter(
                (notification) => notification.id !== action.payload.id,
            );
        },
        clearNotifications: (state) => {
            state.queue = [];
        },
    },
});

export const {
    showNotification,
    removeNotification,
    clearNotifications,
} = notificationsSlice.actions;
export const notificationsReducer = notificationsSlice.reducer;
