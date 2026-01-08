"use client";

import { useEffect, useState, useMemo } from "react";
import { getSubmissionsRequest } from "@entities/homework/api/homeworkApi";
import { GradeModal } from "@features/manage-submissions/grade-student";
import { 
    IoSearch, 
    IoCloudDownloadOutline, 
    IoCheckmarkCircle, 
    IoTimeOutline, 
    IoAlertCircleOutline,
    IoCreateOutline
} from "react-icons/io5";
import styles from "./styles.module.scss";
import clsx from "clsx";

export const SubmissionsTable = ({ assessmentId }: { assessmentId: string }) => {
    const [submissions, setSubmissions] = useState([]);
    const [isOverdue, setIsOverdue] = useState(false);
    const [loading, setLoading] = useState(true);
    const [selectedStudent, setSelectedStudent] = useState<any | null>(null);
    const [searchTerm, setSearchTerm] = useState("");

    const loadData = async () => {
        try {
            const token = localStorage.getItem("token");

            const data = await getSubmissionsRequest(token, assessmentId);
            setSubmissions(data);

            const res = await fetch(`http://localhost:8080/api/assessments/${assessmentId}`, {
                headers: { "Authorization": `Bearer ${token}` }
            });
            const assessment = await res.json();
            setIsOverdue(new Date(assessment.deadline) < new Date());
            
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { loadData(); }, [assessmentId]);


    const filteredSubmissions = useMemo(() => {
        return submissions.filter((sub: any) => 
            sub.studentName.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [submissions, searchTerm]);

    if (loading) return <div className={styles.loader}>Завантаження списку...</div>;

    return (
        <div className={styles.container}>
            <div className={styles.tableHeader}>
                <h2>Здані роботи</h2>
                <div className={styles.searchBox}>
                    <IoSearch />
                    <input 
                        type="text" 
                        placeholder="Пошук студента..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <div className={styles.wrapper}>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th>Студент</th>
                            <th>Статус</th>
                            <th>Дата здачі</th>
                            <th>Матеріали</th>
                            <th>Оцінка</th>
                            <th align="right">Дії</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredSubmissions.map((sub: any) => (
                            <tr key={sub.studentId} className={clsx(!sub.submitted && styles.rowMissing)}>
                                <td className={styles.studentInfo}>
                                    <div className={styles.avatar}>
                                        {sub.studentName.charAt(0)}
                                    </div>
                                    <span className={styles.name}>{sub.studentName}</span>
                                </td>
                                <td>
                                    <div className={clsx(
                                        styles.badge, 
                                        sub.grade !== null ? styles.badgeGraded : (sub.submitted ? styles.badgeDone : styles.badgeMissing)
                                    )}>
                                        {sub.grade !== null ? <IoCheckmarkCircle /> : (sub.submitted ? <IoTimeOutline /> : <IoAlertCircleOutline />)}
                                        {sub.grade !== null ? "Перевірено" : (sub.submitted ? "Очікує перевірки" : "Не здано")}
                                    </div>
                                </td>
                                <td className={styles.date}>
                                    {sub.submittedAt ? (
                                        <div className={styles.dateCell}>
                                            <IoTimeOutline />
                                            {new Date(sub.submittedAt).toLocaleDateString()}
                                        </div>
                                    ) : "—"}
                                </td>
                                <td>
                                    {sub.fileName ? (
                                        <a href={`/api/files/download/${sub.fileName}`} className={styles.downloadLink}>
                                            <IoCloudDownloadOutline />
                                            <span>Скачати архів</span>
                                        </a>
                                    ) : <span className={styles.noFile}>Файл відсутній</span>}
                                </td>
                                <td>
                                    {sub.grade !== null ? (
                                        <div className={styles.gradeBadge}>{sub.grade}</div>
                                    ) : (
                                        <span className={styles.notGraded}>Не оцінено</span>
                                    )}
                                </td>
                                <td align="left">
                                    <button 
                                        className={styles.actionBtn} 
                                        disabled={!sub.submitted}
                                        onClick={() => setSelectedStudent(sub)}
                                    >
                                        <IoCreateOutline />
                                        <span>{sub.grade !== null ? "Змінити" : "Оцінити"}</span>
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {selectedStudent && (
                <GradeModal 
                    assessmentId={assessmentId}
                    isOverdue={isOverdue}
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