"use client";

import { SubjectStat } from "../../model/types";
import styles from "./styles.module.scss";

interface ScoreBarProps {
  data: SubjectStat;
  decimals?: number;
}

export const ScoreBar = ({ data, decimals = 1 }: ScoreBarProps) => {
  const { label, score, maxScore, color } = data;
  const percent = Math.max(0, Math.min(100, (score / maxScore) * 100));
  const formatted = score.toFixed(decimals);

  return (
    <div className={styles.root}>
      <div className={styles.header}>
        <span className={styles.name}>{label}</span>
        <span className={styles.value}>
          {formatted} / {maxScore}
        </span>
      </div>
      <div className={styles.track}>
        <div
          className={styles.fill}
          style={{ width: `${percent}%`, background: color }}
        />
      </div>
    </div>
  );
};