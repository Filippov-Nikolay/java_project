"use client";

import Link from "next/link";
import Image from "next/image";
import { NewsItem } from "../../model/types";
import styles from "./styles.module.scss";


interface NewsCardProps {
  data: NewsItem;
}

export const NewsCard = ({ data }: NewsCardProps) => {
  const { title, subtitle, date, imageUrl, href } = data;
  
  const content = (
    <>
      <div className={styles.imageWrapper}>
        {imageUrl ? (
          <Image src={imageUrl} alt={title} className={styles.image} fill />
        ) : (
          <div className={styles.imageStub} />
        )}
      </div>
      <div className={styles.body}>
        <h3 className={styles.newsTitle}>{title}</h3>
        {subtitle && <p className={styles.newsSubtitle}>{subtitle}</p>}
        <p className={styles.newsMeta}>Розміщено: {date}</p>
      </div>
    </>
  );

  if (href) return <Link href={href} className={styles.root}>{content}</Link>;
  return <div className={styles.root}>{content}</div>;
};