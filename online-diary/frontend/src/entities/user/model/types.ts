export type UserRole = 'ADMIN' | 'TEACHER' | 'STUDENT';

export interface User {
  id: number;
  login: string;
  firstName: string;
  lastName: string;
  email: string;
  role: UserRole;
  groupId?: number;   
  groupName?: string; 
  avatarUrl?: string;
}