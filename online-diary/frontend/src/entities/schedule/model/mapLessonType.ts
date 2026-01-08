import { ScheduleEventType } from "./types";

export const CALENDAR_EVENT_META: Record<
  ScheduleEventType,
  { color: string }
> = {
  lecture: { color: "#3b82f6" },
  practice: { color: "#22c55e" },
  exam: { color: "#f43f5e" },
};
