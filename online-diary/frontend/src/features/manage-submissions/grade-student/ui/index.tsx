"use client";

import { useState } from "react";
import { gradeSubmissionRequest } from "@entities/homework/api/homeworkApi";
import Button from "@shared/ui/Button";
import { IoClose, IoStarOutline, IoChatbubbleEllipsesOutline } from "react-icons/io5";
import styles from "./styles.module.scss";

export const GradeModal = ({ 
    assessmentId, isOverdue, studentId, studentName, 
    initialGrade, initialFeedback, onClose, onSuccess
}: any) => {
    const maxPoints = isOverdue ? 10 : 12;
    const [grade, setGrade] = useState(initialGrade || 1);
    const [feedback, setFeedback] = useState(initialFeedback || "");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async () => {
        if (grade < 1 || grade > maxPoints) {
            return alert(`Для цього завдання ліміт: ${maxPoints} балів (через дедлайн)`);
        }
        
        setIsSubmitting(true);
        try {
            const token = localStorage.getItem("token");
 
            await gradeSubmissionRequest(token, assessmentId, studentId, { grade, feedback });
            
            onSuccess();
            onClose(); 
        } catch (err) {
            alert("Помилка при збереженні");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className={styles.overlay} onClick={onClose}>
            <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                <header className={styles.header}>
                    <div>
                        <h3>Оцінювання {isOverdue && <span className={styles.warning}>(Дедлайн пройшов)</span>}</h3>
                        <p>{studentName}</p>
                    </div>
                    <button className={styles.closeBtn} onClick={onClose}>
                        <IoClose />
                    </button>
                </header>

                <div className={styles.content}>
                    <div className={styles.field}>
                        <label><IoStarOutline /> Бали (1-{maxPoints})</label>
                        <input 
                            type="number" 
                            value={grade} 
                            onChange={(e) => setGrade(Number(e.target.value))} 
                            min="1" max={maxPoints}
                            autoFocus
                        />
                        {isOverdue && (
                            <small className={styles.info}>
                                ⚠️ Дедлайн минув. Максимальна оцінка обмежена до 10.
                            </small>
                        )}
                    </div>
                    <div className={styles.field}>
                        <label>
                            <IoChatbubbleEllipsesOutline /> Відгук для студента
                        </label>
                        <textarea 
                            value={feedback} 
                            onChange={(e) => setFeedback(e.target.value)}
                            placeholder="Напр: Гарна робота, але зверни увагу на структуру коду..."
                        />
                    </div>
                </div>

                <div className={styles.footer}>
                    <Button variant="secondary" onClick={onClose} disabled={isSubmitting}>
                        Скасувати
                    </Button>
                    <Button variant="primary" onClick={handleSubmit} disabled={isSubmitting}>
                        {isSubmitting ? "Збереження..." : "Підтвердити оцінку"}
                    </Button>
                </div>
            </div>
        </div>
    );
};