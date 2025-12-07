"use client";

import { useState } from "react";
import Input from "@shared/ui/Input";
import Button from "@shared/ui/Button";
import styles from "./styles.module.scss";

export type RecoveryFormValues = {
  identifier: string; // email или телефон
};

type RecoveryFormProps = {
  onSubmit: (values: RecoveryFormValues) => void;
  pending?: boolean;
  error?: string | null;
};

export default function RecoveryForm({
  onSubmit,
  pending,
  error,
}: RecoveryFormProps) {
  const [identifier, setIdentifier] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ identifier });
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <Input
        value={identifier}
        onChange={(e) => setIdentifier(e.target.value)}
        autoComplete="email"
        placeholder="E-mail або Телефон"
      />

      {error && <p className={styles.error}>{error}</p>}

      <Button
        type="submit"
        label={
          pending
            ? "Надсилання посилання..."
            : "Надіслати посилання для скидання пароля"
        }
        disabled={pending}
      />
    </form>
  );
}
