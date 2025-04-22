export enum UserRole {
  USER = 'User',
  REVIEWER = 'Reviewer'
}

export interface User {
  id: string;
  username: string;
  role: UserRole;
  token?: string;
} 