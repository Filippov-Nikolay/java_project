"use client";

import { useState, useEffect } from "react";
import { getHomeworksRequest } from "../api/homeworkApi"; 
import { Homework } from "./types";

export const useGetHomeworks = () => {
  const [homeworks, setHomeworks] = useState<Homework[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");

    getHomeworksRequest(token)
      .then((data) => {
        if (Array.isArray(data)) {
          const now = new Date();
          const formattedData: Homework[] = data.map((item: any) => {
            const dDate = item.deadline ? new Date(item.deadline) : null;
            
            let monthName = "Без дати";
            if (dDate && !isNaN(dDate.getTime())) {
              const rawMonth = dDate.toLocaleString('uk-UA', { month: 'long' });
              monthName = rawMonth.charAt(0).toUpperCase() + rawMonth.slice(1);
            }

            return {
              id: item.id.toString(),
              subjectName: item.subject?.name || "Загальне",
              title: item.title || "Без назви",
              date: dDate ? dDate.toLocaleDateString('uk-UA') : "—",
              deadlineText: dDate ? `До ${dDate.toLocaleDateString('uk-UA')}` : "Термін не вказано",
              isOverdue: dDate ? dDate < now : false,
              month: monthName,
              status: 'todo'
            };
          });
          setHomeworks(formattedData);
        }
      })
      .catch((err) => {
        console.error("Fetch error:", err);
        setHomeworks([]);
      })
      .finally(() => setIsLoading(false));
  }, []);

  return { homeworks, isLoading };
};