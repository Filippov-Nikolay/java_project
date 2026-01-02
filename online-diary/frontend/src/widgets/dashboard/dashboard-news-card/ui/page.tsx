export type { NewsItem } from "@entities/news"; 
import { NewsCard, NewsItem } from "@entities/news";
import { DashboardCard } from "@shared/ui/DashboardCard";
import { HorizontalCarousel } from "@shared/ui/HorizontalCarousel";

interface Props {
  items: NewsItem[];
}

export const DashboardNewsCard = ({ items = [] }: Props) => {
  return (
    <DashboardCard title="University News">
      <HorizontalCarousel>
        {items.map((news) => (
          <NewsCard key={news.id} data={news} />
        ))}
      </HorizontalCarousel>
    </DashboardCard>
  );
};