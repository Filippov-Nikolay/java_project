"use client";

import { DashboardRowItem } from "@shared/ui/RowItem";

import { Accrual, AccrualKind } from "../../model/types"; 
import styles from "./styles.module.scss";

interface AccrualItemProps {
  data: Accrual;
}

const KIND_LABEL: Record<AccrualKind, string> = {
  attendance: "Присутність на парі",
  classwork: "Оцінка на парі",
  homework: "Оцінка за ДЗ",
};

const KIND_ICON: Record<AccrualKind, string> = {
  attendance: "📅",
  classwork: "📘",
  homework: "📂",
};

const KIND_COLOR: Record<AccrualKind, string> = {
  attendance: "#3b82f6",
  classwork: "#22c55e",
  homework: "#f97316",
};

export const AccrualItem = ({ data }: AccrualItemProps) => {

  const hasScore = typeof data.score === "number" && typeof data.maxScore === "number";

  const meta = (
    <>
      <span className={styles.kindLabel}>{KIND_LABEL[data.kind]}</span>
      
      {hasScore && (
        <span className={styles.score}>
          Оцінка: <strong>{data.score}/{data.maxScore}</strong>
        </span>
      )}

      {data.crystalsDelta && data.crystalsDelta > 0 ? (
        <span className={styles.crystals}>+{data.crystalsDelta} 💎</span>
      ) : null}
      
      <span className={styles.date}>{data.date}</span>
    </>
  );

  return (
    <DashboardRowItem
      icon={KIND_ICON[data.kind]}
      iconColor={KIND_COLOR[data.kind]}
      title={`${data.subject} · ${data.title}`}
      meta={meta}
    />
  );
};