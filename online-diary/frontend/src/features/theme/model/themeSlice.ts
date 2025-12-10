import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { ThemeMode, ThemeState } from "./types";

const initialState: ThemeState = {
  mode: "light", // реальное значение подтянет ThemeWatcher
};

const themeSlice = createSlice({
  name: "theme",
  initialState,
  reducers: {
    setTheme: (state, action: PayloadAction<ThemeMode>) => {
      state.mode = action.payload;
    },
    toggleTheme: (state) => {
      state.mode = state.mode === "light" ? "dark" : "light";
    },
  },
});

export const { setTheme, toggleTheme } = themeSlice.actions;
export const themeReducer = themeSlice.reducer;
