import { ReactNode } from "react";
import styles from "./styles.module.scss";

interface DashboardRowItemProps {
  title: ReactNode;
  meta?: ReactNode;      // всё, что идёт мелким текстом под заголовком
  icon?: ReactNode;      // эмодзи / иконка слева (опционально)
  iconColor?: string;    // фон для иконки (опционально)
  rightSlot?: ReactNode; // что-то справа (кнопка, статус и т.п.)
  className?: string;
}

export const DashboardRowItem = ({
  title,
  meta,
  icon,
  iconColor,
  rightSlot,
  className,
}: DashboardRowItemProps) => {
  const rootClassName = [
    styles.root,
    icon ? styles.withIcon : styles.noIcon,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={rootClassName}>
      {icon && (
        <div className={styles.iconWrapper}>
          <div
            className={styles.icon}
            style={iconColor ? { backgroundColor: iconColor } : undefined}
          >
            {icon}
          </div>
        </div>
      )}

      <div className={styles.middle}>
        <div className={styles.title}>{title}</div>
        {meta && <div className={styles.meta}>{meta}</div>}
      </div>

      {rightSlot && <div className={styles.right}>{rightSlot}</div>}
    </div>
  );
};