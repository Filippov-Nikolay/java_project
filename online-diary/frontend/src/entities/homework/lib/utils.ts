import { Accrual, AccrualKind } from "@entities/assessment/model/types";
import { Homework } from "../model/types";

export const isActuallyOverdue = (h: Homework): boolean => {
  return h.isOverdue && h.status === 'todo';
};

export const mapSubmissionToAccrual = (s: any): Accrual => {
  const rawType = s.assessment.type.toLowerCase();
  
  
  const normalizedKind = (rawType === 'homework' || rawType === 'classwork') 
    ? 'classwork' 
    : rawType;

  return {
    id: s.id.toString(),
    subject: s.assessment.subjectName,
    title: s.assessment.title,
    kind: normalizedKind as AccrualKind, 
    score: s.points,
    maxScore: s.assessment.maxScore,
    date: new Date(s.gradedAt || s.submittedAt).toLocaleDateString('uk-UA')
  };
};