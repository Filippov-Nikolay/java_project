import type { RootState } from "@shared/store/store";

export const selectThemeMode = (state: RootState) => state.theme.mode;
