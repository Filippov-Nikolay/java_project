"use client";

import { useState, useEffect, useMemo } from "react";
import dayjs from "dayjs";
import styles from "./styles.module.scss";

import { useGetHomeworks, useHomeworkStats } from "@entities/homework";
import { useUser } from "@entities/user";
import { useDaySchedule } from "@entities/schedule";
import { assessmentApi, Accrual } from "@entities/assessment";

import { DashboardProfileCard } from "@widgets/dashboard/dashboard-profile-card";
import { DashboardAverageScoreCard } from "@widgets/dashboard/dashboard-average-score-card";
import { DashboardRecommendationCard } from "@widgets/dashboard/dashboard-recommendation-card";
import { DashboardAccrualsCard } from "@widgets/dashboard/dashboard-accruals-card";
import { DashboardCalendarCard } from "@widgets/dashboard/dashboard-calendar-card";
import { DashboardNewsCard } from "@widgets/dashboard/dashboard-news-card";

import type { Recommendation } from "@widgets/dashboard/dashboard-recommendation-card";
import type { NewsItem } from "@widgets/dashboard/dashboard-news-card";
import hackathonImg from "@shared/assets/photo.jpg";

const RECOMMENDATIONS: Recommendation[] = [
  { id: "1", title: "Java Programming · Вступ до OOP", subject: "Java Programming", kind: "video", duration: "12 хв", source: "YouTube" },
  { id: "2", title: "Веб-розробка · Flexbox та Grid", subject: "Веб-розробка", kind: "article", duration: "15 хв", source: "MDN" },
  { id: "3", title: "Бази даних · Практика JOIN", subject: "Бази даних", kind: "practice", duration: "25 хв", source: "Stepik" },
  { id: "4", title: "Алгоритми · Тест по сортуванню", subject: "Алгоритми", kind: "quiz", duration: "10 хв", source: "Google Forms" }
];

const NEWS_ITEMS: NewsItem[] = [
  { id: "1", title: "Hackathon", subtitle: "Насичений тиждень з хакатоном...", date: "22.05.2024", imageUrl: hackathonImg, href: "/news/1" }
];

export default function DashboardPage() {
  const today = useMemo(() => dayjs(), []);
  const [accruals, setAccruals] = useState<Accrual[]>([]);

  const { user, initials, isLoading: isUserLoading } = useUser();
  const { homeworks, isLoading: isHwLoading } = useGetHomeworks();
  const { lessons, loading: isScheduleLoading } = useDaySchedule(today);

  useEffect(() => {

    assessmentApi.getStudentAccruals().then(setAccruals);
  }, []);

  const todayLessonsCount = lessons.filter((lesson: any) => 
    dayjs(lesson.date).format("YYYY-MM-DD") === today.format("YYYY-MM-DD")
  ).length;

  const { todoCount, overdueCount } = useHomeworkStats(homeworks);



  const quickStats = [
    { value: todayLessonsCount, label: "пар сьогодні", href: "/schedule" },
    { value: todoCount, label: "Завдання до виконання", href: "/homework" },
    { value: overdueCount, label: "Завдань протерміновано", href: "/homework" },
  ];

  return (
    <div className={styles.page}>
      <div className={styles.grid}>
        <div className={styles.colLeft}>
          <DashboardProfileCard
            studentName={user?.firstName || "Гість"}
            group={user?.groupName || "Група"}
            initials={initials}
            avatarUrl={user?.avatarUrl} 
            quickStats={quickStats}
          />
          <DashboardAccrualsCard accruals={accruals} />
          <DashboardNewsCard items={NEWS_ITEMS}/>
        </div>

        <div className={styles.colCenter}>
          <DashboardAverageScoreCard />
          <DashboardRecommendationCard items={RECOMMENDATIONS} />
        </div>

        <div className={styles.colRight}>
          <DashboardCalendarCard />
        </div>
      </div>
    </div>
  );
}