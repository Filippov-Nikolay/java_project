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
  label?: string;
  className?: string;
}

export const CustomSelect = ({ options, value, onChange, label, className }: SelectProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  const currentLabel = options.find(o => o.value === value)?.label || label;

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
        className={clsx(styles.trigger, isOpen && styles.active)} 
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