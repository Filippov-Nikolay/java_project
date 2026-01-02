"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Button from "@shared/ui/Button";
import Input from "@shared/ui/Input";
import { ScheduleEventType } from "@entities/schedule/model/types";
import { LESSON_TIMES } from "@shared/config/schedule";
import styles from "../../page.module.scss";

export default function EditScheduleEntryPage() {
    const router = useRouter();
    const { id } = useParams();

    const [groups, setGroups] = useState<any[]>([]);
    const [subjects, setSubjects] = useState<any[]>([]);
    const [teachers, setTeachers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    
    const [formData, setFormData] = useState({
        groupId: "",
        subjectId: "",
        teacherId: "",
        date: "",
        lessonNumber: "1",
        room: "",
        type: "lecture" as ScheduleEventType
    });

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) return;
        const headers = { "Authorization": `Bearer ${token}` };

        Promise.all([
            fetch("http://localhost:8080/api/groups", { headers }).then(res => res.json()),
            fetch("http://localhost:8080/api/subjects", { headers }).then(res => res.json()),
            fetch(`http://localhost:8080/api/schedule/item/${id}`, { headers }).then(res => res.json())
        ]).then(([g, s, item]) => {
            setGroups(g);
            setSubjects(s);
            setFormData({
                groupId: item.groupId.toString(),
                subjectId: item.subjectId.toString(),
                teacherId: item.teacherId.toString(),
                date: item.date,
                lessonNumber: item.lessonNumber.toString(),
                room: item.room || "",
                type: item.type.toLowerCase() as ScheduleEventType
            });

        }).catch(err => {
            console.error(err);
            router.push("/admin/schedule/list");
        });
    }, [id]);

    useEffect(() => {
        if (!formData.subjectId) return;

        const token = localStorage.getItem("token");
        const headers = { "Authorization": `Bearer ${token}` };

        console.log(`Fetching teachers for subject ID: ${formData.subjectId}`);

        fetch(`http://localhost:8080/api/subjects/${formData.subjectId}/teachers`, { headers })
            .then(res => res.json())
            .then(data => {
                setTeachers(data);

                const canTeach = data.some((t: any) => t.id.toString() === formData.teacherId);
                if (!canTeach && formData.teacherId !== "") {
                    setFormData(prev => ({ ...prev, teacherId: "" }));
                }
                
                setLoading(false);
            })
            .catch(err => console.error("Error fetching filtered teachers:", err));
    }, [formData.subjectId]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const token = localStorage.getItem("token");
        const res = await fetch(`http://localhost:8080/api/schedule/${id}`, {
            method: "PUT",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                ...formData,
                groupId: Number(formData.groupId),
                subjectId: Number(formData.subjectId),
                teacherId: Number(formData.teacherId),
                lessonNumber: Number(formData.lessonNumber),
                type: formData.type.toUpperCase()
            })
        });

        if (res.ok) {
            alert("Заняття успішно оновлено!");
            router.push("/admin/schedule/list");
        } else {
            const error = await res.json();
            alert("Помилка: " + (error.message || "Не вдалося зберегти"));
        }
    };

    if (loading) return <div className={styles.container}>Синхронізація вчителів...</div>;

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <h1>Редагування заняття</h1>
                <p>ID запису: {id}</p>
            </header>
            
            <form onSubmit={handleSubmit} className={styles.formCard}>
                <div className={styles.grid}>
                    <div className={styles.field}>
                        <label>Дата заняття</label>
                        <Input 
                            type="date" 
                            value={formData.date} 
                            onChange={e => setFormData({...formData, date: e.target.value})} 
                            required 
                        />
                    </div>

                    <div className={styles.field}>
                        <label>Група</label>
                        <select value={formData.groupId} onChange={e => setFormData({...formData, groupId: e.target.value})} required>
                            {groups.map(g => <option key={g.id} value={g.id}>{g.name}</option>)}
                        </select>
                    </div>

                    <div className={styles.field}>
                        <label>Предмет</label>
                        <select 
                            value={formData.subjectId} 
                            onChange={e => setFormData({...formData, subjectId: e.target.value})} 
                            required
                        >
                            {subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                        </select>
                    </div>

                    <div className={styles.field}>
                        <label>Викладач</label>
                        <select 
                            value={formData.teacherId} 
                            onChange={e => setFormData({...formData, teacherId: e.target.value})} 
                            required
                            disabled={teachers.length === 0}
                        >
                            <option value="">{teachers.length === 0 ? "Спочатку призначте вчителів" : "Оберіть вчителя..."}</option>
                            {teachers.map(t => (
                                <option key={t.id} value={t.id}>{t.lastName} {t.firstName}</option>
                            ))}
                        </select>
                    </div>

                    <div className={styles.field}>
                        <label>Пара</label>
                        <select value={formData.lessonNumber} onChange={e => setFormData({...formData, lessonNumber: e.target.value})}>
                            {Object.entries(LESSON_TIMES).map(([num, time]) => (
                                <option key={num} value={num}>{num} пара ({time.start}-{time.end})</option>
                            ))}
                        </select>
                    </div>

                    <div className={styles.field}>
                        <label>Тип заняття</label>
                        <select value={formData.type} onChange={e => setFormData({...formData, type: e.target.value as ScheduleEventType})}>
                            <option value="lecture">Лекція</option>
                            <option value="practice">Практика</option>
                            <option value="exam">Іспит</option>
                        </select>
                    </div>

                    <div className={styles.field}>
                        <label>Аудиторія</label>
                        <Input placeholder="Напр. 402" value={formData.room} onChange={e => setFormData({...formData, room: e.target.value})} />
                    </div>
                </div>

                <div className={styles.formActions}>
                    <Button type="button" label="Скасувати" variant="secondary" onClick={() => router.back()} />
                    <Button type="submit" label="Зберегти зміни" />
                </div>
            </form>
        </div>
    );
}