"use client";

import { useState, useRef, useEffect } from "react";
import styles from "./styles.module.scss";
import clsx from "clsx";

interface Option {
  value: string;
  label: string;
}

interface SelectProps {
  options: Option[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string; // Додано для підтримки підказок
  label?: string; // Можна використовувати як альтернативу placeholder
  className?: string;
}

export const CustomSelect = ({ options, value, onChange, placeholder, label, className }: SelectProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  // Пріоритет тексту: Обраний варіант -> Placeholder -> Label -> Дефолтний текст
  const selectedOption = options.find(o => o.value === value);
  const currentLabel = selectedOption ? selectedOption.label : (placeholder || label || "Виберіть...");

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setIsOpen(false);
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div className={clsx(styles.root, className)} ref={rootRef}>
      <button 
        type="button" 
        className={clsx(styles.trigger, isOpen && styles.active, !selectedOption && styles.isPlaceholder)} 
        onClick={() => setIsOpen(!isOpen)}
      >
        <span>{currentLabel}</span>
        <span className={clsx(styles.arrow, isOpen && styles.arrowRotated)}>▾</span>
      </button>

      {isOpen && (
        <ul className={styles.menu}>
          {options.map((opt) => (
            <li 
              key={opt.value} 
              className={clsx(styles.option, opt.value === value && styles.optionSelected)}
              onClick={() => {
                onChange(opt.value);
                setIsOpen(false);
              }}
            >
              {opt.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};