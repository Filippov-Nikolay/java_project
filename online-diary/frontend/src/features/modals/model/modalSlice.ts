import { createSlice, nanoid, type PayloadAction } from "@reduxjs/toolkit";

import type { ModalItem, ModalState } from "./types";

const initialState: ModalState = {
  stack: [],
};

const modalSlice = createSlice({
  name: "modals",
  initialState,
  reducers: {
    openModal: (state, action: PayloadAction<Omit<ModalItem, "id">>) => {
      const id = nanoid();
      state.stack.push({ id, ...action.payload });
    },
    closeModal: (state, action: PayloadAction<{ id?: string } | undefined>) => {
      const id = action?.payload?.id;
      if (!id) {
        state.stack.pop();
        return;
      }

      state.stack = state.stack.filter((modal) => modal.id !== id);
    },
    closeAllModals: (state) => {
      state.stack = [];
    },
  },
});

export const { openModal, closeModal, closeAllModals } = modalSlice.actions;
export const modalReducer = modalSlice.reducer;
