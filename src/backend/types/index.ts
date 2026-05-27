export interface User {
  id: number;
  username: string;
  email: string;
  password_hash: string;
  first_name?: string;
  last_name?: string;
  role: 'admin' | 'teacher' | 'student';
  phone?: string;
  address?: string;
  date_of_birth?: Date;
  profile_image_url?: string;
  status: 'active' | 'inactive' | 'suspended';
  created_at: Date;
  updated_at: Date;
}

export interface Course {
  id: number;
  title: string;
  description?: string;
  course_code: string;
  instructor_id?: number;
  category?: string;
  level?: 'beginner' | 'intermediate' | 'advanced';
  duration_weeks?: number;
  credits?: number;
  thumbnail_url?: string;
  status: 'draft' | 'published' | 'archived';
  created_at: Date;
  updated_at: Date;
}

export interface CourseModule {
  id: number;
  course_id: number;
  title: string;
  description?: string;
  order_index: number;
  created_at: Date;
  updated_at: Date;
}

export interface Lesson {
  id: number;
  module_id: number;
  title: string;
  content?: string;
  content_type: 'video' | 'text' | 'pdf' | 'quiz' | 'assignment';
  video_url?: string;
  duration_minutes?: number;
  order_index: number;
  is_preview: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface Enrollment {
  id: number;
  student_id: number;
  course_id: number;
  enrollment_date: Date;
  completion_date?: Date;
  status: 'active' | 'completed' | 'dropped' | 'suspended';
  progress_percentage: number;
  grade?: number;
}

export interface AuthRequest {
  username: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: Omit<User, 'password_hash'>;
}

export interface JWTPayload {
  userId: number;
  username: string;
  role: string;
  iat?: number;
  exp?: number;
}

export interface APIResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}
