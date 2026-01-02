"use client";

import { useState, useCallback } from "react";
import type { PeriodValue } from "@shared/ui/PeriodFilter";

type UsePeriodFilterOptions = {
  initial?: PeriodValue;
};

export const usePeriodFilter = (options?: UsePeriodFilterOptions) => {
  const { initial = "year" } = options || {};

  const [period, setPeriodState] = useState<PeriodValue>(initial);

  const setPeriod = useCallback((value: PeriodValue) => {
    setPeriodState(value);
  }, []);

  return {
    period,
    setPeriod,
  };
};
