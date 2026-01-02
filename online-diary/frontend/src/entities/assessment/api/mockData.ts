// src/entities/assessment/api/mockData.ts
import { Accrual, SubjectStat, SkillDatum } from "../model/types";

export const MOCK_ACCRUALS: Accrual[] = [
  { id: "1", subject: "Java Programming", title: "Лабораторна №3", kind: "homework", score: 95, maxScore: 100, date: "12 груд.", crystalsDelta: 1 },
  { id: "2", subject: "Веб-розробка", title: "Тест: Flexbox", kind: "classwork", score: 12, maxScore: 12, date: "10 груд.", crystalsDelta: 2 },
  { id: "3", subject: "Бази даних", title: "Відвідування", kind: "attendance", score: 1, maxScore: 1, date: "08 груд." },
];

export const STATS_BY_PERIOD: Record<string, { stats: SubjectStat[], skills: SkillDatum[] }> = {
  year: {
    skills: [
      { skill: "Відвідуваність", value: 90 },
      { skill: "Класна", value: 85 },
      { skill: "Самостійна", value: 92 },
      { skill: "Контрольні", value: 80 },
      { skill: "Тематична", value: 88 },
    ],
    stats: [
      { label: "Класна робота", score: 10.5, maxScore: 12, color: "#6366f1" },
      { label: "Самостійна", score: 9.0, maxScore: 12, color: "#22c55e" },
      { label: "Контрольні", score: 7.5, maxScore: 12, color: "#f59e0b" },
      { label: "Тематична", score: 8.5, maxScore: 12, color: "#ef4444" },
    ],
  },
  semester: {
    skills: [
      { skill: "Відвідуваність", value: 80 },
      { skill: "Класна", value: 75 },
      { skill: "Самостійна", value: 85 },
      { skill: "Контрольні", value: 68 },
      { skill: "Тематична", value: 72 },
    ],
    stats: [
      { label: "Класна робота", score: 9.2, maxScore: 12, color: "#6366f1" },
      { label: "Самостійна", score: 8.5, maxScore: 12, color: "#22c55e" },
      { label: "Контрольні", score: 7.8, maxScore: 12, color: "#f59e0b" },
      { label: "Тематична", score: 8.3, maxScore: 12, color: "#ef4444" },
    ],
  },
  month: {
    skills: [
      { skill: "Відвідуваність", value: 60 },
      { skill: "Класна", value: 55 },
      { skill: "Самостійна", value: 70 },
      { skill: "Контрольні", value: 40 },
      { skill: "Тематична", value: 65 },
    ],
    stats: [
      { label: "Класна робота", score: 8.0, maxScore: 12, color: "#6366f1" },
      { label: "Самостійна", score: 7.0, maxScore: 12, color: "#22c55e" },
      { label: "Контрольні", score: 6.0, maxScore: 12, color: "#f59e0b" },
      { label: "Тематична", score: 7.5, maxScore: 12, color: "#ef4444" },
    ],
  }
};