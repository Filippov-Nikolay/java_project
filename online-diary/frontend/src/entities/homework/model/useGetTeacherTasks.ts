"use client";

import { useState, useEffect, useCallback } from "react";
import { getTeacherAssessmentsRequest } from "../api/homeworkApi"; 
import { TeacherTask } from "./types";

export const useGetTeacherTasks = () => {
  const [tasks, setTasks] = useState<TeacherTask[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchTasks = useCallback(async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem("token");
      const data = await getTeacherAssessmentsRequest(token);
      
      if (Array.isArray(data)) {
        const formatted: TeacherTask[] = data.map(item => ({
          id: item.id,
          title: item.title,
          subjectName: item.subjectName || "—",
          groupName: item.groupName || "—",
          createdAt: new Date(item.createdAt).toLocaleDateString('uk-UA'),
          deadline: new Date(item.deadline).toLocaleDateString('uk-UA'),
          isOverdue: new Date(item.deadline) < new Date(),
          iconFileName: item.iconFileName,
          stats: {
            submitted: item.submissionCount || 0,
            total: item.totalStudents || 0
          }
        }));
        setTasks(formatted);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => { fetchTasks(); }, [fetchTasks]);

  return { tasks, isLoading, refetch: fetchTasks };
};