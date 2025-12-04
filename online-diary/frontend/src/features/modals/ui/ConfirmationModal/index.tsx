"use client";

import BaseModal from "@features/modals/ui/BaseModal";

import styles from "./styles.module.scss";

type ConfirmationModalProps = {
  data?: {
    text?: string;
    onConfirmLabel?: string;
  };
  isTop: boolean;
  onClose: () => void;
};

export default function ConfirmationModal({ data, isTop, onClose }: ConfirmationModalProps) {
  const handleConfirm = () => {
    onClose();
  };

  return (
    <BaseModal title="Confirm action" isTop={isTop} onClose={onClose}>
      <p className={styles.text}>{data?.text ?? "Are you sure?"}</p>
      {isTop ? (
        <div className={styles.actions}>
          <button className={styles.secondary} type="button" onClick={onClose}>
            Cancel
          </button>
          <button className={styles.primary} type="button" onClick={handleConfirm}>
            {data?.onConfirmLabel ?? "Confirm"}
          </button>
        </div>
      ) : null}
    </BaseModal>
  );
}
