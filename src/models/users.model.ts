export interface User {
  id: number;
  name: string;
  last_name: string;
  email: string;
  password: string;
  is_admin: boolean;
  created_at: Date;
  updated_at: Date;
  deleted_at: Date;
}
