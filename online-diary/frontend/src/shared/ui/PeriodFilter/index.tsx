"use client";

import React from "react";
import styles from "./styles.module.scss";

export type PeriodValue = "month" | "semester" | "year";

type PeriodFilterProps = {
  value: PeriodValue;
  onChange: (value: PeriodValue) => void;
  className?: string;
};

const OPTIONS: { value: PeriodValue; label: string }[] = [
  { value: "month",    label: "Місяць" },
  { value: "semester", label: "Семестр" },
  { value: "year",     label: "Рік" },
];

export const PeriodFilter: React.FC<PeriodFilterProps> = ({
  value,
  onChange,
  className,
}) => {
  return (
    <div className={`${styles.root} ${className ?? ""}`}>
      {OPTIONS.map((opt) => (
        <button
          key={opt.value}
          type="button"
          className={
            value === opt.value
              ? `${styles.option} ${styles.optionActive}`
              : styles.option
          }
          onClick={() => onChange(opt.value)}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
};
