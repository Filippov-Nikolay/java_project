import { configureStore } from "@reduxjs/toolkit";

import { modalReducer } from "@features/modals/model/modalSlice";
import { notificationsReducer } from "@features/notifications/model/notificationSlice";
import { themeReducer } from "@features/theme/model/themeSlice";

export const store = configureStore({
  reducer: {
    modals: modalReducer,
    notifications: notificationsReducer,
    theme: themeReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
