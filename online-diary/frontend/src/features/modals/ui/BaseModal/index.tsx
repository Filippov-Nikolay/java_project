"use client";

import type { ReactNode } from "react";

import styles from "./styles.module.scss";

type BaseModalProps = {
  title?: string;
  children: ReactNode;
  isTop: boolean;
  onClose: () => void;
};

export default function BaseModal({ title, children, isTop, onClose }: BaseModalProps) {
  return (
    <div
      className={`${styles.overlay} ${isTop ? styles.overlayTop : styles.overlayStacked}`}
      onClick={isTop ? onClose : undefined}
      aria-hidden
    >
      <div
        className={`${styles.modal} ${isTop ? styles.modalTop : styles.modalStacked}`}
        onClick={(event) => event.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        {title ? <h3 className={styles.title}>{title}</h3> : null}
        <div className={styles.content}>{children}</div>
        {isTop ? (
          <button className={styles.closeButton} type="button" onClick={onClose}>
            Close
          </button>
        ) : null}
      </div>
    </div>
  );
}
