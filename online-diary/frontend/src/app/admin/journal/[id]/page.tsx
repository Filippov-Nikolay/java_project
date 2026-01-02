"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { FiArrowLeft, FiCheck, FiClock, FiUserX, FiSave, FiUser } from "react-icons/fi";
import Button from "@shared/ui/Button";
import styles from "./page.module.scss";

export default function JournalPage() {
  const { id: scheduleId } = useParams();
  const router = useRouter();
  
  const [lessonInfo, setLessonInfo] = useState<any>(null);
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
        const token = localStorage.getItem("token");
        const headers = { "Authorization": `Bearer ${token}` };

        try {

            const lessonRes = await fetch(`http://localhost:8080/api/schedule/item/${scheduleId}`, { headers });

            const journalRes = await fetch(`http://localhost:8080/api/journal/${scheduleId}`, { headers });

            if (lessonRes.ok && journalRes.ok) {
                const lessonData = await lessonRes.json();
                const journalData = await journalRes.json();

                setLessonInfo(lessonData);
                setStudents(journalData);
            }
        } catch (err) {
            console.error("Fetch error:", err);
        } finally {
            setLoading(false);
        }
    };

    if (scheduleId) fetchData();
  }, [scheduleId]);

  const updateStudent = (studentId: number, field: string, value: any) => {
    setStudents(prev => prev.map(s => 
      s.studentId === studentId ? { ...s, [field]: value } : s
    ));
  };

  const saveJournal = async () => {
    const token = localStorage.getItem("token");
    const res = await fetch(`http://localhost:8080/api/journal/${scheduleId}/save`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(students)
    });
    if (res.ok) alert("Збережено!");
  };

  if (loading) return <div className={styles.loader}>Завантаження...</div>;

  return (
    <div className={styles.journalPage}>
      <header className={styles.jHeader}>
        <button onClick={() => router.back()} className={styles.backBtn}>
          <FiArrowLeft /> До розкладу
        </button>
        <div className={styles.titleBlock}>

          <h1>Журнал: {lessonInfo?.subjectName || ""}</h1>
          <p>Група {lessonInfo?.groupName} • {lessonInfo?.date} • {lessonInfo?.lessonNumber} пара</p>
        </div>
        <Button variant="primary" onClick={saveJournal}>
           <FiSave style={{marginRight: '8px'}} /> Зберегти дані
        </Button>
      </header>

      <div className={styles.tableWrapper}>
        <table className={styles.jTable}>
          <thead>
            <tr>
              <th>Студент</th>
              <th>Відвідуваність</th>
              <th>Оцінка</th>
              <th>Вид роботи</th>
            </tr>
          </thead>
          <tbody>
            {students.map(s => (
              <tr key={s.studentId}>
                <td>
                  <div className={styles.studentInfo}>
                    <div className={styles.avatar}>

                      {s.avatarUrl ? <img src={s.avatarUrl} /> : <FiUser />}
                    </div>

                    <span className={styles.studentName}>{s.studentFullName}</span>
                  </div>
                </td>
                <td className={styles.attCells}>
                  <button 
                    className={`${styles.att} ${s.attendance === 'PRESENT' ? styles.present : ''}`} 
                    onClick={() => updateStudent(s.studentId, 'attendance', 'PRESENT')}
                  >
                    <FiCheck />
                  </button>
                  <button 
                    className={`${styles.att} ${s.attendance === 'LATE' ? styles.late : ''}`} 
                    onClick={() => updateStudent(s.studentId, 'attendance', 'LATE')}
                  >
                    <FiClock />
                  </button>
                  <button 
                    className={`${styles.att} ${s.attendance === 'ABSENT' ? styles.absent : ''}`} 
                    onClick={() => updateStudent(s.studentId, 'attendance', 'ABSENT')}
                  >
                    <FiUserX />
                  </button>
                </td>
                <td>
                  <input 
                    type="text" 
                    className={styles.gradeInput} 
                    value={s.grade || ""} 
                    onChange={(e) => updateStudent(s.studentId, 'grade', e.target.value)}
                    placeholder="—" 
                  />
                </td>
                <td>
                  <select 
                    className={styles.typeSelect} 
                    value={s.workType} 
                    onChange={(e) => updateStudent(s.studentId, 'workType', e.target.value)}
                  >
                    <option value="REGULAR">Поточна</option>
                    <option value="TEST">Контрольна</option>
                    <option value="LAB">Лабораторна</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}