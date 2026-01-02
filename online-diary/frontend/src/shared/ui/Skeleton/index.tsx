// shared/ui/Skeleton/Skeleton.tsx
import { CSSProperties } from "react";
import styles from "./styles.module.scss";

interface SkeletonProps {
  width?: string | number;
  height?: string | number;
  borderRadius?: string | number;
  className?: string;
  style?: CSSProperties; // Добавляем поддержку стилей
}

export const Skeleton = ({ width, height, borderRadius, className, style }: SkeletonProps) => {
  return (
    <div 
      className={`${styles.skeleton} ${className ?? ""}`}
      style={{ width, height, borderRadius, ...style }} // Мержим стили
    />
  );
};