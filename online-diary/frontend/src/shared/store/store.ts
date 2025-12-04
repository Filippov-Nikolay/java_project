import { configureStore } from "@reduxjs/toolkit";

import { modalReducer } from "@features/modals/model/modalSlice";

export const store = configureStore({
  reducer: {
    modals: modalReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
