"use client";

import { useState, useEffect } from "react";
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer } from "recharts";
import { ScoreBar, SubjectStat, SkillDatum, assessmentApi } from "@entities/assessment"; 
import { PeriodFilter, PeriodValue } from "@shared/ui/PeriodFilter";
import { usePeriodFilter } from "@shared/hooks/usePeriodFilter";
import { DashboardCard } from "@shared/ui/DashboardCard";
import styles from "./styles.module.scss";

export const DashboardAverageScoreCard = () => {
  const { period, setPeriod } = usePeriodFilter({ initial: "year" });
  const [data, setData] = useState<{ stats: SubjectStat[], skills: SkillDatum[] } | null>(null);

  useEffect(() => {
    setData(null); // Показуємо лоадер при зміні періоду
    assessmentApi.getStudentStats(period).then(setData);
  }, [period]);

  return (
    <DashboardCard title="Статистика" rightSlot={<PeriodFilter value={period} onChange={setPeriod} />}>
      {!data ? (
        <div className={styles.loading}>Оновлення...</div>
      ) : (
        <div className={styles.chartRow}>
          <div className={styles.chartWrapper}>
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={data.skills}>
                <PolarGrid strokeDasharray="3 3" />
                <PolarAngleAxis dataKey="skill" tick={{ fill: "var(--text-secondary)", fontSize: 11 }} />
                <Radar dataKey="value" stroke="var(--accent)" fill="var(--accent)" fillOpacity={0.45} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
          <div className={styles.skillsList}>
            {data.stats.map((s) => <ScoreBar key={s.label} data={s} />)}
          </div>
        </div>
      )}
    </DashboardCard>
  );
};