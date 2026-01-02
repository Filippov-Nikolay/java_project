export type ScheduleEventType = 'lecture' | 'practice' | 'exam';

export interface ScheduleEvent {
  id: number;
  subjectName: string;  
  teacherFullName: string; 
  groupName: string;
  date: string;          
  lessonNumber: number;   
  
  type: ScheduleEventType;
  room?: string;


  subjectId: number;
  teacherId: number;
  groupId: number;

  title?: string;
  startTime?: string;
  endTime?: string;
}