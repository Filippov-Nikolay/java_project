"use client";

import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@shared/store/hooks";
import { selectThemeMode } from "@features/theme/model/selectors";
import { setTheme } from "@features/theme/model/themeSlice";
import type { ThemeMode } from "@features/theme/model/types";

const STORAGE_KEY = "theme-mode";

export default function ThemeWatcher() {
  const mode = useAppSelector(selectThemeMode);
  const dispatch = useAppDispatch();

  // 1) При маунте читаем то, что уже поставил inline-скрипт (или fallback)
  useEffect(() => {
    if (typeof document === "undefined") return;

    const attr = document.documentElement.getAttribute("data-theme");
    let initial: ThemeMode = attr === "dark" ? "dark" : "light";

    if (initial !== mode) {
      dispatch(setTheme(initial));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 2) Любое изменение mode → в html + localStorage
  useEffect(() => {
    if (typeof document === "undefined") return;

    document.documentElement.setAttribute("data-theme", mode);
    try {
      window.localStorage.setItem(STORAGE_KEY, mode);
    } catch {
      // ignore
    }
  }, [mode]);

  return null;
}
