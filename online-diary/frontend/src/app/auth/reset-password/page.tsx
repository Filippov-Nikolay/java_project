"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AuthHeader } from "@shared/layouts/AuthHeader";
import { AuthFooter } from "@shared/layouts/AuthFooter";
import Input from "@shared/ui/Input";
import Button from "@shared/ui/Button";
import styles from "./styles.module.scss";

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Паролі не збігаються");
      return;
    }

    setPending(true);
    try {
      const res = await fetch("http://localhost:8080/api/auth/password-reset/confirm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password })
      });

      if (res.ok) {
        alert("Пароль успішно змінено!");
        router.push("/auth/login");
      } else {
        const data = await res.json();
        setError(data.message || "Помилка скидання пароля");
      }
    } catch (err) {
      setError("Сервер недоступний");
    } finally {
      setPending(false);
    }
  };

  return (
    <form onSubmit={handleReset} className={styles.form}>
      <div className={styles.inputGroup}>
        <Input 
          type="password" 
          label="Новий пароль" 
          placeholder="••••••••"
          value={password} 
          onChange={(e) => setPassword(e.target.value)} 
          required 
        />
        <Input 
          type="password" 
          label="Підтвердіть пароль" 
          placeholder="••••••••"
          value={confirmPassword} 
          onChange={(e) => setConfirmPassword(e.target.value)} 
          required 
        />
      </div>

      {error && <div className={styles.errorBadge}>{error}</div>}
      
      <Button 
        label="Встановити новий пароль" 
        type="submit" 
        isLoading={pending} 
        className={styles.submitBtn}
      />
    </form>
  );
}

export default function ResetPasswordConfirmPage() {
  return (
    <main className={styles.page}>
      <section className={styles.left}>
        <div className={styles.navWrap}>
          <AuthHeader />
        </div>
        
        <div className={styles.content}>
          <div className={styles.heading}>
            <h1 className={styles.title}>Створення пароля</h1>
            <p className={styles.subtitle}>
              Майже готово! Вкажіть новий надійний пароль для вашого облікового запису.
            </p>
          </div>

          <Suspense fallback={<div>Завантаження...</div>}>
            <ResetPasswordForm />
          </Suspense>
        </div>

        <div className={styles.footerWrap}>
          <AuthFooter />
        </div>
      </section>

      <aside className={styles.right}>
        <div className={styles.gradientCircles} />
        <div className={styles.glassCard}>
          <div className={styles.badge}>Security Update</div>
          <h2 className={styles.heroTitle}>Захистіть свій акаунт</h2>
          <p className={styles.heroText}>
            Використовуйте комбінацію літер, цифр та символів для максимальної безпеки вашого щоденника.
          </p>
        </div>
      </aside>
    </main>
  );
}