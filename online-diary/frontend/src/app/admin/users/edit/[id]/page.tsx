"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Input from "@shared/ui/Input";
import Button from "@shared/ui/Button";
import styles from "./page.module.scss";

export default function EditUserPage() {
    const router = useRouter();
    const { id } = useParams();
    const [groups, setGroups] = useState<{id: number, name: string}[]>([]);
    const [loading, setLoading] = useState(true);

    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        role: "",
        groupId: "",
    });

    useEffect(() => {
    const token = localStorage.getItem("token");
    const headers = { "Authorization": `Bearer ${token}` };

    Promise.all([
        fetch(`http://localhost:8080/api/auth/users/${id}`, { headers }).then(res => res.json()),
        fetch("http://localhost:8080/api/groups", { headers }).then(res => res.json())
    ]).then(([user, groupsData]) => {
        setFormData({
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            role: user.role,
            groupId: user.groupId ? user.groupId.toString() : "", 
        });
        setGroups(groupsData);
        setLoading(false);
    }).catch(err => console.error("Помилка завантаження:", err));
}, [id]);

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        const token = localStorage.getItem("token");

        const res = await fetch(`http://localhost:8080/api/auth/users/${id}`, {
            method: "PUT",
            headers: { 
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(formData),
        });

        if (res.ok) {
            alert("Дані оновлено успішно!");
            router.push("/admin/users");
        }
    };

    if (loading) return <div>Завантаження...</div>;

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <h2>Редагування профілю</h2>
                <p>Зміна даних користувача ID: {id}</p>
            </header>

            <form onSubmit={handleUpdate} className={styles.formCard}>
                <div className={styles.grid}>
                    <Input label="Ім'я" value={formData.firstName} onChange={e => setFormData({...formData, firstName: e.target.value})} />
                    <Input label="Прізвище" value={formData.lastName} onChange={e => setFormData({...formData, lastName: e.target.value})} />
                    <Input label="Email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
                    
                    <div className={styles.field}>
                        <label>Роль</label>
                        <select value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})}>
                            <option value="STUDENT">Студент</option>
                            <option value="TEACHER">Викладач</option>
                            <option value="ADMIN">Адміністратор</option>
                        </select>
                    </div>

                    {formData.role === "STUDENT" && (
                        <div className={styles.field}>
                            <label>Група</label>
                            <select value={formData.groupId} onChange={e => setFormData({...formData, groupId: e.target.value})}>
                                <option value="">Без групи</option>
                                {groups.map(g => <option key={g.id} value={g.id}>{g.name}</option>)}
                            </select>
                        </div>
                    )}
                </div>

                <div className={styles.footer}>
                    <Button type="button" label="Скасувати" variant="secondary" onClick={() => router.back()} />
                    <Button type="submit" label="Зберегти зміни" />
                </div>
            </form>
        </div>
    );
}