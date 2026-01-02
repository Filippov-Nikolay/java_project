import { Assessment, Accrual, SubjectStat, SkillDatum } from "../model/types";
import { MOCK_ACCRUALS, STATS_BY_PERIOD } from "./mockData";

export const assessmentApi = {

  async getBySubject(subjectId: number, groupId: number): Promise<Assessment[]> {
    return [];
  },

  async getStudentAccruals(): Promise<Accrual[]> {
    return MOCK_ACCRUALS;
  },

  async getStudentStats(period: string): Promise<{ stats: SubjectStat[], skills: SkillDatum[] }> {
    return STATS_BY_PERIOD[period] || STATS_BY_PERIOD.year;
  }
};