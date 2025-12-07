import styles from "./styles.module.scss";

interface LogoMarkProps {
  /** Текст внутри квадратика, по умолчанию JB */
  text?: string;
}

export default function LogoMark({ text = "JB" }: LogoMarkProps) {
  return <span className={styles.logoMark}>{text}</span>;
}