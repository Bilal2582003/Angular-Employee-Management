// user.model.ts

export interface Pivot {
  user_id: number;
  depart_id: number;
  role: string;
}

export interface Department {
  id: number;
  name: string;
  slug: string;
  created_at: string;
  updated_at: string;
  pivot: Pivot;
}

export interface User {
  id: number;
  name: string;
  email: string;
  email_verified_at: string | null;
  created_at: string;
  updated_at: string;
  departs: Department[];
}
