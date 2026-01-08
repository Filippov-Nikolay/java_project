"use client";

import { DashboardRowItem } from "@shared/ui/RowItem";

import { Accrual, AccrualKind } from "../../model/types"; 
import styles from "./styles.module.scss";
import { FiBookOpen, FiCalendar, FiFolder } from "react-icons/fi";

interface AccrualItemProps {
  data: Accrual;
}

const KIND_LABEL: Record<AccrualKind, string> = {
  attendance: "Присутність на парі",
  classwork: "Оцінка на парі",
  homework: "Оцінка за ДЗ",
};

const KIND_ICON: Record<AccrualKind, React.ReactNode> = {
  attendance: <FiCalendar />,
  classwork: <FiBookOpen />,
  homework: <FiFolder />,
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