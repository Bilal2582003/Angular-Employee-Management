// project.model.ts

export interface User {
  id: number;
  name: string;
  email: string;
  email_verified_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface Project {
  id: number;
  name: string;
  client: string;
  startDate: string;
  employeeLeadId: number;
  contactPerson: string;
  contactNo: string;
  created_at: string;
  updated_at: string;
  users: User[];
}