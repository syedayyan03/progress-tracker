export type ViewMode = 'today' | 'calendar' | 'analytics' | 'settings';

export type ThemeMode = 'system' | 'dark' | 'light';

export interface SubjectConfig {
  id: string;
  name: string;
  color: string; // 'rose' | 'cyan' | 'amber' | 'pink' | 'blue' | 'emerald' | 'violet' | 'indigo' | 'teal' | 'yellow'
}

export interface TopicItem {
  id: string;
  day: number;
  title: string;
}

export interface HabitItem {
  id: string;
  title: string;
  icon: string;
}

export interface TopicMeta {
  rating: number; // 1 to 5
  note: string;
  needsRevision: boolean;
  scheduledDate?: string;
}

export interface DayLog {
  habits: string[];
  medicine: string[];
  ortho: string[];
  subjectCompletions?: Record<string, string[]>;
  notes: string;
}

export interface AppState {
  settings: {
    startDate: string; // YYYY-MM-DD
    theme: ThemeMode;
  };
  lists: {
    subjects: SubjectConfig[];
    topics: Record<string, TopicItem[]>;
    medicine: TopicItem[];
    ortho: TopicItem[];
    habits: HabitItem[];
  };
  logs: Record<string, DayLog>; // key is YYYY-MM-DD
  topicMeta: Record<string, TopicMeta>; // key is topic id
}

export interface ToastMessage {
  id: string;
  message: string;
  type?: 'success' | 'info' | 'warning' | 'error';
}
