"use client";

import { DashboardRowItem } from "@shared/ui/RowItem";
import { DashboardCard } from "@shared/ui/DashboardCard";
import styles from "./styles.module.scss";

export type RecommendationType = "video" | "article" | "practice" | "quiz";

export type Recommendation = {
  id: string;
  title: string;       
  subject: string;      
  kind: RecommendationType;
  duration?: string; 
  source?: string;      
};

interface DashboardRecommendationCardProps {
  items: Recommendation[];
}

const KIND_ICON: Record<RecommendationType, string> = {
  video: "▶️",
  article: "📄",
  practice: "💻",
  quiz: "❓",
};

const KIND_LABEL: Record<RecommendationType, string> = {
  video: "Відео-лекція",
  article: "Стаття / конспект",
  practice: "Практика",
  quiz: "Тест / квіз",
};

export const DashboardRecommendationCard = ({
  items,
}: DashboardRecommendationCardProps) => {
  return (
    <DashboardCard title="Рекомендовані матеріали">
      <div className={styles.list}>
        {items.map((item) => {
          const meta = (
            <>
              <span>{item.subject}</span>
              <span>{KIND_LABEL[item.kind]}</span>
              {item.duration && <span>{item.duration}</span>}
              {item.source && <span>{item.source}</span>}
            </>
          );

          return (
            <DashboardRowItem
              key={item.id}
              icon={KIND_ICON[item.kind]}
              iconColor="var(--accent)"
              title={item.title}
              meta={meta}
            />
          );
        })}

        {items.length === 0 && (
          <div className={styles.empty}>
            Поки що немає рекомендацій. Як тільки з&#39;являться матеріали – ми
            покажемо їх тут.
          </div>
        )}
      </div>
    </DashboardCard>
  );
};
