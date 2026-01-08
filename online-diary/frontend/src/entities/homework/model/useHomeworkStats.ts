import { useMemo } from "react";
import { Homework } from "./types";
import { isActuallyOverdue } from "../lib/utils";

export const useHomeworkStats = (homeworks: Homework[]) => {
  return useMemo(() => {

    const todoList = homeworks.filter(h => h.status === 'todo');
    
    return {
      todoCount: todoList.length,

      overdueCount: todoList.filter(isActuallyOverdue).length,
    };
  }, [homeworks]);
};