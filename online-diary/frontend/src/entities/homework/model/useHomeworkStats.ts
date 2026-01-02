import { useMemo } from "react";
import { Homework } from "./types";

export const useHomeworkStats = (homeworks: Homework[]) => {
  return useMemo(() => {
    return {
      todoCount: homeworks.filter(h => h.status === 'todo').length,
      overdueCount: homeworks.filter(h => h.isOverdue).length,
    };
  }, [homeworks]);
};