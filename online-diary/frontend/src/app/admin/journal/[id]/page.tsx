"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useDispatch } from "react-redux"; 
import { showNotification } from "@features/notifications/model/notificationSlice"; //
import { 
  FiArrowLeft, FiCheck, FiClock, FiUserX, FiSave, FiUser,
  FiBookOpen, FiEdit3, FiAward, FiFileText, FiChevronDown
} from "react-icons/fi";
import Button from "@shared/ui/Button";
import styles from "./page.module.scss";
import clsx from "clsx";

export default function JournalPage() {
  const { id: scheduleId } = useParams();
  const router = useRouter();
  const dispatch = useDispatch(); //
  
  const [lessonInfo, setLessonInfo] = useState<any>(null);
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const workTypes = [
    { value: "CLASSWORK", label: "Класна робота", icon: <FiBookOpen /> },
    { value: "INDEPENDENT", label: "Самостійна", icon: <FiEdit3 /> },
    { value: "TEST", label: "Контрольна", icon: <FiFileText /> },
    { value: "THEMATIC", label: "Тематична", icon: <FiAward /> },
  ];

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");
      const headers = { "Authorization": `Bearer ${token}` };
      try {
        const [lRes, jRes] = await Promise.all([
          fetch(`http://localhost:8080/api/schedule/item/${scheduleId}`, { headers }),
          fetch(`http://localhost:8080/api/journal/${scheduleId}`, { headers })
        ]);

        if (lRes.ok && jRes.ok) {
          setLessonInfo(await lRes.json());
          setStudents(await jRes.json());
        }
      } catch (err) {
        dispatch(showNotification({ message: "Помилка завантаження даних", status: "error" }));
      } finally {
        setLoading(false);
      }
    };
    if (scheduleId) fetchData();
  }, [scheduleId, dispatch]);

  const updateStudent = (id: number, field: string, value: any) => {
    setStudents(prev => prev.map(s => s.studentId === id ? { ...s, [field]: value } : s));
  };

  const saveJournal = async () => {
    setIsSaving(true);
    const payload = students.map(s => ({
      ...s,
      scheduleId: Number(scheduleId),
      grade: String(s.grade || "") //
    }));

    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`http://localhost:8080/api/journal/${scheduleId}/save`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });
      
      if (res.ok) {
        dispatch(showNotification({ 
          message: "Журнал успішно збережено!", 
          status: "successful" //
        }));
      } else {
        throw new Error();
      }
    } catch (err) {
      dispatch(showNotification({ 
        message: "Помилка при збереженні даних", 
        status: "error" 
      }));
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) return (
    <div className={styles.loaderContainer}>
      <div className={styles.spinner}></div>
      <span>Синхронізація журналу...</span>
    </div>
  );

  return (
    <div className={styles.journalPage}>
      <header className={styles.jHeader}>
        <div className={styles.headerInfo}>
          <button onClick={() => router.back()} className={styles.backBtn}>
            <FiArrowLeft /> Назад
          </button>
          <div className={styles.titleGroup}>
            <div className={styles.subjectBadge}>ПРЕДМЕТ</div>
            <h1>{lessonInfo?.subjectName}</h1>
            <div className={styles.metaInfo}>
              <span className={styles.groupName}>{lessonInfo?.groupName}</span>
              <span className={styles.separator}>•</span>
              <span>{lessonInfo?.date}</span>
              <span className={styles.separator}>•</span>
              <span className={styles.lessonNum}>{lessonInfo?.lessonNumber} пара</span>
            </div>
          </div>
        </div>
        
        <Button 
          variant="primary" 
          onClick={saveJournal} 
          className={styles.saveBtn}
          disabled={isSaving}
        >
          {isSaving ? <div className={styles.miniSpinner}></div> : <FiSave />}
          <span>{isSaving ? "Збереження..." : "Зберегти зміни"}</span>
        </Button>
      </header>

      <div className={styles.contentCard}>
        <table className={styles.jTable}>
          <thead>
            <tr>
              <th>Студент</th>
              <th>Відвідуваність</th>
              <th>Вид діяльності</th>
              <th className={styles.center}>Оцінка</th>
            </tr>
          </thead>
          <tbody>
            {students.map(s => (
              <tr key={s.studentId} className={clsx(s.attendance === 'ABSENT' && styles.rowAbsent)}>
                <td className={styles.studentCell}>
                  <div className={styles.studentInfo}>
                    <div className={styles.avatarWrapper}>
                      {s.avatarUrl ? <img src={s.avatarUrl} alt="" /> : <FiUser />}
                      <div className={clsx(styles.statusDot, styles[s.attendance?.toLowerCase() || 'present'])} />
                    </div>
                    <span className={styles.studentName}>{s.studentFullName}</span>
                  </div>
                </td>
                
                <td className={styles.attCell}>
                  <div className={styles.segmentedToggle}>
                    <button 
                      className={clsx(styles.toggleBtn, s.attendance === 'PRESENT' && styles.activePresent)} 
                      onClick={() => updateStudent(s.studentId, 'attendance', 'PRESENT')}
                    >
                      <FiCheck />
                    </button>
                    <button 
                      className={clsx(styles.toggleBtn, s.attendance === 'LATE' && styles.activeLate)} 
                      onClick={() => updateStudent(s.studentId, 'attendance', 'LATE')}
                    >
                      <FiClock />
                    </button>
                    <button 
                      className={clsx(styles.toggleBtn, s.attendance === 'ABSENT' && styles.activeAbsent)} 
                      onClick={() => updateStudent(s.studentId, 'attendance', 'ABSENT')}
                    >
                      <FiUserX />
                    </button>
                  </div>
                </td>

                <td>
                  <div className={styles.selectContainer}>
                    <select 
                      className={styles.typeSelect} 
                      value={s.workType || "CLASSWORK"} 
                      onChange={(e) => updateStudent(s.studentId, 'workType', e.target.value)}
                    >
                      {workTypes.map(t => (
                        <option key={t.value} value={t.value}>{t.label}</option>
                      ))}
                    </select>
                    <FiChevronDown className={styles.selectIcon} />
                  </div>
                </td>

                <td className={styles.center}>
                  <div className={styles.gradeWrapper}>
                    <input 
                      type="number" 
                      className={clsx(styles.gradeInput, Number(s.grade) >= 10 && styles.excellent)} 
                      value={s.grade || ""} 
                      min="1" max="12"
                      onChange={(e) => updateStudent(s.studentId, 'grade', e.target.value)}
                      placeholder="—" 
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}