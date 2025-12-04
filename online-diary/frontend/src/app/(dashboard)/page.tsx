"use client";

import { openModal } from "@features/modals/model/modalSlice";
import { useAppDispatch } from "@shared/store/hooks";

export default function DashboardPage() {

    const dispatch = useAppDispatch();
    const handleEdit = (assessmentId: number) => {
        dispatch(
            openModal({
                type: 'CONFIRMATION',
                data: {
                    text: 'Точно удалить оценку?',
                    onConfirmAction: { type: 'deleteAssessment', id: assessmentId },
                },
            })
        );
    };

    return (
        <div>
            <h1>Dashboard overview placeholder</h1>
            <button type="button" onClick={() => handleEdit(1)}>Click me for call modal!</button>
        </div>
    )
}
