"use client";

import BaseModal from "@features/modals/ui/BaseModal";

import styles from "./styles.module.scss";

type ContactViewModalProps = {
    data?: {
        name?: string;
        email?: string;
    };
    isTop: boolean;
    onClose: () => void;
};

export default function ContactViewModal({ data, isTop, onClose }: ContactViewModalProps) {
    return (
        <BaseModal title="Contact details" isTop={isTop} onClose={onClose}>
            <dl className={styles.list}>
                <div>
                    <dt>Name</dt>
                    <dd>{data?.name ?? "Unknown"}</dd>
                </div>
                <div>
                    <dt>Email</dt>
                    <dd>{data?.email ?? "—"}</dd>
                </div>
            </dl>
        </BaseModal>
    );
}
