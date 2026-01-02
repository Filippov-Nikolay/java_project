
export interface Homework {
  id: string;
  subjectName: string;
  title: string;
  description?: string; 
  date: string;
  deadlineText: string;
  isOverdue: boolean;
  month: string;
  status: 'todo' | 'pending' | 'done';
}