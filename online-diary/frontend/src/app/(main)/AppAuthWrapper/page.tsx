"use client";

import { ReactNode } from "react";
import { useUser } from "@entities/user";
import { Loader } from "@shared/ui/Loader";

export const AppAuthWrapper = ({ children }: { children: ReactNode }) => {
  const { isLoading } = useUser();

  if (isLoading) {
    return <Loader />;
  }

  return <>{children}</>;
};