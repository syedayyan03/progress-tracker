import React, { createContext, useContext, useState, useEffect } from 'react';
import type { AppState, ViewMode, ThemeMode, TopicMeta, ToastMessage } from '../types';
import { getInitialState } from '../data/defaultData';
import { generateSampleData } from '../data/sampleData';
import { getYMD } from '../utils/dateUtils';

interface AppContextType {
  state: AppState;
  currentView: ViewMode;
  setCurrentView: (view: ViewMode) => void;
  selectedDate: string;
  setSelectedDate: (date: string) => void;
  activeModal: {
    type: 'topic' | 'habit' | 'sampleData' | 'resetData';
    id?: string;
    category?: 'medicine' | 'ortho';
  } | null;
  openModal: (modal: NonNullable<AppContextType['activeModal']>) => void;
  closeModal: () => void;
  toasts: ToastMessage[];
  addToast: (message: string, type?: ToastMessage['type']) => void;
  removeToast: (id: string) => void;
  
  // Mutations
  toggleHabit: (dateStr: string, habitId: string) => void;
  toggleTopic: (dateStr: string, topicId: string, category: 'medicine' | 'ortho') => void;
  updateDailyNotes: (dateStr: string, notes: string) => void;
  updateTopicMeta: (topicId: string, meta: Partial<TopicMeta>) => void;
  updateStartDate: (dateStr: string) => void;
  setTheme: (theme: ThemeMode) => void;
  addItem: (category: 'medicine' | 'ortho' | 'habits', item: { title: string; day?: number; icon?: string }) => void;
  updateItemTitle: (category: 'medicine' | 'ortho' | 'habits', id: string, newTitle: string) => void;
  moveItem: (category: 'medicine' | 'ortho' | 'habits', index: number, direction: 'up' | 'down') => void;
  deleteItem: (category: 'medicine' | 'ortho' | 'habits', id: string) => void;
  loadSampleData: () => void;
  resetAllData: () => void;
  importData: (imported: AppState) => void;
  exportData: () => void;
}

const STORAGE_KEY = 'sis_progress_tracker_state';

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AppState>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error('Failed to load state from localStorage:', e);
    }
    return getInitialState();
  });

  const [currentView, setCurrentView] = useState<ViewMode>('today');
  const [selectedDate, setSelectedDate] = useState<string>(() => getYMD());
  const [activeModal, setActiveModal] = useState<AppContextType['activeModal']>(null);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Persist state to localStorage on changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      console.error('Failed to save state to localStorage:', e);
    }
  }, [state]);

  // Handle theme class on root element
  useEffect(() => {
    const root = document.documentElement;
    const theme = state.settings.theme;
    
    if (theme === 'dark') {
      root.classList.add('dark');
    } else if (theme === 'light') {
      root.classList.remove('dark');
    } else {
      // System preference
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

  const toggleTopic = (dateStr: string, topicId: string, category: 'medicine' | 'ortho') => {
    setState(prev => {
      const dayLog = prev.logs[dateStr] || { habits: [], medicine: [], ortho: [], notes: '' };
      const currentList = dayLog[category] || [];
      const exists = currentList.includes(topicId);
      const updatedList = exists
        ? currentList.filter(id => id !== topicId)
        : [...currentList, topicId];

      return {
        ...prev,
        logs: {
          ...prev.logs,
          [dateStr]: {
            ...dayLog,
            [category]: updatedList,
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

  const setTheme = (theme: ThemeMode) => {
    setState(prev => ({
      ...prev,
      settings: {
        ...prev.settings,
        theme,
      },
    }));
  };

  const addItem = (category: 'medicine' | 'ortho' | 'habits', item: { title: string; day?: number; icon?: string }) => {
    setState(prev => {
      const list = prev.lists[category];
      const newId = `${category}-${Date.now()}`;
      if (category === 'habits') {
        const newHabit = {
          id: newId,
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
      } else {
        const nextDay = item.day || (list.length > 0 ? Math.max(...list.map(i => (i as any).day)) + 1 : 1);
        const newTopic = {
          id: newId,
          day: nextDay,
          title: item.title,
        };
        return {
          ...prev,
          lists: {
            ...prev.lists,
            [category]: [...(prev.lists[category] as any[]), newTopic],
          },
        };
      }
    });
    addToast('Item added');
  };

  const updateItemTitle = (category: 'medicine' | 'ortho' | 'habits', id: string, newTitle: string) => {
    setState(prev => {
      const updatedList = (prev.lists[category] as any[]).map(item => {
        if (item.id === id) {
          return { ...item, title: newTitle };
        }
        return item;
      });
      return {
        ...prev,
        lists: {
          ...prev.lists,
          [category]: updatedList,
        },
      };
    });
    addToast('Updated item title');
  };

  const moveItem = (category: 'medicine' | 'ortho' | 'habits', index: number, direction: 'up' | 'down') => {
    setState(prev => {
      const list = [...(prev.lists[category] as any[])];
      const targetIndex = direction === 'up' ? index - 1 : index + 1;
      if (targetIndex < 0 || targetIndex >= list.length) return prev;

      const temp = list[index];
      list[index] = list[targetIndex];
      list[targetIndex] = temp;

      return {
        ...prev,
        lists: {
          ...prev.lists,
          [category]: list,
        },
      };
    });
  };

  const deleteItem = (category: 'medicine' | 'ortho' | 'habits', id: string) => {
    setState(prev => {
      const filtered = (prev.lists[category] as any[]).filter(item => item.id !== id);
      return {
        ...prev,
        lists: {
          ...prev.lists,
          [category]: filtered,
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
        activeModal,
        openModal,
        closeModal,
        toasts,
        addToast,
        removeToast,
        toggleHabit,
        toggleTopic,
        updateDailyNotes,
        updateTopicMeta,
        updateStartDate,
        setTheme,
        addItem,
        updateItemTitle,
        moveItem,
        deleteItem,
        loadSampleData,
        resetAllData,
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
