import React from 'react';
import { useApp } from '../../context/AppContext';
import { getYMD, addDays, formatDateDisplay, calculateStreak } from '../../utils/dateUtils';
import { ChevronLeft, ChevronRight, Flame, Sun, Moon, Sparkles, Database } from 'lucide-react';

export const Header: React.FC = () => {
  const { state, selectedDate, setSelectedDate, setTheme, sqliteToken } = useApp();
  const todayStr = getYMD();
  const isToday = selectedDate === todayStr;

  const streak = calculateStreak(state.logs, todayStr);

  const handlePrevDay = () => {
    setSelectedDate(addDays(selectedDate, -1));
  };

  const handleNextDay = () => {
    setSelectedDate(addDays(selectedDate, 1));
  };

  const handleTodayClick = () => {
    setSelectedDate(todayStr);
  };

  const isDarkMode = state.settings.theme === 'dark' || 
    (state.settings.theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);

  const toggleTheme = () => {
    setTheme(isDarkMode ? 'light' : 'dark');
  };

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between px-4 lg:px-8 py-3.5 bg-[#0b0f19]/90 dark:bg-[#0b0f19]/90 backdrop-blur-md border-b border-slate-800/80 transition-colors">
      {/* Left side title / indicator */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
          </span>
          <h1 className="font-display font-bold text-base sm:text-lg text-slate-100 tracking-tight">
            Daily Progress
          </h1>
        </div>
      </div>

      {/* Center: Date Switcher */}
      <div className="flex items-center gap-1.5 bg-[#13192b] border border-slate-800 rounded-xl p-1 shadow-sm">
        <button
          onClick={handlePrevDay}
          title="Previous day"
          aria-label="Previous day"
          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        <button
          onClick={handleTodayClick}
          className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 ${
            isToday
              ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-500/20'
              : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
          }`}
          title={isToday ? "Viewing Today" : "Click to jump to Today"}
        >
          {isToday ? (
            <>
              <Sparkles className="w-3.5 h-3.5 text-indigo-200" />
              <span>Today</span>
            </>
          ) : (
            <span>{formatDateDisplay(selectedDate)}</span>
          )}
        </button>

        <button
          onClick={handleNextDay}
          title="Next day"
          aria-label="Next day"
          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 transition-colors"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Right side: Streak pill + SQLite3 token pill + Theme toggle */}
      <div className="flex items-center gap-2.5">
        {/* SQLite3 Cache Token Badge */}
        <div 
          className="hidden lg:flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-slate-900 border border-emerald-500/20 text-emerald-400 font-medium text-[11px] tracking-wide shadow-sm"
          title={`SQLite3 in-browser cache token: ${sqliteToken}`}
        >
          <Database className="w-3.5 h-3.5 text-emerald-400" />
          <span>SQLite3</span>
        </div>

        {/* Streak Pill */}
        <div 
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 font-semibold text-xs tracking-wide shadow-sm"
          title={`Current Streak: ${streak} consecutive active days`}
        >
          <Flame className="w-4 h-4 fill-amber-500 text-amber-500 animate-pulse" />
          <span>{streak} d</span>
        </div>

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          title="Toggle theme"
          aria-label="Toggle theme"
          className="p-2 rounded-xl bg-[#13192b] border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 transition-colors"
        >
          {isDarkMode ? (
            <Sun className="w-4 h-4 text-amber-400 hover:rotate-45 transition-transform" />
          ) : (
            <Moon className="w-4 h-4 text-indigo-400 hover:-rotate-12 transition-transform" />
          )}
        </button>
      </div>
    </header>
  );
};
