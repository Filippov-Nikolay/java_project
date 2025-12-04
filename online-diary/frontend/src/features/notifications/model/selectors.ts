import type { RootState } from "@shared/store/store";

export const selectNotifications = (state: RootState) =>
    state.notifications.queue;
