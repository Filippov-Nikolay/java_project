import type { Metadata } from "next";
import type { ReactNode } from "react";
import "@shared/styles/globals.scss";

export const metadata: Metadata = {
  title: "Online Diary",
  description: "Digital journal for school management",
};

type RootLayoutProps = {
  children: ReactNode;
};

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
