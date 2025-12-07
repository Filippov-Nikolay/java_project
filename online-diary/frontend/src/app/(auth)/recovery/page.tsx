"use client";

import ThemeToggle from "@features/theme/ui/ThemeToggle";
import LoginForm, { type LoginFormValues } from "@features/auth/ui/LoginForm";
import { useAuth } from "@features/auth/model/useAuth";

import styles from "./styles.module.scss";

export default function LoginPage() {
    const { login, pending, error } = useAuth();

    const handleSubmit = (values: LoginFormValues) => {
        login(values);
    };

    return (
        <main className={styles.page}>
            {/* Левая часть: логин */}
            <section className={styles.left}>
                <header className={styles.header}>
                    <div className={styles.brand}>
                        {/* Можешь потом заменить на свой логотип */}
                        <span className={styles.logoMark}>JB</span>
                        <span className={styles.logoText}>JByte</span>
                    </div>

                    <div className={styles.headerRight}>
                        {/* Переключатель языка потом добавим, пока только тема */}
                        <ThemeToggle />
                    </div>
                </header>

                <div className={styles.content}>
                  <div className={styles.heading}>
                      <h1 className={styles.title}>Логін</h1>
                  </div>
                    

                    <LoginForm onSubmit={handleSubmit} pending={pending} error={error} />

                    <button type="button" className={styles.forgot}>
                        Забули пароль?
                    </button>
                </div>

                <footer className={styles.footer}>
                    <span className={styles.muted}>© {new Date().getFullYear()} JByte</span>
                </footer>
            </section>

            {/* Правая часть: иллюстрация / фон */}
            <aside className={styles.right}>
                <div className={styles.overlay} />
                <div className={styles.heroContent}>
                    
                </div>
            </aside>
        </main>
    );
}
