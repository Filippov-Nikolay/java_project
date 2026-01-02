"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Input from "@shared/ui/Input";
import Button from "@shared/ui/Button";
import styles from "./page.module.scss";

export default function CreateUserPage() {
    const router = useRouter();
    const [groups, setGroups] = useState<{id: number, name: string}[]>([]);
    const [pending, setPending] = useState(false);
    const [avatar, setAvatar] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    
    const [formData, setFormData] = useState({
        login: "",
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        role: "STUDENT",
        groupId: "",
    });

    useEffect(() => {
        const token = localStorage.getItem("token");
        fetch("http://localhost:8080/api/groups", {
            headers: { "Authorization": `Bearer ${token}` }
        })
        .then(res => res.json())
        .then(data => setGroups(Array.isArray(data) ? data : []))
        .catch(err => console.error("Помилка груп:", err));
    }, []);

    useEffect(() => {
        if (!avatar) return setPreviewUrl(null);
        const url = URL.createObjectURL(avatar);
        setPreviewUrl(url);
        return () => URL.revokeObjectURL(url);
    }, [avatar]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setPending(true);

        const data = new FormData();
        Object.entries(formData).forEach(([key, value]) => data.append(key, value));
        if (avatar) data.append("avatar", avatar);

        const token = localStorage.getItem("token");
        try {
            const res = await fetch("http://localhost:8080/api/auth/register", {
                method: "POST",
                headers: { "Authorization": `Bearer ${token}` },
                body: data,
            });

            if (res.ok) {
                alert("Користувача успішно створено!");
                router.push("/admin/users");
            } else {
                const errText = await res.text();
                alert(`Помилка: ${errText}`);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setPending(false);
        }
    };

    return (
        <div className={styles.createPage}>
            <header className={styles.header}>
                <h2>Новий користувач</h2>
                <p>Створення облікового запису для студента, викладача або адміна</p>
            </header>

            <form onSubmit={handleSubmit} className={styles.formCard}>
                <div className={styles.avatarUpload}>
                    <div className={styles.preview}>
                        {previewUrl ? <img src={previewUrl} alt="Preview" /> : <span>?</span>}
                    </div>
                    <label className={styles.uploadLabel}>
                        Вибрати фото
                        <input type="file" hidden accept="image/*" onChange={(e) => setAvatar(e.target.files?.[0] || null)} />
                    </label>
                </div>

                <div className={styles.inputsGrid}>
                    <Input label="Логін" value={formData.login} onChange={(e) => setFormData({...formData, login: e.target.value})} required />
                    <Input label="Email" type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} required />
                    <Input label="Ім'я" value={formData.firstName} onChange={(e) => setFormData({...formData, firstName: e.target.value})} required />
                    <Input label="Прізвище" value={formData.lastName} onChange={(e) => setFormData({...formData, lastName: e.target.value})} required />
                    <Input label="Пароль" type="password" value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} required />
                    
                    <div className={styles.field}>
                        <label>Роль</label>
                        <select value={formData.role} onChange={(e) => setFormData({...formData, role: e.target.value})}>
                            <option value="STUDENT">Студент</option>
                            <option value="TEACHER">Викладач</option>
                            <option value="ADMIN">Адміністратор</option>
                        </select>
                    </div>

                    {formData.role === "STUDENT" && (
                        <div className={styles.field}>
                            <label>Група</label>
                            <select value={formData.groupId} onChange={(e) => setFormData({...formData, groupId: e.target.value})}>
                                <option value="">Без групи</option>
                                {groups.map(g => <option key={g.id} value={g.id}>{g.name}</option>)}
                            </select>
                        </div>
                    )}
                </div>

                <div className={styles.footer}>
                    <Button type="button" label="Скасувати" variant="secondary" onClick={() => router.back()} />
                    <Button type="submit" label={pending ? "Збереження..." : "Створити"} disabled={pending} />
                </div>
            </form>
        </div>
    );
}