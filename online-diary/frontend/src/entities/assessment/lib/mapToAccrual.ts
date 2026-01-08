import { Accrual } from "../model/types";

export const mapSubmissionToAccrual = (s: any): Accrual => ({
    id: s.id.toString(),
    subject: s.assessment.subjectName || "Предмет",
    title: s.assessment.title,
    kind: s.assessment.type.toLowerCase() as any,
    score: s.points,
    maxScore: s.assessment.maxScore,
    date: new Date(s.gradedAt || s.submittedAt).toLocaleDateString('uk-UA', { day: '2-digit', month: 'short' })
});