"use client";

import { useState, useEffect, useCallback } from "react";
import { getHomeworksRequest } from "../api/homeworkApi"; 
import { Homework } from "./types";

export const useGetHomeworks = () => {
  const [homeworks, setHomeworks] = useState<Homework[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchHomeworks = useCallback(async () => {
    setIsLoading(true);
    const token = localStorage.getItem("token");

    try {
      const data = await getHomeworksRequest(token);
      if (Array.isArray(data)) {
        const now = new Date();
        const formattedData: Homework[] = data.map((item: any) => {

          const dDate = item.deadline ? new Date(item.deadline) : null;
          const cDate = item.createdAt ? new Date(item.createdAt) : null;

          let monthName = "Без дати";
          if (cDate && !isNaN(cDate.getTime())) {
            const rawMonth = cDate.toLocaleString('uk-UA', { month: 'long' });
            monthName = rawMonth.charAt(0).toUpperCase() + rawMonth.slice(1);
          }
          return {
            id: item.id.toString(),
            title: item.title || "Без назви",
            subjectName: item.subjectName || "Загальне",
            description: item.description || "",
            teacherName: item.teacherName || "Викладач не вказаний",
            grade: item.grade,
            feedback: item.feedback,

            submissionFileName: item.submissionFileName, 
            iconFileName: item.iconFileName,
            fileName: item.fileName,

            createdAt: item.createdAt, 
            deadline: item.deadline, 
            pointsMax: item.pointsMax || 0,
            date: cDate ? cDate.toLocaleDateString('uk-UA') : "—",
            deadlineText: dDate ? `До ${dDate.toLocaleDateString('uk-UA')}` : "Термін не вказано",
            isOverdue: dDate ? dDate < now : false,
            month: monthName,
            status: item.status as 'todo' | 'pending' | 'done'
          };
        });
        setHomeworks(formattedData);
      }
    } catch (err) {
      console.error("Fetch error:", err);
      setHomeworks([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchHomeworks();
  }, [fetchHomeworks]);

  return { homeworks, isLoading, refetch: fetchHomeworks };
};