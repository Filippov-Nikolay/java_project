"use client";

import { useEffect } from "react";

import { selectThemeMode } from "@features/theme/model/selectors";
import { useAppSelector } from "@shared/store/hooks";

const STORAGE_KEY = "theme-mode";

export default function ThemeWatcher() {
    const mode = useAppSelector(selectThemeMode);

    useEffect(() => {
        if (typeof document === "undefined") return;
        document.documentElement.setAttribute("data-theme", mode);
        try {
            window.localStorage.setItem(STORAGE_KEY, mode);
            document.documentElement.style.setProperty(
                "--theme-toggle-label",
                mode === "dark" ? '"Темная тема"' : '"Светлая тема"',
            );
        } catch {
            // ignore storage errors
        }
    }, [mode]);

    return null;
}
