"use client";

import { ReactNode, useEffect } from "react";
import styles from "./styles.module.scss";
import { createPortal } from "react-dom";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}

export const Modal = ({ isOpen, onClose, title, children }: ModalProps) => {

  useEffect(() => {
    if (isOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "unset";
  }, [isOpen]);

  if (!isOpen) return null;

  return createPortal(
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.content} onClick={(e) => e.stopPropagation()}>
        <header className={styles.header}>
          <h3>{title}</h3>
          <button className={styles.close} onClick={onClose}>&times;</button>
        </header>
        <div className={styles.body}>{children}</div>
      </div>
    </div>,
    document.body
  );
};