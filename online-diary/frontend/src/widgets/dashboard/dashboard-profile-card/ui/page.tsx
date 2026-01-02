"use client";

import Link from "next/link";
import KeyboardArrowRightRoundedIcon from "@mui/icons-material/KeyboardArrowRightRounded";
import { DashboardCard } from "@shared/ui/DashboardCard";
import styles from "./styles.module.scss";

type QuickStat = {
  value: number | string;
  label: string;
  href: string;
};

interface DashboardProfileCardProps {
  studentName: string;
  group: string;
  initials: string;
  avatarUrl?: string;
  quickStats: QuickStat[];
}

export const DashboardProfileCard = ({
  studentName,
  group,
  initials,
  avatarUrl,
  quickStats,
}: DashboardProfileCardProps) => {
  return (
    <DashboardCard className={styles.profileCard}>
      <div className={styles.top}>
        <div className={styles.header}>
          <div className={styles.avatar}>

            {avatarUrl ? (
              <img 
                src={avatarUrl} 
                alt={studentName} 
                className={styles.avatarImage} 
              />
            ) : (
              <span>{initials}</span>
            )}
          </div>

          <div className={styles.text}>
            <p className={styles.greeting}>
              Привіт, <span className={styles.name}>{studentName}</span>
            </p>
            <p className={styles.sub}>{group}</p>
          </div>
        </div>

        <Link
          href="/profile"
          className={styles.more}
          aria-label="Перейти в профіль"
        >
          <KeyboardArrowRightRoundedIcon className={styles.moreIcon} />
        </Link>
      </div>

      <div className={styles.infoRow}>
        {quickStats.map((item) => (
          <Link key={item.label} href={item.href} className={styles.infoItem}>
            <div className={styles.infoTexts}>
              <span className={styles.infoValue}>{item.value}</span>
              <span className={styles.infoLabel}>{item.label}</span>
            </div>
            <KeyboardArrowRightRoundedIcon className={styles.infoChevron} />
          </Link>
        ))}
      </div>
    </DashboardCard>
  );
};