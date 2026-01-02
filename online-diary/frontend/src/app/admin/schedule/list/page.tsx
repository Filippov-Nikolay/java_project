"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import { useRouter } from "next/navigation";
import { FiEdit2, FiTrash2, FiCalendar, FiClock, FiMapPin, FiSearch, FiXCircle, FiDownload, FiUpload } from "react-icons/fi";
import Link from "next/link";
import Button from "@shared/ui/Button";
import { ScheduleEvent } from "@entities/schedule/model/types";
import styles from "./page.module.scss"; 
import * as XLSX from 'xlsx';

export default function ScheduleListPage() {
    const [schedule, setSchedule] = useState<ScheduleEvent[]>([]);
    const [groups, setGroups] = useState<{id: number, name: string}[]>([]);
    const [subjects, setSubjects] = useState<{id: number, name: string}[]>([]);
    const [loading, setLoading] = useState(true);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const router = useRouter();

    const [filters, setFilters] = useState({ groupId: "all", subjectId: "all", search: "" });

    const fetchData = async () => {
        const token = localStorage.getItem("token");
        const headers = { Authorization: `Bearer ${token}` };
        try {
            const [scheduleRes, groupsRes, subjectsRes] = await Promise.all([
                fetch("http://localhost:8080/api/schedule", { headers }),
                fetch("http://localhost:8080/api/groups", { headers }),
                fetch("http://localhost:8080/api/subjects", { headers })
            ]);
            if (scheduleRes.ok) setSchedule(await scheduleRes.json());
            if (groupsRes.ok) setGroups(await groupsRes.json());
            if (subjectsRes.ok) setSubjects(await subjectsRes.json());
        } catch (err) { console.error(err); } finally { setLoading(false); }
    };

    useEffect(() => { fetchData(); }, []);

    const exportToExcel = () => {
        const data = filteredSchedule.map(item => ({
            'Дата': item.date,
            'Пара': item.lessonNumber,
            'Предмет': item.subjectName,
            'Викладач': item.teacherFullName,
            'Група': item.groupName,
            'Тип': item.type,
            'Аудиторія': item.room
        }));
        const ws = XLSX.utils.json_to_sheet(data);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Розклад");
        XLSX.writeFile(wb, `Rozklad_Export.xlsx`);
    };

    const handleImportClick = () => fileInputRef.current?.click();

    const importFromExcel = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const token = localStorage.getItem("token");
        const formData = new FormData();
        formData.append("file", file);

        setLoading(true);
        try {
            const res = await fetch("http://localhost:8080/api/schedule/import", {
                method: "POST",
                headers: { "Authorization": `Bearer ${token}` },
                body: formData
            });

            if (res.ok) {
                alert("Успішно імпортовано!");
                fetchData();
            } else {
                const err = await res.json();
                alert("Помилка: " + err.message);
            }
        } catch (err) {
            alert("Помилка з'єднання з сервером");
        } finally {
            setLoading(false);
            e.target.value = "";
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm("Видалити цей запис?")) return;
        const token = localStorage.getItem("token");
        const res = await fetch(`http://localhost:8080/api/schedule/${id}`, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) setSchedule(prev => prev.filter(item => item.id !== id));
    };

    const filteredSchedule = useMemo(() => {
        return schedule.filter(item => {
            const matchGroup = filters.groupId === "all" || item.groupName === filters.groupId;
            const matchSubject = filters.subjectId === "all" || item.subjectName === filters.subjectId;
            const searchTerm = filters.search.toLowerCase().trim();
            const matchSearch = searchTerm === "" || 
                item.teacherFullName.toLowerCase().includes(searchTerm) || 
                item.subjectName.toLowerCase().includes(searchTerm);
            return matchGroup && matchSubject && matchSearch;
        }).sort((a, b) => b.date.localeCompare(a.date) || a.lessonNumber - b.lessonNumber);
    }, [schedule, filters]);

    if (loading) return <div className={styles.loader}>Обробка даних...</div>;

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <div>
                    <h1>Управління розкладом</h1>
                    <p>Знайдено занять: <strong>{filteredSchedule.length}</strong></p>
                </div>
                <div style={{ display: 'flex', gap: '12px' }}>
                    <input type="file" ref={fileInputRef} style={{ display: 'none' }} accept=".xlsx" onChange={importFromExcel} />
                    
                    <button onClick={handleImportClick} className={styles.resetBtn} style={{ display: 'flex', alignItems: 'center', gap: '8px', border: '1px solid #3b82f6', padding: '8px 16px', borderRadius: '10px', color: '#3b82f6' }}>
                        <FiUpload /> Імпорт
                    </button>

                    <button onClick={exportToExcel} className={styles.resetBtn} style={{ display: 'flex', alignItems: 'center', gap: '8px', border: '1px solid #1f2937', padding: '8px 16px', borderRadius: '10px' }}>
                        <FiDownload /> Експорт
                    </button>

                    <Link href="/admin/schedule">
                        <Button label="+ Створити заняття" variant="primary" />
                    </Link>
                </div>
            </header>

            <div className={styles.filterBar}>

                <div className={styles.filterGroup}>
                    <FiSearch className={styles.filterIcon} />
                    <input type="text" placeholder="Шукати..." value={filters.search} onChange={e => setFilters({...filters, search: e.target.value})} className={styles.searchInput} />
                </div>
                <div className={styles.filterSelects}>
                    <div className={styles.selectWrapper}>
                        <label>Група</label>
                        <select value={filters.groupId} onChange={e => setFilters({...filters, groupId: e.target.value})}>
                            <option value="all">Всі групи</option>
                            {groups.map(g => <option key={g.id} value={g.name}>{g.name}</option>)}
                        </select>
                    </div>
                    <div className={styles.selectWrapper}>
                        <label>Предмет</label>
                        <select value={filters.subjectId} onChange={e => setFilters({...filters, subjectId: e.target.value})}>
                            <option value="all">Всі предмети</option>
                            {subjects.map(s => <option key={s.id} value={s.name}>{s.name}</option>)}
                        </select>
                    </div>
                </div>
            </div>

            <div className={styles.tableCard}>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th>Дата та Час</th>
                            <th>Предмет / Викладач</th>
                            <th>Група</th>
                            <th>Тип / Аудиторія</th>
                            <th style={{textAlign: "right"}}>Дії</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredSchedule.map(item => (
                            <tr key={item.id}>
                                <td>
                                    <div className={styles.dateTime}>
                                        <span className={styles.dateText}><FiCalendar /> {item.date}</span>
                                        <span className={styles.lessonText}><FiClock /> {item.lessonNumber} пара</span>
                                    </div>
                                </td>
                                <td>
                                    <div className={styles.subjectName}>{item.subjectName}</div>
                                    <div className={styles.teacherName}>{item.teacherFullName}</div>
                                </td>
                                <td><span className={styles.groupBadge}>{item.groupName}</span></td>
                                <td>
                                    <div className={styles.typeInfo}>
                                        <span className={`${styles.typeTag} ${styles[item.type.toLowerCase()]}`}>{item.type}</span>
                                        {item.room && <span className={styles.room}><FiMapPin /> {item.room}</span>}
                                    </div>
                                </td>
                                <td className={styles.tableActions}>
                                    <button className={styles.editBtn} onClick={() => router.push(`/admin/schedule/edit/${item.id}`)}><FiEdit2 /></button>
                                    <button className={styles.deleteBtn} onClick={() => handleDelete(item.id)}><FiTrash2 /></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}