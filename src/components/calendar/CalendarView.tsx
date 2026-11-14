import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  getMonthMatrix, 
  parseYMD, 
  formatDateDisplay, 
  getSyllabusDay, 
  calculateDayStats 
} from '../../utils/dateUtils';
import { 
  ChevronLeft, 
  ChevronRight, 
  Check, 
  Info
} from 'lucide-react';

export const CalendarView: React.FC = () => {
  const { 
    state, 
    selectedDate, 
    setSelectedDate, 
    toggleHabit, 
    toggleTopic, 
    updateDailyNotes, 
    openModal 
  } = useApp();

  const selectedDateObj = parseYMD(selectedDate);
  const [currentYear, setCurrentYear] = useState(selectedDateObj.getFullYear());
  const [currentMonth, setCurrentMonth] = useState(selectedDateObj.getMonth()); // 0-indexed

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(prev => prev - 1);
    } else {
      setCurrentMonth(prev => prev - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(prev => prev + 1);
    } else {
      setCurrentMonth(prev => prev + 1);
    }
  };

  const weeks = getMonthMatrix(currentYear, currentMonth);

  // Calculate monthly stats
  let totalPercentSum = 0;
  let recordedDaysCount = 0;
  let activeDaysCount = 0;
  let perfectDaysCount = 0;

  weeks.forEach(week => {
    week.forEach(day => {
      if (day.isCurrentMonth) {
        const log = state.logs[day.dateStr];
        if (log) {
          const stats = calculateDayStats(log, 12);
          if (stats.completed > 0) {
            totalPercentSum += stats.percent;
            recordedDaysCount++;
            activeDaysCount++;
            if (stats.isPerfect) {
              perfectDaysCount++;
            }
          }
        }
      }
    });
  });

  const avgCompletion = recordedDaysCount > 0 ? Math.round(totalPercentSum / recordedDaysCount) : 0;

  // Selected Day Details
  const selectedLog = state.logs[selectedDate] || { habits: [], medicine: [], ortho: [], notes: '' };
  const selectedSyllabusDay = getSyllabusDay(state.settings.startDate, selectedDate);
  const selectedMedTopics = state.lists.medicine.filter(t => t.day === selectedSyllabusDay);
  const selectedOrthoTopics = state.lists.ortho.filter(t => t.day === selectedSyllabusDay);
  const totalItemsCount = selectedMedTopics.length + selectedOrthoTopics.length + state.lists.habits.length;
  const selectedDayStats = calculateDayStats(selectedLog, totalItemsCount > 0 ? totalItemsCount : 12);

  return (
    <div className="flex flex-col gap-6 max-w-5xl mx-auto pb-16">
      {/* View Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-display font-extrabold text-2xl text-slate-100">
            Calendar Progress
          </h2>
          <p className="text-sm text-slate-400 font-medium">
            Tap any day to view or edit tasks for that date
          </p>
        </div>

        {/* Month Switcher */}
        <div className="flex items-center gap-2 bg-[#13192b] border border-slate-800 rounded-xl p-1 shadow-sm self-start sm:self-auto">
          <button
            onClick={handlePrevMonth}
            title="Previous Month"
            aria-label="Previous Month"
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="font-display font-bold text-sm text-slate-200 px-3 min-w-[140px] text-center">
            {monthNames[currentMonth]} {currentYear}
          </span>
          <button
            onClick={handleNextMonth}
            title="Next Month"
            aria-label="Next Month"
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 3 KPI Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-[#13192b] border border-slate-800/80 rounded-2xl p-4 shadow-sm">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">
            AVG COMPLETION
          </span>
          <div className="flex items-baseline gap-2">
            <span className="font-display font-extrabold text-2xl text-indigo-400">
              {avgCompletion}%
            </span>
            <span className="text-xs text-slate-500">this month</span>
          </div>
        </div>

        <div className="bg-[#13192b] border border-slate-800/80 rounded-2xl p-4 shadow-sm">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">
            ACTIVE DAYS
          </span>
          <div className="flex items-baseline gap-2">
            <span className="font-display font-extrabold text-2xl text-emerald-400">
              {activeDaysCount}
            </span>
            <span className="text-xs text-slate-500">recorded</span>
          </div>
        </div>

        <div className="bg-[#13192b] border border-slate-800/80 rounded-2xl p-4 shadow-sm">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">
            100% DAYS
          </span>
          <div className="flex items-baseline gap-2">
            <span className="font-display font-extrabold text-2xl text-amber-400">
              {perfectDaysCount}
            </span>
            <span className="text-sm">🌟</span>
          </div>
        </div>
      </div>

      {/* Monthly Calendar Grid */}
      <div className="bg-[#13192b] border border-slate-800/80 rounded-2xl p-4 sm:p-6 shadow-md">
        {/* Day of Week Headers */}
        <div className="grid grid-cols-7 gap-1.5 sm:gap-2 mb-2 text-center text-xs font-bold text-slate-400 uppercase tracking-wider">
          <span>Sun</span>
          <span>Mon</span>
          <span>Tue</span>
          <span>Wed</span>
          <span>Thu</span>
          <span>Fri</span>
          <span>Sat</span>
        </div>

        {/* Days Matrix */}
        <div className="flex flex-col gap-1.5 sm:gap-2">
          {weeks.map((week, wIdx) => (
            <div key={wIdx} className="grid grid-cols-7 gap-1.5 sm:gap-2">
              {week.map(day => {
                const log = state.logs[day.dateStr];
                const stats = calculateDayStats(log, 12);
                const isSelected = day.dateStr === selectedDate;

                // Color tier styling
                let cellBg = 'bg-slate-900/40 border-slate-800/40 text-slate-400';
                if (stats.completed > 0) {
                  if (stats.isPerfect) {
                    cellBg = 'bg-emerald-950/80 border-emerald-500/80 text-emerald-200 shadow-sm shadow-emerald-500/10';
                  } else if (stats.percent >= 75) {
                    cellBg = 'bg-emerald-950/60 border-emerald-700/60 text-emerald-300';
                  } else if (stats.percent >= 50) {
                    cellBg = 'bg-teal-950/50 border-teal-800/50 text-teal-300';
                  } else {
                    cellBg = 'bg-indigo-950/40 border-indigo-900/40 text-indigo-300';
                  }
                }

                if (!day.isCurrentMonth) {
                  cellBg = 'bg-slate-950/20 border-slate-900/20 text-slate-600 opacity-40';
                }

                return (
                  <button
                    key={day.dateStr}
                    onClick={() => setSelectedDate(day.dateStr)}
                    className={`relative flex flex-col items-center justify-between p-1.5 sm:p-2.5 rounded-xl border transition-all min-h-[64px] sm:min-h-[76px] ${cellBg} ${
                      isSelected ? 'ring-2 ring-indigo-500 scale-[1.02] z-10' : 'hover:scale-[1.01]'
                    }`}
                  >
                    <div className="flex items-center justify-between w-full">
                      <span className={`text-xs sm:text-sm font-bold ${
                        day.isToday ? 'w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center' : ''
                      }`}>
                        {day.dayNumber}
                      </span>
                      {stats.isPerfect && (
                        <span className="text-[10px] text-amber-400">🌟</span>
                      )}
                    </div>

                    {stats.completed > 0 ? (
                      <span className="text-[10px] sm:text-xs font-semibold">
                        {stats.percent}%
                      </span>
                    ) : (
                      <span className="text-[10px] text-transparent select-none">-</span>
                    )}

                    {/* Subject Dots: Coral for Med, Cyan for Ortho */}
                    <div className="flex items-center gap-1 mt-1">
                      {stats.hasMedicine && (
                        <span className="w-1.5 h-1.5 rounded-full bg-rose-500" title="Medicine Completed" />
                      )}
                      {stats.hasOrtho && (
                        <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" title="Ortho Completed" />
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* Selected Day Interactive Inspector */}
      <div className="bg-[#13192b] border border-slate-800/80 rounded-2xl p-6 shadow-md flex flex-col gap-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">
                Day Inspector
              </span>
              <span className="text-xs text-slate-500">•</span>
              <span className="text-xs font-semibold text-slate-300">
                Syllabus Day {selectedSyllabusDay}
              </span>
            </div>
            <h3 className="font-display font-bold text-xl text-slate-100">
              {formatDateDisplay(selectedDate)}
            </h3>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-sm font-semibold text-slate-300">
              {selectedDayStats.percent}% Completed ({selectedDayStats.completed}/{selectedDayStats.total})
            </span>
          </div>
        </div>

        {/* Selected Day Tasks Breakdown */}
        <div className="flex flex-col gap-4">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Syllabus Topics
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {selectedMedTopics.map(topic => {
              const isDone = selectedLog.medicine.includes(topic.id);
              return (
                <div
                  key={topic.id}
                  className="flex items-center justify-between p-3 rounded-xl bg-slate-900/60 border border-slate-800/80"
                >
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => toggleTopic(selectedDate, topic.id, 'medicine')}
                      className={`w-5 h-5 rounded-md flex items-center justify-center transition-all ${
                        isDone ? 'bg-emerald-500 text-slate-950' : 'border-2 border-slate-600'
                      }`}
                    >
                      {isDone && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                    </button>
                    <div>
                      <span className="text-[10px] font-bold text-rose-400 uppercase tracking-wider block">
                        Medicine
                      </span>
                      <span className={`text-sm font-medium ${isDone ? 'line-through text-slate-500' : 'text-slate-200'}`}>
                        {topic.title}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => openModal({ type: 'topic', id: topic.id, category: 'medicine' })}
                    className="p-1 rounded text-slate-400 hover:text-white"
                  >
                    <Info className="w-4 h-4" />
                  </button>
                </div>
              );
            })}

            {selectedOrthoTopics.map(topic => {
              const isDone = selectedLog.ortho.includes(topic.id);
              return (
                <div
                  key={topic.id}
                  className="flex items-center justify-between p-3 rounded-xl bg-slate-900/60 border border-slate-800/80"
                >
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => toggleTopic(selectedDate, topic.id, 'ortho')}
                      className={`w-5 h-5 rounded-md flex items-center justify-center transition-all ${
                        isDone ? 'bg-emerald-500 text-slate-950' : 'border-2 border-slate-600'
                      }`}
                    >
                      {isDone && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                    </button>
                    <div>
                      <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider block">
                        Orthopaedics
                      </span>
                      <span className={`text-sm font-medium ${isDone ? 'line-through text-slate-500' : 'text-slate-200'}`}>
                        {topic.title}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => openModal({ type: 'topic', id: topic.id, category: 'ortho' })}
                    className="p-1 rounded text-slate-400 hover:text-white"
                  >
                    <Info className="w-4 h-4" />
                  </button>
                </div>
              );
            })}
          </div>

          {/* Habits preview & toggle */}
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mt-2">
            Daily Habits
          </h4>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
            {state.lists.habits.map(habit => {
              const isDone = selectedLog.habits.includes(habit.id);
              return (
                <button
                  key={habit.id}
                  onClick={() => toggleHabit(selectedDate, habit.id)}
                  className={`flex items-center gap-2 p-2 rounded-xl border text-xs font-medium transition-all text-left ${
                    isDone
                      ? 'bg-emerald-950/40 border-emerald-700/50 text-emerald-300'
                      : 'bg-slate-900/40 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <div className={`w-4 h-4 rounded flex items-center justify-center shrink-0 ${
                    isDone ? 'bg-emerald-500 text-slate-950' : 'border border-slate-600'
                  }`}>
                    {isDone && <Check className="w-3 h-3 stroke-[3]" />}
                  </div>
                  <span className="truncate">{habit.title}</span>
                </button>
              );
            })}
          </div>

          {/* Notes for this day */}
          <div className="mt-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
              Reflection Notes for this Date
            </h4>
            <textarea
              value={selectedLog.notes || ''}
              onChange={e => updateDailyNotes(selectedDate, e.target.value)}
              rows={2}
              placeholder="Notes for this day..."
              className="w-full px-3 py-2 rounded-xl bg-[#0b0f19] border border-slate-800 text-sm text-slate-200 focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
