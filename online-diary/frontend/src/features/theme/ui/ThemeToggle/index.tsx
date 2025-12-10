"use client";

import { toggleTheme } from "@features/theme/model/themeSlice";
import { selectThemeMode } from "@features/theme/model/selectors";
import { useAppDispatch, useAppSelector } from "@shared/store/hooks";

import DarkModeRoundedIcon from "@mui/icons-material/DarkModeRounded";
import LightModeRoundedIcon from "@mui/icons-material/LightModeRounded";

import styles from "./styles.module.scss";

export default function ThemeToggle() {
  const dispatch = useAppDispatch();
  const mode = useAppSelector(selectThemeMode);

  // если сейчас dark → показываем "солнце" (переключатель на светлую)
  const Icon = mode === "dark" ? LightModeRoundedIcon : DarkModeRoundedIcon;
  const ariaLabel = mode === "dark" ? "Світла тема" : "Темна тема";

  return (
    <button
      type="button"
      className={styles.toggle}
      aria-label={ariaLabel}
      onClick={() => dispatch(toggleTheme())}
    >
      <Icon className={styles.icon} />
    </button>
  );
}
