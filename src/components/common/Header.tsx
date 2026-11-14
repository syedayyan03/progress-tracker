import React from 'react';
import { useApp } from '../../context/AppContext';
import { addDays, formatDateDisplay, calculateStreak } from '../../utils/dateUtils';
import { ChevronLeft, ChevronRight, Flame, Sun, Moon, Sparkles, Database, Menu } from 'lucide-react';

export const Header: React.FC = () => {
  const { state, selectedDate, setSelectedDate, setTheme, sqliteToken, toggleMobileMenu } = useApp();
  const startDayStr = state.settings.startDate || '2026-11-15';
  const isStartDay = selectedDate === startDayStr;

  const streak = calculateStreak(state.logs, startDayStr);

  const handlePrevDay = () => {
    setSelectedDate(addDays(selectedDate, -1));
  };

  const handleNextDay = () => {
    setSelectedDate(addDays(selectedDate, 1));
  };

  const handleTodayClick = () => {
    setSelectedDate(startDayStr);
  };

  const isDarkMode = state.settings.theme === 'dark' || 
    (state.settings.theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);

  const toggleTheme = () => {
    setTheme(isDarkMode ? 'light' : 'dark');
  };

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between px-3 sm:px-6 lg:px-8 py-3 bg-[#0b0f19]/90 dark:bg-[#0b0f19]/90 backdrop-blur-xl border-b border-slate-800/80 transition-colors">
      {/* Left side title / indicator with Hamburger for mobile/tablet */}
      <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
        <button
          type="button"
          onClick={toggleMobileMenu}
          aria-label="Open sidebar menu"
          title="Open menu"
          className="md:hidden p-1.5 -ml-1 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800/80 active:bg-slate-800 transition-colors cursor-pointer"
        >
          <Menu className="w-5 h-5" />
        </button>

        <span className="relative flex h-2.5 w-2.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
        </span>
        <h1 className="font-display font-bold text-sm sm:text-base text-slate-100 tracking-tight">
          Daily Progress
        </h1>
      </div>

      {/* Center: Date Switcher Controls */}
      <div className="flex items-center gap-1 bg-[#13192b]/95 border border-slate-800/90 rounded-xl p-1 shadow-sm shrink-0">
        <button
          onClick={handlePrevDay}
          title="Previous day"
          aria-label="Previous day"
          className="p-1 sm:p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800/80 transition-colors"
        >
          <ChevronLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
        </button>

        <button
          onClick={handleTodayClick}
          data-testid="date-switcher-center"
          className={`px-2.5 sm:px-3 py-1 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 ${
            isStartDay
              ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-500/20'
              : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
          }`}
          title={isStartDay ? "Viewing Day 1 · Today (15/11/2026)" : "Click to jump to Day 1 (15/11/2026)"}
        >
          {isStartDay ? (
            <>
              <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-indigo-200" />
              <span>Day 1 · Today</span>
            </>
          ) : (
            <span className="max-w-[85px] sm:max-w-none truncate">{formatDateDisplay(selectedDate)}</span>
          )}
        </button>

        <button
          onClick={handleNextDay}
          title="Next day"
          aria-label="Next day"
          className="p-1 sm:p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800/80 transition-colors"
        >
          <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
        </button>
      </div>

      {/* Right side: SQLite3 pill + Streak pill + Theme toggle */}
      <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
        {/* SQLite3 Cache Token Badge */}
        <div 
          className="hidden xl:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-900 border border-emerald-500/20 text-emerald-400 font-medium text-[11px] tracking-wide shadow-sm"
          title={`SQLite3 in-browser cache token: ${sqliteToken}`}
        >
          <Database className="w-3.5 h-3.5 text-emerald-400" />
          <span>SQLite3</span>
        </div>

        {/* Streak Pill */}
        <div 
          className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 font-semibold text-xs tracking-wide shadow-sm"
          title={`Current Streak: ${streak} consecutive active days`}
        >
          <Flame className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-amber-500 text-amber-500 animate-pulse" />
          <span>{streak} d</span>
        </div>

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          title="Toggle theme"
          aria-label="Toggle theme"
          className="p-1.5 sm:p-2 rounded-xl bg-[#13192b] border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 transition-colors"
        >
          {isDarkMode ? (
            <Sun className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-400 hover:rotate-45 transition-transform" />
          ) : (
            <Moon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-indigo-400 hover:-rotate-12 transition-transform" />
          )}
        </button>
      </div>
    </header>
  );
};
