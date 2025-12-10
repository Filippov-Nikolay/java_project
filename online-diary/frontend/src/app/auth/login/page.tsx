"use client";

import LoginForm, { type LoginFormValues } from "@features/auth/ui/LoginForm";
import { useAuth } from "@features/auth/model/useAuth";
import Link from "next/link";
import styles from "./styles.module.scss";
import { AuthHeader } from "@shared/layouts/AuthHeader";
import { AuthFooter } from "@shared/layouts/AuthFooter";

export default function LoginPage() {
    const { login, pending, error } = useAuth();

    const handleSubmit = (values: LoginFormValues) => {
        login(values);
    };

    return (
        <main className={styles.page}>
            {/* Левая часть: логин */}
            <section className={styles.left}>
                <AuthHeader/>

                <div className={styles.content}>
                  <div className={styles.heading}>
                      <h1 className={styles.title}>Логін</h1>
                  </div>

                    <LoginForm onSubmit={handleSubmit} pending={pending} error={error} />

                    <Link href="/auth/recovery" className={styles.forgot}>
                        Забули пароль?
                    </Link>
                </div>

                <AuthFooter/>
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
