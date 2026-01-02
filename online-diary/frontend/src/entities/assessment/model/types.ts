export type AccrualKind = "attendance" | "classwork" | "homework";

export interface Accrual {
  id: string;
  subject: string;
  title: string;
  kind: AccrualKind;
  score: number;
  maxScore: number;
  date: string;
  crystalsDelta?: number;
}

export interface SubjectStat {
  label: string;
  score: number;
  maxScore: number;
  color: string;
}

export interface SkillDatum {
  skill: string;
  value: number;
}

export interface Assessment {
  id: number;
  title: string;
  description?: string;
  type: string;
  maxScore: number;
  subjectId: number;
  deadline: string;
}