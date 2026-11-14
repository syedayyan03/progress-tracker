import type { DayLog } from '../types';

export const getYMD = (d: Date = new Date()): string => {
  const y = d.getUTCFullYear();
  const m = String(d.getUTCMonth() + 1).padStart(2, '0');
  const day = String(d.getUTCDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
};

export const parseYMD = (ymd: string): Date => {
  const [y, m, d] = ymd.split('-').map(Number);
  return new Date(Date.UTC(y, m - 1, d, 0, 0, 0, 0));
};

export const addDays = (ymd: string, days: number): string => {
  const [y, m, d] = ymd.split('-').map(Number);
  const date = new Date(Date.UTC(y, m - 1, d + days, 0, 0, 0, 0));
  return getYMD(date);
};

export const getDaysDifference = (startYMD: string, currentYMD: string): number => {
  const [y1, m1, d1] = startYMD.split('-').map(Number);
  const [y2, m2, d2] = currentYMD.split('-').map(Number);
  const startUTC = Date.UTC(y1, m1 - 1, d1, 0, 0, 0, 0);
  const currentUTC = Date.UTC(y2, m2 - 1, d2, 0, 0, 0, 0);
  const diffDays = Math.round((currentUTC - startUTC) / (1000 * 60 * 60 * 24));
  return diffDays;
};

export const getSyllabusDay = (startYMD: string, currentYMD: string): number => {
  const diff = getDaysDifference(startYMD, currentYMD);
  return Math.max(1, diff + 1);
};

export const formatDateDisplay = (ymd: string): string => {
  const [y, m, d] = ymd.split('-').map(Number);
  const date = new Date(Date.UTC(y, m - 1, d, 0, 0, 0, 0));
  return date.toLocaleDateString('en-US', {
    timeZone: 'UTC',
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

export const formatShortDate = (ymd: string): string => {
  const [y, m, d] = ymd.split('-').map(Number);
  const date = new Date(Date.UTC(y, m - 1, d, 0, 0, 0, 0));
  return date.toLocaleDateString('en-US', {
    timeZone: 'UTC',
    month: 'short',
    day: 'numeric',
  });
};

export const calculateStreak = (logs: Record<string, DayLog>, todayStr: string): number => {
  let streak = 0;
  let checkDate = todayStr;

  const getLogCompletedCount = (dateStr: string): number => {
    const log = logs[dateStr];
    if (!log) return 0;
    return (log.habits?.length || 0) + (log.medicine?.length || 0) + (log.ortho?.length || 0);
  };

  // If today has completed items, start from today.
  // If today has no completed items, check yesterday. If yesterday was completed, streak continues from yesterday.
  if (getLogCompletedCount(checkDate) === 0) {
    const yesterday = addDays(todayStr, -1);
    if (getLogCompletedCount(yesterday) === 0) {
      return 0;
    }
    checkDate = yesterday;
  }

  while (getLogCompletedCount(checkDate) > 0) {
    streak++;
    checkDate = addDays(checkDate, -1);
  }

  return streak;
};

export const calculateDayStats = (log?: DayLog, totalItems = 12) => {
  if (!log) {
    return {
      completed: 0,
      total: totalItems,
      percent: 0,
      isPerfect: false,
      hasMedicine: false,
      hasOrtho: false,
    };
  }

  const completed = (log.habits?.length || 0) + (log.medicine?.length || 0) + (log.ortho?.length || 0);
  const percent = totalItems > 0 ? Math.min(100, Math.round((completed / totalItems) * 100)) : 0;
  const isPerfect = percent === 100 && completed >= totalItems;
  const hasMedicine = (log.medicine?.length || 0) > 0;
  const hasOrtho = (log.ortho?.length || 0) > 0;

  return {
    completed,
    total: totalItems,
    percent,
    isPerfect,
    hasMedicine,
    hasOrtho,
  };
};

export interface CalendarDay {
  dateStr: string;
  dayNumber: number;
  isCurrentMonth: boolean;
  isToday: boolean;
}

export const getMonthMatrix = (year: number, monthIndex: number): CalendarDay[][] => {
  const firstDay = new Date(year, monthIndex, 1);
  const lastDay = new Date(year, monthIndex + 1, 0);

  const startDayOfWeek = firstDay.getDay(); // 0 is Sunday
  const daysInMonth = lastDay.getDate();

  const prevMonthLastDay = new Date(year, monthIndex, 0).getDate();

  const weeks: CalendarDay[][] = [];
  let currentWeek: CalendarDay[] = [];

  const todayStr = getYMD();

  // Previous month trailing days
  for (let i = startDayOfWeek - 1; i >= 0; i--) {
    const dayNum = prevMonthLastDay - i;
    const date = new Date(year, monthIndex - 1, dayNum);
    const dateStr = getYMD(date);
    currentWeek.push({
      dateStr,
      dayNumber: dayNum,
      isCurrentMonth: false,
      isToday: dateStr === todayStr,
    });
  }

  // Current month days
  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, monthIndex, day);
    const dateStr = getYMD(date);
    currentWeek.push({
      dateStr,
      dayNumber: day,
      isCurrentMonth: true,
      isToday: dateStr === todayStr,
    });

    if (currentWeek.length === 7) {
      weeks.push(currentWeek);
      currentWeek = [];
    }
  }

  // Next month leading days
  if (currentWeek.length > 0) {
    let nextDayNum = 1;
    while (currentWeek.length < 7) {
      const date = new Date(year, monthIndex + 1, nextDayNum);
      const dateStr = getYMD(date);
      currentWeek.push({
        dateStr,
        dayNumber: nextDayNum,
        isCurrentMonth: false,
        isToday: dateStr === todayStr,
      });
      nextDayNum++;
    }
    weeks.push(currentWeek);
  }

  return weeks;
};
