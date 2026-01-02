import { StaticImageData } from "next/image";

export interface NewsItem {
  id: string;
  title: string;
  subtitle: string;
  date: string;
  imageUrl?: string | StaticImageData;
  href?: string;
}