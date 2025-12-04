"use client";

import { toggleTheme } from "@features/theme/model/themeSlice";
import { selectThemeMode } from "@features/theme/model/selectors";
import { useAppDispatch, useAppSelector } from "@shared/store/hooks";

import styles from "./styles.module.scss";

export default function ThemeToggle() {
    const dispatch = useAppDispatch();
    const mode = useAppSelector(selectThemeMode);

    return (
        <button
            type="button"
            className={styles.toggle}
            suppressHydrationWarning
            aria-label={mode === "dark" ? "Темная тема" : "Светлая тема"}
            onClick={() => dispatch(toggleTheme())}
        />
    );
}
