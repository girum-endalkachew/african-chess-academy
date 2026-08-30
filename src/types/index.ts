export type UserRole = "student" | "admin" | "coach";

export interface Profile {
  id: string;
  email: string;
  full_name: string;
  avatar_url?: string;
  role: UserRole;
  chess_rating?: number;
  created_at: string;
}

export interface Course {
  id: string;
  title: string;
  description: string | null;
  level: string | null;
  total_lessons: number;
  is_published?: boolean;
  created_at: string;
}

export interface Coach {
  id: string;
  full_name: string;
  title: string | null;
  bio: string | null;
  chess_rating: number;
  specialties: string | null;
  is_featured: boolean;
  created_at: string;
}

export interface Tournament {
  id: string;
  title: string;
  description: string | null;
  tournament_date: string;
  format: string;
  max_participants: number;
  current_participants: number;
  status: string;
  created_at: string;
}

export interface EventItem {
  id: string;
  title: string;
  description: string | null;
  event_date: string;
  event_type: string;
  event_link: string | null;
  max_seats: number;
  is_published?: boolean;
  created_at: string;
}

export interface NewsItem {
  id: string;
  title: string;
  excerpt: string | null;
  content: string | null;
  tag: string | null;
  published_at: string;
  created_at: string;
}