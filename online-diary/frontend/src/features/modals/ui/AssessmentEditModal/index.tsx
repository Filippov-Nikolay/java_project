"use client";

import BaseModal from "@features/modals/ui/BaseModal";

import styles from "./styles.module.scss";

type AssessmentEditModalProps = {
  data?: {
    assessmentId?: number;
  };
  isTop: boolean;
  onClose: () => void;
};

export default function AssessmentEditModal({ data, isTop, onClose }: AssessmentEditModalProps) {
  return (
    <BaseModal title="Edit assessment" isTop={isTop} onClose={onClose}>
      <div className={styles.row}>Assessment ID: {data?.assessmentId ?? "—"}</div>
      <p className={styles.hint}>Here you can load assessment details and show a form.</p>
    </BaseModal>
  );
}
