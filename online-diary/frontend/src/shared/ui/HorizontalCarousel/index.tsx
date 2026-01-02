"use client";

import { ReactNode, useRef } from "react";
import styles from "./styles.module.scss";
import KeyboardArrowRightRoundedIcon from "@mui/icons-material/KeyboardArrowRightRounded";
import KeyboardArrowLeftRoundedIcon from "@mui/icons-material/KeyboardArrowLeftRounded"

type HorizontalCarouselProps = {
  /** Карточки, которые скроллятся по горизонтали */
  children: ReactNode;
  /** Доп. класс, если нужно что-то подправить под конкретный виджет */
  className?: string;
};


export const HorizontalCarousel = ({ children, className }: HorizontalCarouselProps) => {
  const trackRef = useRef<HTMLDivElement | null>(null);

  const scroll = (direction: "prev" | "next") => {
    const el = trackRef.current;
    if (!el) return;

    const firstCard = el.firstElementChild as HTMLElement | null;
    const cardWidth = firstCard ? firstCard.offsetWidth + 16 : 260;

    el.scrollBy({
      left: direction === "next" ? cardWidth : -cardWidth,
      behavior: "smooth",
    });
  };

  return (
    <div className={className ? `${styles.root} ${className}` : styles.root}>
      <div className={styles.nav}>
        <button
          type="button"
          className={styles.navBtn}
          onClick={() => scroll("prev")}
          aria-label="Попередні"
        >
          <KeyboardArrowLeftRoundedIcon className={styles.infoChevron}/>
        </button>
        <button
          type="button"
          className={styles.navBtn}
          onClick={() => scroll("next")}
          aria-label="Наступні"
        >
          <KeyboardArrowRightRoundedIcon className={styles.infoChevron}/>
        </button>
      </div>

      <div ref={trackRef} className={styles.track}>
        {children}
      </div>
    </div>
  );
};
