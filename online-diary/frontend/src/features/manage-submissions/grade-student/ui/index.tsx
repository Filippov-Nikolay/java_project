"use client";

import { useState } from "react";
import { gradeSubmissionRequest } from "@entities/homework/api/homeworkApi";
import Button from "@shared/ui/Button";
import styles from "./styles.module.scss";

interface GradeModalProps {
    assessmentId: string | number;
    studentId: number;
    studentName: string;
    initialGrade?: number | null;
    initialFeedback?: string | null;
    onClose: () => void;
    onSuccess: () => void;
}

export const GradeModal = ({ 
    assessmentId, studentId, studentName, 
    initialGrade, initialFeedback, onClose, onSuccess 
}: GradeModalProps) => {
    const [grade, setGrade] = useState(initialGrade || 0);
    const [feedback, setFeedback] = useState(initialFeedback || "");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async () => {
        setIsSubmitting(true);
        try {
            const token = localStorage.getItem("token");

            await gradeSubmissionRequest(token, assessmentId, studentId, { grade, feedback });
            onSuccess();
            onClose();
        } catch (err) {
            alert("Помилка при збереженні оцінки");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className={styles.overlay}>
            <div className={styles.modal}>
                <h3>Оцінювання: {studentName}</h3>
                <div className={styles.content}>
                    <div className={styles.field}>
                        <label>Оцінка (бали)</label>
                        <input 
                            type="number" 
                            value={grade} 
                            onChange={(e) => setGrade(Number(e.target.value))} 
                            min="0" max="100"
                        />
                    </div>
                    <div className={styles.field}>
                        <label>Відгук вчителя</label>
                        <textarea 
                            value={feedback} 
                            onChange={(e) => setFeedback(e.target.value)}
                            placeholder="Напишіть коментар до роботи..."
                        />
                    </div>
                </div>
                <div className={styles.actions}>
                    <Button variant="secondary" onClick={onClose} disabled={isSubmitting}>Скасувати</Button>
                    <Button variant="primary" onClick={handleSubmit} disabled={isSubmitting}>
                        {isSubmitting ? "Збереження..." : "Зберегти оцінку"}
                    </Button>
                </div>
            </div>
        </div>
    );
};