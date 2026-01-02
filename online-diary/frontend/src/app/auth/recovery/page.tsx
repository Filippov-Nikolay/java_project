"use client";

import { useState } from "react";
import { AuthHeader } from "@shared/layouts/AuthHeader";
import { AuthFooter } from "@shared/layouts/AuthFooter";
import RecoveryForm, { type RecoveryFormValues } from "@features/auth/ui/RecoveryForm";
import styles from "../login/styles.module.scss";

export default function ForgotPasswordPage() {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (values: RecoveryFormValues) => {
    setPending(true);
    setError(null);
    
    try {
      const res = await fetch("http://localhost:8080/api/auth/password-reset/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: values.identifier })
      });

      if (res.ok) {
        setSuccess(true);
      } else {
        const data = await res.json();
        setError(data.message || "Сталася помилка");
      }
    } catch (err) {
      setError("Сервер недоступний");
    } finally {
      setPending(false);
    }
  };

  if (success) {
    return (
      <main className={styles.page}>
        <section className={styles.left}>
          <div className={styles.content}>
            <h1 className={styles.title}>Перевірте пошту</h1>
            <p className={styles.subtitle}>Ми надіслали вам посилання для відновлення пароля.</p>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className={styles.page}>
      <section className={styles.left}>
        <AuthHeader />
        <div className={styles.content}>
          <div className={styles.heading}>
            <h1 className={styles.title}>Забули пароль?</h1>
            <p className={styles.subtitle}>Введіть свій Email для отримання посилання.</p>
          </div>
          <RecoveryForm onSubmit={handleSubmit} pending={pending} error={error} />
        </div>
        <AuthFooter/>
      </section>
      <aside className={styles.right}><div className={styles.overlay}/></aside>
    </main>
  );
}