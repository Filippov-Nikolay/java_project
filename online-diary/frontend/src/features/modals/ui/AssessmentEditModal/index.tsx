"use client";

import React from "react";
import type { ModalComponentProps } from "@features/modals/model/types";

type AssessmentEditModalProps = ModalComponentProps;

const AssessmentEditModal: React.FC<AssessmentEditModalProps> = ({
    data,
    isTop,
    onClose,
}) => {
    // явно приводим data к нужной форме, чтобы TS был доволен
    const { assessmentId } = (data || {}) as { assessmentId?: number };

    return (
        <div>
            <h2>Редактирование оценки {assessmentId}</h2>
            <button type="button" onClick={onClose}>Закрыть</button>
        </div>
    );
};

export default AssessmentEditModal;