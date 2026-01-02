"use client";

import { useState, useEffect } from "react";
import Input from "@shared/ui/Input";
import Button from "@shared/ui/Button";
import styles from "./page.module.scss";

interface Subject { id: number; name: string; description: string; }
interface Group { id: number; name: string; course: number; }
interface Teacher { id: number; firstName: string; lastName: string; }

export default function AdminSubjectsPage() {
    const [subjects, setSubjects] = useState<Subject[]>([]);
    const [groups, setGroups] = useState<Group[]>([]);
    const [teachers, setTeachers] = useState<Teacher[]>([]);
    
    const [newSubject, setNewSubject] = useState({ name: "", description: "" });
    const [newGroupName, setNewGroupName] = useState("");
    const [newGroupCourse, setNewGroupCourse] = useState("1");
    
    const [assignment, setAssignment] = useState({
        teacherId: "",
        subjectId: "",
        groupId: ""
    });

    const [editingSubject, setEditingSubject] = useState<Subject | null>(null);

    const getAuthHeaders = () => ({
        "Authorization": `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json"
    });

    const fetchData = async () => {
        const headers = getAuthHeaders();
        try {
            const [sRes, gRes, tRes] = await Promise.all([
                fetch("http://localhost:8080/api/subjects", { headers }),
                fetch("http://localhost:8080/api/groups", { headers }),
                fetch("http://localhost:8080/api/auth/users/teachers", { headers })
            ]);
            
            if (sRes.ok) setSubjects(await sRes.json());
            if (gRes.ok) setGroups(await gRes.json());
            if (tRes.ok) setTeachers(await tRes.json());
        } catch (err) {
            console.error("Помилка завантаження даних:", err);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleCreateGroup = async () => {
        if (!newGroupName) return;
        const res = await fetch("http://localhost:8080/api/groups", {
            method: "POST",
            headers: getAuthHeaders(),
            body: JSON.stringify({ 
                name: newGroupName, 
                course: parseInt(newGroupCourse)
            })
        });
        if (res.ok) {
            alert("Групу створено!");
            setNewGroupName("");
            setNewGroupCourse("1");
            fetchData();
        } else {
            alert("Помилка створення. Перевірте консоль бекенду.");
        }
    };

    const handleDeleteGroup = async (id: number) => {
        if (!confirm("Видалити групу?")) return;
        const res = await fetch(`http://localhost:8080/api/groups/${id}`, {
            method: "DELETE",
            headers: getAuthHeaders()
        });
        if (res.ok) {
            setGroups(groups.filter(g => g.id !== id));
        } else if (res.status === 500) {
            alert("Неможливо видалити: група містить студентів або має розклад.");
        }
    };

    const handleCreateSubject = async () => {
        if (!newSubject.name) return;
        const res = await fetch("http://localhost:8080/api/subjects", {
            method: "POST",
            headers: getAuthHeaders(),
            body: JSON.stringify(newSubject)
        });
        if (res.ok) {
            alert("Предмет створено!");
            setNewSubject({ name: "", description: "" });
            fetchData();
        }
    };

    const handleDeleteSubject = async (id: number) => {
        if (!confirm("Видалити предмет?")) return;
        const res = await fetch(`http://localhost:8080/api/subjects/${id}`, {
            method: "DELETE",
            headers: getAuthHeaders()
        });
        if (res.ok) {
            setSubjects(subjects.filter(s => s.id !== id));
        }
    };

    const handleUpdateSubject = async () => {
        if (!editingSubject) return;
        const res = await fetch(`http://localhost:8080/api/subjects/${editingSubject.id}`, {
            method: "PUT",
            headers: getAuthHeaders(),
            body: JSON.stringify(editingSubject)
        });
        if (res.ok) {
            setEditingSubject(null);
            fetchData();
        }
    };

    const handleAssign = async () => {

    if (!assignment.teacherId || !assignment.subjectId || !assignment.groupId) {
        alert("Будь ласка, оберіть вчителя, предмет та групу!");
        return;
    }

    try {
        const res = await fetch("http://localhost:8080/api/subjects/assign-teacher", {
            method: "POST",
            headers: getAuthHeaders(),
            body: JSON.stringify(assignment)
        });

        if (res.ok) {
            alert("Вчителя успішно призначено!");

            setAssignment({ teacherId: "", subjectId: "", groupId: "" });
            fetchData();
        } else {
            const errorData = await res.json();
            alert(`Помилка: ${errorData.message || "Не вдалося виконати призначення"}`);
        }
    } catch (err) {
        console.error("Error during assign:", err);
        alert("Сталася помилка при зверненні до сервера");
    }
};

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <h1>Предмети та Навантаження</h1>
                <p>Керування структурою навчання</p>
            </header>

            <div className={styles.grid}>

                <section className={styles.card}>
                    <h3>Групи</h3>
                    <div className={styles.formStack}>
                        <div style={{ display: 'flex', gap: '10px' }}>
                            <Input 
                                placeholder="Назва" 
                                value={newGroupName}
                                onChange={(e) => setNewGroupName(e.target.value)}
                            />
                            <select 
                                value={newGroupCourse} 
                                onChange={(e) => setNewGroupCourse(e.target.value)}
                                className={styles.selectCourse}
                            >
                                {[1, 2, 3, 4].map(c => <option key={c} value={c}>{c} курс</option>)}
                            </select>
                        </div>
                        <Button label="Створити групу" onClick={handleCreateGroup} />
                        <div className={styles.groupList}>
                            <label>Наявні:</label>
                            <div className={styles.tags}>
                                {groups.map(g => (
                                    <div key={g.id} className={styles.groupTag}>
                                        {g.name} ({g.course}к.)
                                        <button onClick={() => handleDeleteGroup(g.id)}>×</button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                <section className={styles.card}>
                    <h3>Предмети</h3>
                    <div className={styles.formStack}>
                        <Input placeholder="Назва" value={newSubject.name} onChange={e => setNewSubject({...newSubject, name: e.target.value})} />
                        <Input placeholder="Опис" value={newSubject.description} onChange={e => setNewSubject({...newSubject, description: e.target.value})} />
                        <Button label="Додати предмет" onClick={handleCreateSubject} />
                        <div className={styles.tags}>
                            {subjects.map(s => (
                                <div key={s.id} className={styles.groupTag}>
                                    <span onClick={() => setEditingSubject(s)}>{s.name}</span>
                                    <button onClick={() => handleDeleteSubject(s.id)}>×</button>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                <section className={styles.card}>
                    <h3>Призначення</h3>
                    <div className={styles.formStack}>
                        <div className={styles.field}>
                            <label>Предмет</label>
                            <select value={assignment.subjectId} onChange={e => setAssignment({...assignment, subjectId: e.target.value})}>
                                <option value="">Оберіть...</option>
                                {subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                            </select>
                        </div>
                        <div className={styles.field}>
                            <label>Група</label>
                            <select value={assignment.groupId} onChange={e => setAssignment({...assignment, groupId: e.target.value})}>
                                <option value="">Оберіть...</option>
                                {groups.map(g => <option key={g.id} value={g.id}>{g.name}</option>)}
                            </select>
                        </div>
                        <div className={styles.field}>
                            <label>Викладач</label>
                            <select value={assignment.teacherId} onChange={e => setAssignment({...assignment, teacherId: e.target.value})}>
                                <option value="">Оберіть...</option>
                                {teachers.map(t => <option key={t.id} value={t.id}>{t.lastName} {t.firstName}</option>)}
                            </select>
                        </div>
                        <Button label="Підтвердити" onClick={handleAssign} />
                    </div>
                </section>
            </div>

            {editingSubject && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modal}>
                        <h3>Редагування</h3>
                        <Input value={editingSubject.name} onChange={e => setEditingSubject({...editingSubject, name: e.target.value})} />
                        <Input value={editingSubject.description} onChange={e => setEditingSubject({...editingSubject, description: e.target.value})} />
                        <div className={styles.modalActions}>
                            <Button label="Скасувати" variant="secondary" onClick={() => setEditingSubject(null)} />
                            <Button label="Зберегти" onClick={handleUpdateSubject} />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}