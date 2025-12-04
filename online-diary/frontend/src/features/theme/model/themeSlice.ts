import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

import type { ThemeMode, ThemeState } from "./types";

const getInitialTheme = (): ThemeMode => {
    if (typeof window === "undefined") return "light";

    const attr = document.documentElement.getAttribute("data-theme");
    if (attr === "dark" || attr === "light") return attr;

    const stored = window.localStorage.getItem("theme-mode");
    if (stored === "dark" || stored === "light") return stored;

    const prefersDark = window.matchMedia?.("(prefers-color-scheme: dark)")?.matches;
    return prefersDark ? "dark" : "light";
};

const initialState: ThemeState = {
    mode: getInitialTheme(),
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
