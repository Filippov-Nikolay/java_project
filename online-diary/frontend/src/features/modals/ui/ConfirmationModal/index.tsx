"use client";

import BaseModal from "@features/modals/ui/BaseModal";
import type { ModalComponentProps } from "@features/modals/model/types";

import styles from "./styles.module.scss";

type ConfirmationModalProps = ModalComponentProps;

export default function ConfirmationModal({
    data,
    isTop,
    onClose,
}: ConfirmationModalProps) {
    const { text, onConfirmLabel } = (data || {}) as {
        text?: string;
        onConfirmLabel?: string;
    };

    const handleConfirm = () => {
        onClose();
    };

    return (
        <BaseModal title="Confirm action" isTop={isTop} onClose={onClose}>
            <p className={styles.text}>{text ?? "Are you sure?"}</p>
            {isTop ? (
                <div className={styles.actions}>
                    <button className={styles.secondary} type="button" onClick={onClose}>
                        Cancel
                    </button>
                    <button className={styles.primary} type="button" onClick={handleConfirm}>
                        {onConfirmLabel ?? "Confirm"}
                    </button>
                </div>
            ) : null}
        </BaseModal>
    );
}
