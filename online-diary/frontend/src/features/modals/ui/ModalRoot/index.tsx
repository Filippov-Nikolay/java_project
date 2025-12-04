"use client";

import React, {
    JSX,
    useEffect,
    useState,
    ComponentType,
} from "react";
import AssessmentEditModal from "@features/modals/ui/AssessmentEditModal";
import ConfirmationModal from "@features/modals/ui/ConfirmationModal";
import ContactViewModal from "@features/modals/ui/ContactViewModal";
import UserCreateModal from "@features/modals/ui/UserCreateModal";
import { closeModal } from "@features/modals/model/modalSlice";
import { selectModalStack } from "@features/modals/model/selectors";
import type {
    ModalComponentProps,
    ModalType,
} from "@features/modals/model/types";
import { useAppDispatch, useAppSelector } from "@shared/store/hooks";

import styles from "./styles.module.scss";

type ModalComponent = ComponentType<ModalComponentProps>;

const modalMap: Record<ModalType, ModalComponent> = {
    ASSESSMENT_EDIT: AssessmentEditModal,
    USER_CREATE: UserCreateModal,
    CONFIRMATION: ConfirmationModal,
    CONTACT_VIEW: ContactViewModal,
};

export default function ModalRoot() {
    const dispatch = useAppDispatch();
    const stack = useAppSelector(selectModalStack);

    const [mounted, setMounted] = useState(false);
    useEffect(() => setMounted(true), []);

    if (!mounted || !stack.length) return null;

    return (
        <div className={styles.root}>
            {stack.map((modal, index) => {
                const Component = modalMap[modal.type];
                const isTop = index === stack.length - 1;

                if (!Component) return null;

                return (
                    <Component
                        key={modal.id}
                        data={modal.data}
                        isTop={isTop}
                        onClose={() => dispatch(closeModal({ id: modal.id }))}
                    />
                );
            })}
        </div>
    );
}
