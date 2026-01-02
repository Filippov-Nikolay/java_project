"use client";

import { Accrual, AccrualItem } from "@entities/assessment";
import { CustomSelect } from "@shared/ui/Select"; 
import { useSubjectFilter } from "@shared/hooks/useSubjectFilter";
import { DashboardCard } from "@shared/ui/DashboardCard";
import styles from "./styles.module.scss";

interface Props {
  accruals: Accrual[];
}

export const DashboardAccrualsCard = ({ accruals }: Props) => {
  const { subjectFilter, setSubjectFilter, subjects, filteredItems } = 
    useSubjectFilter<Accrual>(accruals);

  const subjectOptions = [
    { value: "all", label: "Всі предмети" },
    ...subjects.map((s) => ({ value: s, label: s })),
  ];

  return (
    <DashboardCard
      title="Останні нарахування"
      rightSlot={
        <CustomSelect
          value={subjectFilter}
          options={subjectOptions}
          onChange={setSubjectFilter}

          className={styles.filterSelect} 
        />
      }
    >
      <div className={styles.list}>
        {filteredItems.map((acc) => (
          <AccrualItem key={acc.id} data={acc} />
        ))}

        {filteredItems.length === 0 && (
          <div className={styles.empty}>Поки що немає нарахувань.</div>
        )}
      </div>
    </DashboardCard>
  );
};