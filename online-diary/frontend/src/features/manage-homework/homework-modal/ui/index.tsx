"use client";
import { useState } from "react";
import { Homework } from "@entities/homework";
import styles from "./styles.module.scss";

interface Props {
  mode: 'create' | 'edit';
  data?: Homework | null;
  onClose: () => void;
  onRefresh: () => void;
}

export const HomeworkModal = ({ mode, data, onClose, onRefresh }: Props) => {
  const [form, setForm] = useState({
    title: data?.title || "",

    description: data?.description || "", 
    deadline: data?.date ? data.date.split('.').reverse().join('-') : "" 
  });

  const handleSave = async () => {

    console.log("Saving assessment to Oracle...", form);
    onRefresh();
    onClose();
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <h2>{mode === 'create' ? 'Створити завдання' : 'Редагувати'}</h2>
        <div className={styles.formGroup}>
          <input 
            className={styles.input}
            placeholder="Назва завдання"
            value={form.title}
            onChange={(e) => setForm({...form, title: e.target.value})}
          />
          <textarea 
            className={styles.textarea}
            placeholder="Опис завдання"
            value={form.description}
            onChange={(e) => setForm({...form, description: e.target.value})}
          />
        </div>
        <div className={styles.actions}>
          <button className={styles.saveBtn} onClick={handleSave}>Зберегти</button>
          <button className={styles.cancelBtn} onClick={onClose}>Скасувати</button>
        </div>
      </div>
    </div>
  );
};