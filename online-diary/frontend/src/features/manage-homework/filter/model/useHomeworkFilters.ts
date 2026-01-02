"use client";

import { useState, useMemo } from "react";
import { Homework } from "@entities/homework";

export const useHomeworkFilters = (initialItems: Homework[]) => {
  const [activeTab, setActiveTab] = useState("todo");
  const [subject, setSubject] = useState("all");
  const [sortByOverdue, setSortByOverdue] = useState(false);
  const [sortOrder, setSortOrder] = useState("newest");

  const filteredItems = useMemo(() => {

    let result = initialItems.filter(item => {
      const matchTab = item.status === activeTab;
      const matchSubject = subject === "all" || item.subjectName === subject;
      const matchOverdue = sortByOverdue ? item.isOverdue === true : true;

      return matchTab && matchSubject && matchOverdue;
    });

    result.sort((a, b) => {
      const parseDate = (d: string) => {

          const parts = d.split('.');
          return new Date(`${parts[2]}-${parts[1]}-${parts[0]}`).getTime();
      };
      const dateA = parseDate(a.date);
      const dateB = parseDate(b.date);

      return sortOrder === "newest" ? dateB - dateA : dateA - dateB;
    });

    return result;
  }, [initialItems, activeTab, subject, sortByOverdue, sortOrder]);

  return {
    filteredItems,
    activeTab, setActiveTab,
    subject, setSubject,
    sortByOverdue, setSortByOverdue,
    sortOrder, setSortOrder,
    totalCount: filteredItems.length
  };
};