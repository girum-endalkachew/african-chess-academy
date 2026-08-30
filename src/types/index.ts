export type UserRole = 'student' | 'admin' | 'coach';

export interface Profile {
  id: string;
  email: string;
  full_name: string;
  avatar_url?: string;
  role: UserRole;
  chess_rating?: number;
  created_at: string;
}
