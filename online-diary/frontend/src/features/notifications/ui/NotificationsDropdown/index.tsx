// src/features/notifications/ui/NotificationsDropdown/index.tsx
"use client";

import { useState } from "react";

import { useAppSelector, useAppDispatch } from "@shared/store/hooks";
import { selectNotifications } from "@features/notifications/model/selectors";
import { clearNotifications } from "@features/notifications/model/notificationSlice";
import NotificationsNoneRoundedIcon from '@mui/icons-material/NotificationsNoneRounded';

import styles from "./styles.module.scss";

export function NotificationsDropdown() {
  const dispatch = useAppDispatch();
  const notifications = useAppSelector(selectNotifications);
  const [open, setOpen] = useState(false);

  const count = notifications.length;
  const badgeText = count > 9 ? "9+" : String(count);

  const handleToggle = () => setOpen((prev) => !prev);
  const handleClear = () => dispatch(clearNotifications());

  return (
    <div className={styles.root}>
      <button
        type="button"
        className={styles.iconButton}
        aria-label="Сповіщення"
        onClick={handleToggle}
      >
        <span className={styles.bell} aria-hidden>
          <NotificationsNoneRoundedIcon/>
        </span>
        {count > 0 && <span className={styles.badge}>{badgeText}</span>}
      </button>

      {open && (
        <div className={styles.dropdown}>
          {notifications.length === 0 ? (
            <p className={styles.empty}>Немає сповіщень</p>
          ) : (
            <>
              <ul className={styles.list}>
                {notifications.map((n) => (
                  <li key={n.id} className={styles.item}>
                    <div className={styles.itemTitle}>{n.status}</div>
                    <div className={styles.itemMessage}>{n.message}</div>
                  </li>
                ))}
              </ul>

              <button
                type="button"
                className={styles.clear}
                onClick={handleClear}
              >
                Очистити все
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}
