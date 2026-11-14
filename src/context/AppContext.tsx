import React, { createContext, useContext, useState, useEffect } from 'react';
import type { AppState, ViewMode, ThemeMode, TopicMeta, ToastMessage, SubjectConfig, TopicItem, NotificationSettings } from '../types';
import { 
  getInitialState, 
  DEFAULT_SUBJECTS,
  DEFAULT_MEDICINE_TOPICS,
  DEFAULT_ORTHO_TOPICS,
  DEFAULT_PAEDIATRICS_TOPICS,
  DEFAULT_OBGYN_TOPICS,
  DEFAULT_SURGERY_TOPICS,
  DEFAULT_DERMA_TOPICS,
  DEFAULT_ANESTHESIA_TOPICS,
  DEFAULT_PSYCHIATRY_TOPICS,
  DEFAULT_ENT_TOPICS,
  DEFAULT_OPTHAL_TOPICS
} from '../data/defaultData';
import { generateSampleData } from '../data/sampleData';
import { getYMD } from '../utils/dateUtils';
import { syncStateToSQLite, getSQLiteCacheToken, clearSQLiteDatabase } from '../services/sqliteService';

interface AppContextType {
  state: AppState;
  currentView: ViewMode;
  setCurrentView: (view: ViewMode) => void;
  selectedDate: string;
  setSelectedDate: (date: string) => void;
  sqliteToken: string;
  isMobileMenuOpen: boolean;
  toggleMobileMenu: () => void;
  closeMobileMenu: () => void;
  activeModal: {
    type: 'topic' | 'habit' | 'addTopic' | 'addSubject' | 'sampleData' | 'resetData' | 'clearCache' | 'deleteSubject';
    id?: string;
    category?: string;
    defaultDay?: number;
    subjectName?: string;
  } | null;
  openModal: (modal: NonNullable<AppContextType['activeModal']>) => void;
  closeModal: () => void;
  toasts: ToastMessage[];
  addToast: (message: string, type?: ToastMessage['type']) => void;
  removeToast: (id: string) => void;
  
  // Topic / Subject helpers
  getSubjectTopics: (subjectId: string) => TopicItem[];
  isTopicCompleted: (dateStr: string, subjectId: string, topicId: string) => boolean;

  // Mutations
  toggleHabit: (dateStr: string, habitId: string) => void;
  toggleTopic: (dateStr: string, topicId: string, subjectId: string) => void;
  updateDailyNotes: (dateStr: string, notes: string) => void;
  updateTopicMeta: (topicId: string, meta: Partial<TopicMeta>) => void;
  updateStartDate: (dateStr: string) => void;
  updateNotificationSettings: (settings: Partial<NotificationSettings>) => void;
  requestNotificationPermission: () => Promise<boolean>;
  sendTestNotification: () => void;
  setTheme: (theme: ThemeMode) => void;
  addSubject: (subject: { name: string; color: string }) => void;
  deleteSubject: (subjectId: string) => void;
  addItem: (categoryOrSubjectId: string, item: { title: string; day?: number; icon?: string }) => void;
  updateItemTitle: (categoryOrSubjectId: string, id: string, newTitle: string) => void;
  moveItem: (categoryOrSubjectId: string, index: number, direction: 'up' | 'down') => void;
  deleteItem: (categoryOrSubjectId: string, id: string) => void;
  loadSampleData: () => void;
  resetAllData: () => void;
  clearAllCacheData: () => Promise<void>;
  importData: (imported: AppState) => void;
  exportData: () => void;
}

