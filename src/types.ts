export interface Lesson {
  id: string;
  title: string;
  slug: string;
  moduleSlug: string;
  duration: string;
  level: 'Dasar' | 'Menengah' | 'Lanjut';
  isCompleted: boolean;
}

export interface Module {
  id: string;
  title: string;
  slug: string;
  lessons: Lesson[];
  progress: number; // 0 to 100
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number; // Index of options
  explanation: string;
}

export interface DiscussionComment {
  id: string;
  author: string;
  avatar: string;
  role: string;
  content: string;
  timestamp: string;
  likes: number;
  likedByUser?: boolean;
}

export interface UserState {
  currentView: 'landing' | 'dashboard';
  activeModuleSlug: string;
  activeLessonSlug: string;
  viewingCertificate: boolean;
  completedLessons: string[]; // List of lesson IDs
  quizScores: Record<string, number>; // quizId -> score
  notes: Record<string, string>; // lessonId -> note text
  sidebarOpen: boolean;
}
