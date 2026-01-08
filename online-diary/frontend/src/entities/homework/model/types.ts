export interface Homework {
  id: string | number;
  subjectName: string;
  title: string;
  description?: string; 
  teacherName?: string;    
  createdAt: string; 
  pointsMax: number; 
  date: string;      
  deadline: string;     
  deadlineText: string; 
  isOverdue: boolean;
  month: string;
  status: 'todo' | 'pending' | 'done';
  fileName?: string;
  submissionFileName?: string;
  iconFileName?: string;
}

export interface TeacherTask {
  id: string | number;
  title: string;
  description?: string;  
  subjectName: string;
  groupName: string;
  createdAt: string;
  deadline: string;
  isOverdue: boolean;
  iconFileName?: string;
  stats: {
    submitted: number;
    total: number;
  };
}