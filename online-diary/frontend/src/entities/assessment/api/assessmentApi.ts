import { Assessment, Accrual, SubjectStat, SkillDatum } from "../model/types";


export const assessmentApi = {

async getStudentAccruals(): Promise<Accrual[]> {
    const token = localStorage.getItem("token");
    const res = await fetch(`http://localhost:8080/api/student/stats/accruals`, {
        headers: { "Authorization": `Bearer ${token}` }
    });
    return res.json();
},

async getStudentStats(period: string): Promise<{ stats: SubjectStat[], skills: SkillDatum[] }> {
    const token = localStorage.getItem("token");
    const res = await fetch(`http://localhost:8080/api/student/stats/dashboard?period=${period}`, {
      headers: { "Authorization": `Bearer ${token}` }
    });
    
    if (!res.ok) throw new Error("Помилка завантаження статистики");
    return res.json();
  },
};