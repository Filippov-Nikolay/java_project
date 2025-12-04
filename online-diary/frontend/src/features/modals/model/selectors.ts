import type { RootState } from "@shared/store/store";

export const selectModalStack = (state: RootState) => state.modals.stack;

export const selectTopModal = (state: RootState) => {
  const { stack } = state.modals;
  return stack[stack.length - 1] ?? null;
};
