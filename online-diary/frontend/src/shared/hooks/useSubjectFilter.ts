"use client";

import { useMemo, useState } from "react";

export function useSubjectFilter<T extends { subject: string }>(items: T[]) {
  const [subjectFilter, setSubjectFilter] = useState<string>("all");

  const subjects = useMemo(
    () => Array.from(new Set(items.map((i) => i.subject))),
    [items],
  );

  const filteredItems = useMemo(
    () =>
      subjectFilter === "all"
        ? items
        : items.filter((i) => i.subject === subjectFilter),
    [items, subjectFilter],
  );

  return {
    subjectFilter,
    setSubjectFilter,
    subjects,
    filteredItems,
  };
}
