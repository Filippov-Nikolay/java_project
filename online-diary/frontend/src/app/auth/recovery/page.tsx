"use client";

import { AuthHeader } from "@shared/layouts/AuthHeader";
import { AuthFooter } from "@shared/layouts/AuthFooter";
import RecoveryForm, {
  type RecoveryFormValues,
} from "@features/auth/ui/RecoveryForm";
// пока можно просто логировать, позже подвяжешь к useAuth
// import { useAuth } from "@features/auth/model/useAuth";

import styles from "../login/styles.module.scss"; // переиспользуем тот же layout

export default function ForgotPasswordPage() {
  // const { sendRecoveryLink, pending, error } = useAuth();
  const pending = false;
  const error: string | null = null;

  const handleSubmit = (values: RecoveryFormValues) => {
    // тут потом подвяжешь запрос на бэкенд
    console.log("Recovery request:", values.identifier);
  };

  return (
    <main className={styles.page}>
      <section className={styles.left}>
        <AuthHeader />

        <div className={styles.content}>
          <div className={styles.heading}>
            <h1 className={styles.title}>Забули пароль?</h1>
            <p className={styles.subtitle}>
              Введіть свою адресу електронної пошти нижче,
              і ми надішлемо вам електронний лист, який дозволить вам скинути її.
            </p>
          </div>

          <RecoveryForm
            onSubmit={handleSubmit}
            pending={pending}
            error={error}
          />
        </div>

        <AuthFooter/>
      </section>

      <aside className={styles.right}>
        <div className={styles.overlay} />
        <div className={styles.heroContent} />
      </aside>
    </main>
  );
}
