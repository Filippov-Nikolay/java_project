"use client";

import { useState, useEffect } from "react";
import Button from "@shared/ui/Button";
import Input from "@shared/ui/Input";
import { ScheduleEventType } from "@entities/schedule/model/types";
import { LESSON_TIMES } from "@shared/config/schedule";
import styles from "./page.module.scss";
import Link from "next/link";

export default function AdminSchedulePage() {
    const [groups, setGroups] = useState<{id: number, name: string}[]>([]);
    const [subjects, setSubjects] = useState<{id: number, name: string}[]>([]);
    const [teachers, setTeachers] = useState<{id: number, firstName: string, lastName: string}[]>([]);
    
    const [formData, setFormData] = useState({
        groupId: "",
        subjectId: "",
        teacherId: "",
        date: new Date().toISOString().split('T')[0], // YYYY-MM-DD
        lessonNumber: "1",
        room: "",
        type: "lecture" as ScheduleEventType
    });

    useEffect(() => {
        const token = localStorage.getItem("token");
        const headers = { "Authorization": `Bearer ${token}` };

        Promise.all([
            fetch("http://localhost:8080/api/groups", { headers }).then(res => res.json()),
            fetch("http://localhost:8080/api/subjects", { headers }).then(res => res.json()),
            fetch("http://localhost:8080/api/auth/users/teachers", { headers }).then(res => res.json())
        ]).then(([g, s, t]) => {
            setGroups(g);
            setSubjects(s);
            setTeachers(t);
        }).catch(err => console.error("Помилка завантаження:", err));
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const token = localStorage.getItem("token");

        const res = await fetch("http://localhost:8080/api/schedule", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                ...formData,
                groupId: Number(formData.groupId),
                subjectId: Number(formData.subjectId),
                teacherId: Number(formData.teacherId),
                lessonNumber: Number(formData.lessonNumber)
            })
        });

        if (res.ok) {
            alert("Заняття успішно додано до розкладу!");
        } else {
            const error = await res.text();
            alert("Помилка: " + error);
        }
    };

    return (
        <div className={styles.container}>
            <header className={styles.header}>
            <div>
                <h1>Конструктор розкладу</h1>
                <p>Додавання занять у календарну сітку</p>
            </div>
            <Link href="/admin/schedule/list">
                <Button label="Список усіх занять" variant="secondary" />
            </Link>
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
                            <option value="">Оберіть групу</option>
                            {groups.map(g => <option key={g.id} value={g.id}>{g.name}</option>)}
                        </select>
                    </div>

                    <div className={styles.field}>
                        <label>Предмет</label>
                        <select value={formData.subjectId} onChange={e => setFormData({...formData, subjectId: e.target.value})} required>
                            <option value="">Оберіть предмет</option>
                            {subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                        </select>
                    </div>

                    <div className={styles.field}>
                        <label>Викладач</label>
                        <select value={formData.teacherId} onChange={e => setFormData({...formData, teacherId: e.target.value})} required>
                            <option value="">Оберіть викладача</option>
                            {teachers.map(t => <option key={t.id} value={t.id}>{t.lastName} {t.firstName}</option>)}
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
                            <option value="lecture">Лекція (Блакитний)</option>
                            <option value="practice">Практика (Фіолетовий)</option>
                            <option value="exam">Іспит (Червоний)</option>
                        </select>
                    </div>

                    <div className={styles.field}>
                        <label>Аудиторія</label>
                        <Input placeholder="Напр. 402" value={formData.room} onChange={e => setFormData({...formData, room: e.target.value})} />
                    </div>
                </div>

                <div className={styles.formActions}>
                    <Button type="submit" label="Зберегти в розклад" />
                </div>
            </form>
        </div>
    );
}