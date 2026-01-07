"use client";

import { useEffect, useState } from "react";
import { getSubmissionsRequest } from "@entities/homework/api/homeworkApi";
import { GradeModal } from "@features/manage-submissions/grade-student"; // Імпортуємо фічу
import styles from "./styles.module.scss";

export const SubmissionsTable = ({ assessmentId }: { assessmentId: string }) => {
    const [submissions, setSubmissions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedStudent, setSelectedStudent] = useState<any | null>(null);

    const loadData = async () => {
        try {
            const token = localStorage.getItem("token");
            const data = await getSubmissionsRequest(token, assessmentId);
            setSubmissions(data);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { loadData(); }, [assessmentId]);

    if (loading) return null;

    return (
        <div className={styles.wrapper}>
            <table className={styles.table}>
                <thead>
                    <tr>
                        <th>Студент</th>
                        <th>Статус</th>
                        <th>Дата здачі</th>
                        <th>Файл</th>
                        <th>Результат</th>
                        <th>Дії</th>
                    </tr>
                </thead>
                <tbody>
                    {submissions.map((sub: any) => (
                        <tr key={sub.studentId}>
                            <td className={styles.name}>{sub.studentName}</td>
                            <td>
                                <span className={sub.submitted ? styles.statusDone : styles.statusMissing}>
                                    {sub.submitted ? "Здано" : "Не здано"}
                                </span>
                            </td>
                            <td className={styles.date}>
                                {sub.submittedAt ? new Date(sub.submittedAt).toLocaleDateString() : "—"}
                            </td>
                            <td>
                                {sub.fileName ? (
                                    <a href={`/api/files/download/${sub.fileName}`} className={styles.link}>📄 Файл</a>
                                ) : "—"}
                            </td>
                            <td>
                                {sub.grade !== null ? <b className={styles.grade}>{sub.grade}</b> : "—"}
                            </td>
                            <td>
                                <button 
                                    className={styles.actionBtn} 
                                    disabled={!sub.submitted}
                                    onClick={() => setSelectedStudent(sub)}
                                >
                                    📝 {sub.grade !== null ? "Змінити" : "Оцінити"}
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {selectedStudent && (
                <GradeModal 
                    assessmentId={assessmentId}
                    studentId={selectedStudent.studentId}
                    studentName={selectedStudent.studentName}
                    initialGrade={selectedStudent.grade}
                    initialFeedback={selectedStudent.feedback}
                    onClose={() => setSelectedStudent(null)}
                    onSuccess={loadData}
                />
            )}
        </div>
    );
};