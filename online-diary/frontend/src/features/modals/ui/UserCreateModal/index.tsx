"use client";

import BaseModal from "@features/modals/ui/BaseModal";

import styles from "./styles.module.scss";

type UserCreateModalProps = {
  data?: {
    presetRole?: string;
  };
  isTop: boolean;
  onClose: () => void;
};

export default function UserCreateModal({ data, isTop, onClose }: UserCreateModalProps) {
  return (
    <BaseModal title="Create user" isTop={isTop} onClose={onClose}>
      <div className={styles.row}>Preset role: {data?.presetRole ?? "not set"}</div>
      <p className={styles.hint}>Add a form here to capture user details.</p>
    </BaseModal>
  );
}
