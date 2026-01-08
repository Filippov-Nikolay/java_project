"use client";

import { useState } from "react";
import { useProfile } from "@entities/user/model/useProfile";
import { DashboardCard } from "@shared/ui/DashboardCard";
import Button from "@shared/ui/Button";
import { 
    IoCameraOutline, IoMailOutline, IoPersonOutline, 
    IoLockClosedOutline, IoShieldCheckmarkOutline, IoSchoolOutline, 
    IoSync
} from "react-icons/io5";
import styles from "./styles.module.scss";

export default function ProfilePage() {
    const { 
        user, loading, initials, 
        isAvatarSubmitting,  
        isPasswordSubmitting, 
        message, 
        handleAvatarUpload, 
        handlePasswordUpdate 
    } = useProfile();

    const [pass, setPass] = useState("");
    const [confirm, setConfirm] = useState("");

    if (loading) return <div className={styles.loader}>Оновлення даних...</div>;
    if (!user) return <div className={styles.error}>Користувача не знайдено</div>;

    return (
        <div className={styles.container}>
            <header className={styles.pageHeader}>
                <h1>Налаштування профілю</h1>
                <p>Керуйте своїми персональними даними та безпекою аккаунта</p>
            </header>

            <div className={styles.grid}>
                <div className={styles.leftSide}>
                    <DashboardCard className={styles.avatarCard}>
                        <div className={styles.avatarSection}>
                            <div className={styles.avatarWrapper}>
                                {/* Лоадер аватара - тепер він незалежний */}
                                {isAvatarSubmitting && (
                                    <div className={styles.avatarLoader}>
                                        <IoSync />
                                    </div>
                                )}
                                
                                {user.avatarUrl ? (
                                    <img src={user.avatarUrl} alt="Avatar" />
                                ) : (
                                    <div className={styles.initialsPlaceholder}>{initials}</div>
                                )}
                                
                                <label className={styles.uploadOverlay}>
                                    <IoCameraOutline />
                                    <input 
                                        type="file" 
                                        hidden 
                                        disabled={isAvatarSubmitting}
                                        accept="image/*" 
                                        onChange={(e) => e.target.files?.[0] && handleAvatarUpload(e.target.files[0])} 
                                    />
                                </label>
                            </div>
                            <h2 className={styles.fullName}>{user.firstName} {user.lastName}</h2>
                            <span className={styles.roleTag}>{user.role}</span>
                        </div>
                        
                        <div className={styles.statusInfo}>
                            <div className={styles.statusItem}>
                                <IoShieldCheckmarkOutline />
                                <span>Аккаунт захищено</span>
                            </div>
                        </div>
                    </DashboardCard>
                </div>

                <div className={styles.rightSide}>
                    <DashboardCard title="Облікові дані" className={styles.infoCard}>
                        <div className={styles.formGrid}>
                            <div className={styles.field}>
                                <label><IoPersonOutline /> Логін</label>
                                <input type="text" value={user.login} readOnly />
                                <small>Логін неможливо змінити</small>
                            </div>
                            <div className={styles.field}>
                                <label><IoMailOutline /> Електронна пошта</label>
                                <input type="email" value={user.email} readOnly />
                            </div>
                            {user.groupName && (
                                <div className={styles.field}>
                                    <label><IoSchoolOutline /> Група</label>
                                    <input type="text" value={user.groupName} readOnly />
                                </div>
                            )}
                        </div>
                    </DashboardCard>

                    <DashboardCard title="Безпека" className={styles.securityCard}>
                        <form className={styles.passwordForm} onSubmit={(e) => {
                            e.preventDefault();
                            handlePasswordUpdate(pass, confirm);
                        }}>
                            <div className={styles.field}>
                                <label><IoLockClosedOutline /> Новий пароль</label>
                                <input 
                                    type="password" 
                                    placeholder="Введіть новий пароль" 
                                    value={pass}
                                    onChange={(e) => setPass(e.target.value)}
                                    required
                                />
                            </div>
                            <div className={styles.field}>
                                <label>Підтвердіть пароль</label>
                                <input 
                                    type="password" 
                                    placeholder="Повторіть пароль" 
                                    value={confirm}
                                    onChange={(e) => setConfirm(e.target.value)}
                                    required
                                />
                            </div>

                            {message && (
                                <div className={message.type === 'success' ? styles.successMsg : styles.errorMsg}>
                                    {message.text}
                                </div>
                            )}

                            <div className={styles.formActions}>
                                <Button variant="primary" type="submit" disabled={isPasswordSubmitting}>
                                    {isPasswordSubmitting ? "Збереження..." : "Оновити пароль"}
                                </Button>
                            </div>
                        </form>
                    </DashboardCard>
                </div>
            </div>
        </div>
    );
}