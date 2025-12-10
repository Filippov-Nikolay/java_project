import type { ReactNode } from "react";
import styles from "./styles.module.scss";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return <div className={styles.authLayout}>{children}</div>;
}