const STORAGE_KEY = 'sis_progress_tracker_state';

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [sqliteToken, setSqliteToken] = useState<string>(() => getSQLiteCacheToken());
  const [state, setState] = useState<AppState>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (!parsed.lists?.subjects || parsed.lists.subjects.length < 5) {
          const defaultTopics: Record<string, TopicItem[]> = {
            medicine: parsed.lists?.medicine || DEFAULT_MEDICINE_TOPICS,
            ortho: parsed.lists?.ortho || DEFAULT_ORTHO_TOPICS,
            paediatrics: DEFAULT_PAEDIATRICS_TOPICS,
            obgyn: DEFAULT_OBGYN_TOPICS,
            surgery: DEFAULT_SURGERY_TOPICS,
            derma: DEFAULT_DERMA_TOPICS,
            anesthesia: DEFAULT_ANESTHESIA_TOPICS,
            psychiatry: DEFAULT_PSYCHIATRY_TOPICS,
            ent: DEFAULT_ENT_TOPICS,
            opthal: DEFAULT_OPTHAL_TOPICS,
            ...(parsed.lists?.topics || {}),
          };

          return {
            ...parsed,
            lists: {
              ...parsed.lists,
              subjects: DEFAULT_SUBJECTS,
              topics: defaultTopics,
              medicine: defaultTopics.medicine,
              ortho: defaultTopics.ortho,
            },
          };
        }
        return parsed;
      }
    } catch (e) {
      console.error('Failed to load state from localStorage:', e);
    }
    return getInitialState();
  });

  const [currentView, setCurrentView] = useState<ViewMode>('today');
  const [selectedDate, setSelectedDate] = useState<string>(() => '2026-11-15');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeModal, setActiveModal] = useState<AppContextType['activeModal']>(null);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const toggleMobileMenu = () => setIsMobileMenuOpen(prev => !prev);
  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      // Asynchronously sync state directly into SQLite3 database
      syncStateToSQLite(state).then(token => {
        if (token) setSqliteToken(token);
      });
    } catch (e) {
      console.error('Failed to save state:', e);
    }
  }, [state]);

  useEffect(() => {
    const root = document.documentElement;
    const theme = state.settings.theme;
    
    if (theme === 'dark') {
      root.classList.add('dark');
    } else if (theme === 'light') {
      root.classList.remove('dark');
    } else {
      if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
    }
  }, [state.settings.theme]);

  const addToast = (message: string, type: ToastMessage['type'] = 'success') => {
    const id = Date.now().toString() + Math.random().toString(36).slice(2, 6);
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      removeToast(id);
    }, 3000);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const openModal = (modal: NonNullable<AppContextType['activeModal']>) => {
    setActiveModal(modal);
  };

  const closeModal = () => {
    setActiveModal(null);
  };

  const getSubjectTopics = (subjectId: string): TopicItem[] => {
    if (state.lists.topics && state.lists.topics[subjectId]) {
      return state.lists.topics[subjectId];
    }
    if (subjectId === 'medicine') return state.lists.medicine || [];
    if (subjectId === 'ortho') return state.lists.ortho || [];
    return [];
  };

  const isTopicCompleted = (dateStr: string, subjectId: string, topicId: string): boolean => {
    const log = state.logs[dateStr];
    if (!log) return false;
    if (log.subjectCompletions?.[subjectId]?.includes(topicId)) return true;
    if (subjectId === 'medicine' && log.medicine?.includes(topicId)) return true;
    if (subjectId === 'ortho' && log.ortho?.includes(topicId)) return true;
    return false;
  };

  const toggleHabit = (dateStr: string, habitId: string) => {
    setState(prev => {
      const dayLog = prev.logs[dateStr] || { habits: [], medicine: [], ortho: [], notes: '' };
      const exists = dayLog.habits.includes(habitId);
      const newHabits = exists
        ? dayLog.habits.filter(id => id !== habitId)
        : [...dayLog.habits, habitId];

      return {
        ...prev,
        logs: {
          ...prev.logs,
          [dateStr]: {
            ...dayLog,
            habits: newHabits,
          },
        },
      };
    });
  };

  const toggleTopic = (dateStr: string, topicId: string, subjectId: string) => {
    setState(prev => {
      const dayLog = prev.logs[dateStr] || { habits: [], medicine: [], ortho: [], notes: '', subjectCompletions: {} };
      const subjectComps = { ...(dayLog.subjectCompletions || {}) };
      const currentSubjList = subjectComps[subjectId] || 
        (subjectId === 'medicine' ? dayLog.medicine : subjectId === 'ortho' ? dayLog.ortho : []) || [];
      
      const exists = currentSubjList.includes(topicId);
      const updatedSubjList = exists
        ? currentSubjList.filter(id => id !== topicId)
        : [...currentSubjList, topicId];

      subjectComps[subjectId] = updatedSubjList;

      const newMed = subjectId === 'medicine' ? updatedSubjList : (dayLog.medicine || []);
      const newOrtho = subjectId === 'ortho' ? updatedSubjList : (dayLog.ortho || []);

      return {
        ...prev,
        logs: {
          ...prev.logs,
          [dateStr]: {
            ...dayLog,
            subjectCompletions: subjectComps,
            medicine: newMed,
            ortho: newOrtho,
          },
        },
      };
    });
  };

  const updateDailyNotes = (dateStr: string, notes: string) => {
    setState(prev => {
      const dayLog = prev.logs[dateStr] || { habits: [], medicine: [], ortho: [], notes: '' };
      return {
        ...prev,
        logs: {
          ...prev.logs,
          [dateStr]: {
            ...dayLog,
            notes,
          },
        },
      };
    });
  };

  const updateTopicMeta = (topicId: string, meta: Partial<TopicMeta>) => {
    setState(prev => {
      const existing = prev.topicMeta[topicId] || { rating: 0, note: '', needsRevision: false };
      return {
        ...prev,
        topicMeta: {
          ...prev.topicMeta,
          [topicId]: {
            ...existing,
            ...meta,
          },
        },
      };
    });
    addToast('Details saved successfully');
  };

  const updateStartDate = (dateStr: string) => {
    setState(prev => ({
      ...prev,
      settings: {
        ...prev.settings,
        startDate: dateStr,
      },
    }));
    addToast('Start date updated');
  };

  const updateNotificationSettings = (notif: Partial<NotificationSettings>) => {
    setState(prev => ({
      ...prev,
      settings: {
        ...prev.settings,
        notifications: {
          ...(prev.settings.notifications || { enabled: false, time: '21:00' }),
          ...notif,
        },
      },
    }));
    addToast('Notification settings saved');
  };

  const requestNotificationPermission = async (): Promise<boolean> => {
    if (typeof window === 'undefined' || !('Notification' in window)) {
      addToast('Browser notifications are not supported on this device/browser', 'warning');
      return false;
    }

    try {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        updateNotificationSettings({ enabled: true });
        addToast('Daily notification permission granted! 🔔');
        return true;
      } else {
        updateNotificationSettings({ enabled: false });
        addToast('Notification permission was denied in browser settings', 'warning');
        return false;
      }
    } catch (e) {
      console.error(e);
      addToast('Error requesting notification permission', 'error');
      return false;
    }
  };

  const sendTestNotification = () => {
    if (typeof window === 'undefined' || !('Notification' in window)) {
      addToast('Notifications not supported in this browser', 'warning');
      return;
    }

    if (Notification.permission !== 'granted') {
      addToast('Please allow notification permission first', 'warning');
      return;
    }

    try {
      new Notification('Daily Progress Reminder 📚', {
        body: "Test reminder: You haven't logged any reading or study topics today yet! Spend 15 minutes to keep your streak alive.",
        icon: '/vite.svg',
      });
      addToast('Test notification sent!');
    } catch (e) {
      console.error(e);
      addToast('Failed to send test notification', 'error');
    }
  };

  useEffect(() => {
    const checkNotification = () => {
      const notif = state.settings.notifications;
      if (!notif?.enabled || typeof window === 'undefined' || !('Notification' in window) || Notification.permission !== 'granted') {
        return;
      }

      const now = new Date();
      const currentHours = String(now.getHours()).padStart(2, '0');
      const currentMinutes = String(now.getMinutes()).padStart(2, '0');
      const currentTime = `${currentHours}:${currentMinutes}`;
      const todayStr = getYMD();

      // Trigger if current time has reached or passed scheduled time and we haven't notified today
      if (currentTime >= notif.time && notif.lastNotificationDate !== todayStr) {
        const dayLog = state.logs[todayStr];
        let totalTopics = (dayLog?.medicine?.length || 0) + (dayLog?.ortho?.length || 0);
        if (dayLog?.subjectCompletions) {
          Object.values(dayLog.subjectCompletions).forEach(list => {
            totalTopics += (list || []).length;
          });
        }

        if (totalTopics === 0) {
          try {
            new Notification('Daily Progress Reminder 📚', {
              body: "You haven't logged any study topics yet today! Take 15 minutes to review and protect your streak.",
              icon: '/vite.svg',
            });
          } catch (e) {
            console.error('Failed to trigger daily notification:', e);
          }
        }

        // Mark today as notified
        setState(prev => ({
          ...prev,
          settings: {
            ...prev.settings,
            notifications: {
              ...(prev.settings.notifications || { enabled: true, time: '21:00' }),
              lastNotificationDate: todayStr,
            },
          },
        }));
      }
    };

    checkNotification();
    const interval = setInterval(checkNotification, 30000);
    return () => clearInterval(interval);
  }, [state.settings.notifications, state.logs]);

  const setTheme = (theme: ThemeMode) => {
    setState(prev => ({
      ...prev,
      settings: {
        ...prev.settings,
        theme,
      },
    }));
  };

  const addSubject = (subject: { name: string; color: string }) => {
    const id = subject.name.toLowerCase().replace(/[^a-z0-9]/g, '-') || `subj-${Date.now()}`;
    const newSubject: SubjectConfig = {
      id,
      name: subject.name,
      color: subject.color || 'indigo',
    };

    setState(prev => {
      const existingSubjects = prev.lists.subjects || DEFAULT_SUBJECTS;
      const topicsMap = { ...(prev.lists.topics || {}) };
      if (!topicsMap[id]) {
        topicsMap[id] = [];
      }

      return {
        ...prev,
        lists: {
          ...prev.lists,
          subjects: [...existingSubjects, newSubject],
          topics: topicsMap,
        },
      };
    });
    addToast(`Added subject: ${subject.name}`);
    closeModal();
  };

  const deleteSubject = (subjectId: string) => {
    setState(prev => {
      const filteredSubjects = (prev.lists.subjects || DEFAULT_SUBJECTS).filter(s => s.id !== subjectId);
      const topicsMap = { ...(prev.lists.topics || {}) };
      delete topicsMap[subjectId];

      return {
        ...prev,
        lists: {
          ...prev.lists,
          subjects: filteredSubjects,
          topics: topicsMap,
          medicine: subjectId === 'medicine' ? [] : prev.lists.medicine,
          ortho: subjectId === 'ortho' ? [] : prev.lists.ortho,
        },
      };
    });
    addToast('Subject and syllabus topics removed');
    closeModal();
  };

  const addItem = (categoryOrSubjectId: string, item: { title: string; day?: number; icon?: string }) => {
    setState(prev => {
      if (categoryOrSubjectId === 'habits') {
        const newHabit = {
          id: `habit-${Date.now()}`,
          title: item.title,
          icon: item.icon || 'Sparkles',
        };
        return {
          ...prev,
          lists: {
            ...prev.lists,
            habits: [...prev.lists.habits, newHabit],
          },
        };
      }

      // Subject checklist item
      const subjectId = categoryOrSubjectId;
      const existingTopics = (prev.lists.topics?.[subjectId] || 
        (subjectId === 'medicine' ? prev.lists.medicine : subjectId === 'ortho' ? prev.lists.ortho : [])) || [];

      const nextDay = item.day || (existingTopics.length > 0 ? Math.max(...existingTopics.map(i => i.day)) + 1 : 1);
      const newTopic: TopicItem = {
        id: `${subjectId}-${Date.now()}`,
        day: nextDay,
        title: item.title,
      };

      const updatedTopicsForSubj = [...existingTopics, newTopic];
      const updatedTopicsMap = {
        ...(prev.lists.topics || {}),
        [subjectId]: updatedTopicsForSubj,
      };

      return {
        ...prev,
        lists: {
          ...prev.lists,
          topics: updatedTopicsMap,
          medicine: subjectId === 'medicine' ? updatedTopicsForSubj : prev.lists.medicine,
          ortho: subjectId === 'ortho' ? updatedTopicsForSubj : prev.lists.ortho,
        },
      };
    });
    addToast('Item added');
  };

  const updateItemTitle = (categoryOrSubjectId: string, id: string, newTitle: string) => {
    setState(prev => {
      if (categoryOrSubjectId === 'habits') {
        const updatedHabits = prev.lists.habits.map(h => h.id === id ? { ...h, title: newTitle } : h);
        return {
          ...prev,
          lists: { ...prev.lists, habits: updatedHabits },
        };
      }

      const subjectId = categoryOrSubjectId;
      const existingTopics = (prev.lists.topics?.[subjectId] || 
        (subjectId === 'medicine' ? prev.lists.medicine : subjectId === 'ortho' ? prev.lists.ortho : [])) || [];

      const updated = existingTopics.map(t => t.id === id ? { ...t, title: newTitle } : t);
      const updatedTopicsMap = {
        ...(prev.lists.topics || {}),
        [subjectId]: updated,
      };

      return {
        ...prev,
        lists: {
          ...prev.lists,
          topics: updatedTopicsMap,
          medicine: subjectId === 'medicine' ? updated : prev.lists.medicine,
          ortho: subjectId === 'ortho' ? updated : prev.lists.ortho,
        },
      };
    });
    addToast('Updated item title');
  };

  const moveItem = (categoryOrSubjectId: string, index: number, direction: 'up' | 'down') => {
    setState(prev => {
      if (categoryOrSubjectId === 'habits') {
        const list = [...prev.lists.habits];
        const targetIndex = direction === 'up' ? index - 1 : index + 1;
        if (targetIndex < 0 || targetIndex >= list.length) return prev;
        const temp = list[index];
        list[index] = list[targetIndex];
        list[targetIndex] = temp;
        return {
          ...prev,
          lists: { ...prev.lists, habits: list },
        };
      }

      const subjectId = categoryOrSubjectId;
      const list = [...(prev.lists.topics?.[subjectId] || 
        (subjectId === 'medicine' ? prev.lists.medicine : subjectId === 'ortho' ? prev.lists.ortho : []) || [])];
      
      const targetIndex = direction === 'up' ? index - 1 : index + 1;
      if (targetIndex < 0 || targetIndex >= list.length) return prev;

      const temp = list[index];
      list[index] = list[targetIndex];
      list[targetIndex] = temp;

      const updatedTopicsMap = {
        ...(prev.lists.topics || {}),
        [subjectId]: list,
      };

      return {
        ...prev,
        lists: {
          ...prev.lists,
          topics: updatedTopicsMap,
          medicine: subjectId === 'medicine' ? list : prev.lists.medicine,
          ortho: subjectId === 'ortho' ? list : prev.lists.ortho,
        },
      };
    });
  };

  const deleteItem = (categoryOrSubjectId: string, id: string) => {
    setState(prev => {
      if (categoryOrSubjectId === 'habits') {
        return {
          ...prev,
          lists: {
            ...prev.lists,
            habits: prev.lists.habits.filter(h => h.id !== id),
          },
        };
      }

      const subjectId = categoryOrSubjectId;
      const existingTopics = (prev.lists.topics?.[subjectId] || 
        (subjectId === 'medicine' ? prev.lists.medicine : subjectId === 'ortho' ? prev.lists.ortho : [])) || [];

      const filtered = existingTopics.filter(t => t.id !== id);
      const updatedTopicsMap = {
        ...(prev.lists.topics || {}),
        [subjectId]: filtered,
      };

      return {
        ...prev,
        lists: {
          ...prev.lists,
          topics: updatedTopicsMap,
          medicine: subjectId === 'medicine' ? filtered : prev.lists.medicine,
          ortho: subjectId === 'ortho' ? filtered : prev.lists.ortho,
        },
      };
    });
    addToast('Item deleted');
  };

  const loadSampleData = () => {
    const demo = generateSampleData(selectedDate);
    setState(demo);
    addToast('Sample data loaded successfully');
    closeModal();
  };

  const resetAllData = () => {
    const fresh = getInitialState();
    setState(fresh);
    localStorage.removeItem(STORAGE_KEY);
    addToast('All data reset to defaults');
    closeModal();
  };

  const clearAllCacheData = async () => {
    try {
      await clearSQLiteDatabase();
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem('sqlite3_cache_token_db');
      localStorage.removeItem('sqlite3_cache_token');
      const fresh = getInitialState();
      setState(fresh);
      setSqliteToken('sql3_token_cleared');
      addToast('All cache data and progress permanently cleared');
      closeModal();
    } catch (e) {
      console.error('Failed to clear cache:', e);
      addToast('Failed to clear all cache', 'error');
    }
  };

  const importData = (imported: AppState) => {
    if (!imported.lists || !imported.settings) {
      addToast('Invalid backup file format', 'error');
      return;
    }
    setState(imported);
    addToast('Backup imported successfully');
  };

  const exportData = () => {
    try {
      const jsonStr = JSON.stringify(state, null, 2);
      const blob = new Blob([jsonStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      const dateStr = getYMD();
      link.href = url;
      link.download = `daily_progress_tracker_backup_${dateStr}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      addToast('Backup downloaded');
    } catch (e) {
      console.error(e);
      addToast('Failed to export backup', 'error');
    }
  };

  return (
    <AppContext.Provider
      value={{
        state,
        currentView,
        setCurrentView,
        selectedDate,
        setSelectedDate,
        sqliteToken,
        isMobileMenuOpen,
        toggleMobileMenu,
        closeMobileMenu,
        activeModal,
        openModal,
        closeModal,
        toasts,
        addToast,
        removeToast,
        getSubjectTopics,
        isTopicCompleted,
        toggleHabit,
        toggleTopic,
        updateDailyNotes,
        updateTopicMeta,
        updateStartDate,
        updateNotificationSettings,
        requestNotificationPermission,
        sendTestNotification,
        setTheme,
        addSubject,
        deleteSubject,
        addItem,
        updateItemTitle,
        moveItem,
        deleteItem,
        loadSampleData,
        resetAllData,
        clearAllCacheData,
        importData,
        exportData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
