import React, { useId, useState } from 'react';
import { useApp } from '../../context/AppContext';
import { getSyllabusDay, formatDateDisplay, getYMD } from '../../utils/dateUtils';
import { getSubjectTheme } from '../../utils/subjectColors';
import { 
  Sun, 
  Sunrise, 
  SunMedium, 
  Sunset, 
  Moon, 
  BookOpen, 
  BookOpenCheck, 
  BookMarked, 
  Sparkles, 
  Activity, 
  Check, 
  Info, 
  FileText, 
  AlertTriangle,
  Award,
  Sparkle,
  Plus,
  CheckCircle2,
  Calendar,
  Layers,
  HeartPulse,
  Database
} from 'lucide-react';
import confetti from 'canvas-confetti';

const HABIT_ICONS: Record<string, { icon: React.ComponentType<{ className?: string }>; color: string; bg: string }> = {
  Sun: { icon: Sun, color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/20' },
  Sunrise: { icon: Sunrise, color: 'text-orange-400', bg: 'bg-orange-500/10 border-orange-500/20' },
  SunMedium: { icon: SunMedium, color: 'text-yellow-400', bg: 'bg-yellow-500/10 border-yellow-500/20' },
  Sunset: { icon: Sunset, color: 'text-rose-400', bg: 'bg-rose-500/10 border-rose-500/20' },
  Moon: { icon: Moon, color: 'text-indigo-400', bg: 'bg-indigo-500/10 border-indigo-500/20' },
  BookOpen: { icon: BookOpen, color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20' },
  BookOpenCheck: { icon: BookOpenCheck, color: 'text-teal-400', bg: 'bg-teal-500/10 border-teal-500/20' },
  BookMarked: { icon: BookMarked, color: 'text-cyan-400', bg: 'bg-cyan-500/10 border-cyan-500/20' },
  Sparkles: { icon: Sparkles, color: 'text-purple-400', bg: 'bg-purple-500/10 border-purple-500/20' },
  Activity: { icon: Activity, color: 'text-rose-500', bg: 'bg-rose-500/10 border-rose-500/20' },
  Sparkle: { icon: Sparkle, color: 'text-indigo-400', bg: 'bg-indigo-500/10 border-indigo-500/20' },
};

export const TodayView: React.FC = () => {
  const { 
    state, 
    selectedDate, 
    toggleHabit, 
    toggleTopic, 
    updateDailyNotes, 
    openModal, 
    getSubjectTopics, 
    isTopicCompleted, 
    sqliteToken 
  } = useApp();

  const gradientId = useId();
  const dayLog = state.logs[selectedDate] || { habits: [], medicine: [], ortho: [], notes: '', subjectCompletions: {} };
  const syllabusDay = getSyllabusDay(state.settings.startDate, selectedDate);
  const isToday = selectedDate === (state.settings.startDate || '2026-11-15') || selectedDate === getYMD();

  // Subject filter state
  const [selectedSubjectFilter, setSelectedSubjectFilter] = useState<string>('all');

  const subjects = state.lists.subjects || [];

  // Gather all topics for today's syllabus day across subjects
  const allTodayTopics: Array<{
    subjectId: string;
    subjectName: string;
    subjectColor: string;
    topic: { id: string; day: number; title: string };
  }> = [];

  subjects.forEach(subject => {
    const topics = getSubjectTopics(subject.id);
    const dayTopics = topics.filter(t => t.day === syllabusDay);
    dayTopics.forEach(topic => {
      allTodayTopics.push({
        subjectId: subject.id,
        subjectName: subject.name,
        subjectColor: subject.color,
        topic,
      });
    });
  });

  const filteredTopics = selectedSubjectFilter === 'all' 
    ? allTodayTopics 
    : allTodayTopics.filter(item => item.subjectId === selectedSubjectFilter);

  // Calculate stats for today
  const totalDayItems = allTodayTopics.length + state.lists.habits.length;
  let completedTopicsCount = 0;
  allTodayTopics.forEach(item => {
    if (isTopicCompleted(selectedDate, item.subjectId, item.topic.id)) {
      completedTopicsCount++;
    }
  });

  const completedHabitsCount = state.lists.habits.filter(h => dayLog.habits?.includes(h.id)).length;
  const completedTotal = completedTopicsCount + completedHabitsCount;
  const percent = totalDayItems > 0 ? Math.min(100, Math.round((completedTotal / totalDayItems) * 100)) : 0;
  const remainingTotal = Math.max(0, totalDayItems - completedTotal);

  const triggerCelebration = () => {
    try {
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 }
      });
    } catch {
      // safe fallback
    }
  };

  const handleHabitToggle = (habitId: string) => {
    toggleHabit(selectedDate, habitId);
    if (completedTotal + 1 === totalDayItems) {
      triggerCelebration();
    }
  };

  const handleTopicToggle = (subjectId: string, topicId: string) => {
    toggleTopic(selectedDate, topicId, subjectId);
    if (completedTotal + 1 === totalDayItems) {
      triggerCelebration();
    }
  };

  // Motivational subtitle
  let motivationalMsg = `0 of ${totalDayItems} items completed. Start strong and keep your streak alive!`;
  if (percent === 100) {
    motivationalMsg = 'Outstanding dedication! 100% completed today. All clinical milestones achieved!';
  } else if (percent >= 75) {
    motivationalMsg = 'Phenomenal progress! You are nearly finished with your daily syllabus.';
  } else if (percent >= 50) {
    motivationalMsg = 'Halfway mark crossed! Keep your focus sharp through the remaining items.';
  } else if (completedTotal > 0) {
    motivationalMsg = `${completedTotal} of ${totalDayItems} items completed. Keep your daily streak thriving!`;
  }

  // Circular progress calculations (compact 40 radius)
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percent / 100) * circumference;

  return (
    <div className="flex flex-col gap-6 max-w-5xl mx-auto pb-16 animate-in fade-in duration-300">
      {/* 1. Compact, High-Density Executive Hero Header */}
      <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#10172a] via-[#0d1424] to-[#09101d] border border-slate-800/90 p-4 sm:p-5 shadow-xl backdrop-blur-xl">
        <div className="absolute top-0 right-1/4 w-60 h-60 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex flex-col gap-1.5 text-center md:text-left flex-1 min-w-0">
            {/* Date & Syllabus Day Pill */}
            <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-slate-900/80 border border-indigo-500/30 text-indigo-300 text-xs font-semibold self-center md:self-start shadow-sm">
              <Calendar className="w-3.5 h-3.5 text-indigo-400" />
              <span>{formatDateDisplay(selectedDate)}</span>
              <span className="text-slate-600">•</span>
              <span className="font-bold text-slate-100">Syllabus Day {syllabusDay}</span>
            </div>

            <h2 className="font-display font-extrabold text-xl sm:text-2xl text-slate-100 tracking-tight leading-tight">
              {isToday ? "Today's Study & Habits" : `Checklist for ${formatDateDisplay(selectedDate)}`}
            </h2>

            <p className="text-xs text-slate-400 max-w-lg font-medium">
              {motivationalMsg}
            </p>

            {/* Quick Metrics Bar inside Hero */}
            <div className="flex items-center justify-center md:justify-start gap-2 pt-1 text-xs">
              <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg bg-slate-900/60 border border-slate-800 text-slate-300">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span><strong className="text-slate-100">{completedTotal}</strong> of {totalDayItems} completed</span>
              </div>
              <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg bg-slate-900/60 border border-slate-800 text-slate-300">
                <Layers className="w-3.5 h-3.5 text-indigo-400" />
                <span><strong className="text-slate-100">{remainingTotal}</strong> remaining</span>
              </div>
            </div>
          </div>

          {/* Compact Circular Progress Ring */}
          <div className="relative flex items-center justify-center shrink-0">
            <svg className="w-28 h-28 transform -rotate-90 drop-shadow-md">
              <circle
                cx="56"
                cy="56"
                r={radius}
                className="stroke-slate-800/80"
                strokeWidth="8"
                fill="transparent"
              />
              <circle
                cx="56"
                cy="56"
                r={radius}
                stroke={`url(#${gradientId})`}
                strokeWidth="8"
                fill="transparent"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                className="transition-all duration-700 ease-out"
              />
              <defs>
                <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#6366f1" />
                  <stop offset="50%" stopColor="#3b82f6" />
                  <stop offset="100%" stopColor="#10b981" />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute flex flex-col items-center justify-center text-center">
              <span className="font-display font-extrabold text-2xl text-slate-100 leading-none tracking-tight">
                {percent}%
              </span>
              <span className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-wider">
                {completedTotal}/{totalDayItems}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Unified Master Curriculum Container (No separate scattered cards!) */}
      <section className="bg-[#13192b] border border-slate-800/80 rounded-2xl overflow-hidden shadow-sm flex flex-col">
        {/* Container Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800/80 flex flex-col gap-3.5 bg-slate-900/40">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                <HeartPulse className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-display font-bold text-base text-slate-100">
                  Today's Syllabus Topics
                </h3>
                <span className="text-xs text-slate-400">
                  Clinical curriculum mapped for Day {syllabusDay} ({allTodayTopics.length} topics scheduled)
                </span>
              </div>
            </div>

            {/* Add Checklist Item Button */}
            <button
              type="button"
              onClick={() => openModal({ type: 'addTopic', defaultDay: syllabusDay })}
              className="self-start sm:self-auto px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center gap-2 shadow-md shadow-indigo-600/25 transition-all hover:scale-[1.02] cursor-pointer"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>Add Checklist Item</span>
            </button>
          </div>

          {/* Integrated Filter Pill Strip */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs no-scrollbar">
            <button
              onClick={() => setSelectedSubjectFilter('all')}
              className={`px-3 py-1.5 rounded-xl font-bold shrink-0 transition-all cursor-pointer ${
                selectedSubjectFilter === 'all'
                  ? 'bg-slate-700 text-white shadow-sm ring-1 ring-slate-600'
                  : 'text-slate-400 hover:text-white bg-slate-900/60 border border-slate-800'
              }`}
            >
              All Subjects ({allTodayTopics.length})
            </button>
            {subjects.map(s => {
              const count = allTodayTopics.filter(t => t.subjectId === s.id).length;
              const theme = getSubjectTheme(s.color);
              const isSelected = selectedSubjectFilter === s.id;
              return (
                <button
                  key={s.id}
                  onClick={() => setSelectedSubjectFilter(s.id)}
                  className={`px-3 py-1.5 rounded-xl font-bold shrink-0 transition-all flex items-center gap-1.5 cursor-pointer ${
                    isSelected
                      ? `${theme.activeBtn} shadow-sm ring-1 ring-white/30`
                      : `${theme.badge} hover:opacity-90`
                  }`}
                >
                  <span>{s.name}</span>
                  {count > 0 && <span className="opacity-80 text-[10px]">({count})</span>}
                </button>
              );
            })}
          </div>
        </div>

        {/* Unified Table/List Body (Replaces individual bulky cards) */}
        <div className="divide-y divide-slate-800/60">
          {filteredTopics.length > 0 ? (
            filteredTopics.map(({ subjectId, subjectName, subjectColor, topic }) => {
              const isDone = isTopicCompleted(selectedDate, subjectId, topic.id);
              const meta = state.topicMeta[topic.id];
              const theme = getSubjectTheme(subjectColor);

              return (
                <div
                  key={topic.id}
                  className={`group flex items-center justify-between p-3.5 sm:p-4 transition-colors ${
                    isDone ? 'bg-slate-900/30' : 'hover:bg-slate-800/30'
                  }`}
                >
                  <div className="flex items-center gap-3.5 flex-1 min-w-0 mr-3">
                    {/* Round Checkbox */}
                    <button
                      type="button"
                      onClick={() => handleTopicToggle(subjectId, topic.id)}
                      className={`w-6 h-6 rounded-lg flex items-center justify-center transition-all shrink-0 cursor-pointer ${
                        isDone
                          ? 'bg-emerald-500 text-slate-950 shadow-sm shadow-emerald-500/30'
                          : 'border-2 border-slate-600 hover:border-indigo-400 bg-slate-900/50'
                      }`}
                      aria-label={`Toggle ${topic.title}`}
                    >
                      {isDone && <Check className="w-4 h-4 stroke-[3]" />}
                    </button>

                    {/* Subject & Day Pills */}
                    <div className="flex items-center gap-2 shrink-0">
                      <span className={`text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-md border ${theme.badge}`}>
                        {subjectName}
                      </span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-800 text-slate-400 hidden sm:inline-block">
                        DAY {topic.day}
                      </span>
                    </div>

                    {/* Topic Title and Details */}
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      <span
                        onClick={() => handleTopicToggle(subjectId, topic.id)}
                        className={`text-sm font-semibold truncate cursor-pointer select-none transition-colors ${
                          isDone ? 'line-through text-slate-500' : 'text-slate-100 hover:text-indigo-300'
                        }`}
                        title={topic.title}
                      >
                        {topic.title}
                      </span>

                      {meta?.rating ? (
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20 shrink-0">
                          ★ {meta.rating}
                        </span>
                      ) : null}

                      {meta?.needsRevision ? (
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-rose-500/10 text-rose-400 border border-rose-500/20 flex items-center gap-1 shrink-0">
                          <AlertTriangle className="w-3 h-3" />
                          Revision
                        </span>
                      ) : null}

                      {meta?.note ? (
                        <span className="text-xs text-slate-500 italic truncate max-w-[140px] sm:max-w-[200px] inline-block">
                          — {meta.note}
                        </span>
                      ) : null}
                    </div>
                  </div>

                  {/* Details / Rating Trigger */}
                  <button
                    type="button"
                    onClick={() => openModal({ type: 'topic', id: topic.id, category: subjectId })}
                    title="Topic Details & Rating"
                    aria-label={`Details for ${topic.title}`}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-colors shrink-0 cursor-pointer"
                  >
                    <Info className="w-4 h-4" />
                  </button>
                </div>
              );
            })
          ) : (
            <div className="p-8 text-center text-slate-400 text-xs flex flex-col items-center gap-2">
              <Award className="w-7 h-7 text-slate-600 mb-1" />
              <p className="font-semibold text-slate-300">
                No syllabus topics mapped for Day {syllabusDay} under {selectedSubjectFilter === 'all' ? 'any subject' : selectedSubjectFilter}
              </p>
              <button
                type="button"
                onClick={() => openModal({ type: 'addTopic', defaultDay: syllabusDay, category: selectedSubjectFilter !== 'all' ? selectedSubjectFilter : undefined })}
                className="mt-2 px-3 py-1.5 rounded-lg bg-indigo-600/30 hover:bg-indigo-600/50 text-indigo-300 text-xs font-semibold border border-indigo-500/30 transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>Add Item for Day {syllabusDay}</span>
              </button>
            </div>
          )}
        </div>
      </section>

      {/* 3. Unified Daily Habits Container (No separate scattered cards!) */}
      <section className="bg-[#13192b] border border-slate-800/80 rounded-2xl overflow-hidden shadow-sm flex flex-col">
        <div className="p-4 sm:p-5 border-b border-slate-800/80 flex items-center justify-between bg-slate-900/40">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-display font-bold text-base text-slate-100">
                General Daily Habits
              </h3>
              <span className="text-xs text-slate-400">Spiritual and lifestyle consistency routine</span>
            </div>
          </div>

          <span className="text-xs font-bold px-3 py-1 rounded-full bg-slate-800/90 text-emerald-400 border border-emerald-500/20 shadow-sm">
            {completedHabitsCount} / {state.lists.habits.length} Done
          </span>
        </div>

        {/* Compact 2-Column Grid inside the single card */}
        <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-800/60 p-2 sm:p-3">
          <div className="flex flex-col divide-y divide-slate-800/60">
            {state.lists.habits.slice(0, Math.ceil(state.lists.habits.length / 2)).map(habit => {
              const isDone = dayLog.habits?.includes(habit.id);
              const habitConfig = HABIT_ICONS[habit.icon] || { icon: Sparkles, color: 'text-indigo-400', bg: 'bg-indigo-500/10 border-indigo-500/20' };
              const IconComponent = habitConfig.icon;
              const meta = state.topicMeta[habit.id];

              return (
                <div
                  key={habit.id}
                  className={`flex items-center justify-between p-3 rounded-xl transition-colors ${
                    isDone ? 'bg-slate-900/30' : 'hover:bg-slate-800/30'
                  }`}
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0 mr-2">
                    <button
                      type="button"
                      onClick={() => handleHabitToggle(habit.id)}
                      className={`w-5 h-5 rounded-lg flex items-center justify-center transition-all shrink-0 cursor-pointer ${
                        isDone
                          ? 'bg-emerald-500 text-slate-950 shadow-sm shadow-emerald-500/20'
                          : 'border-2 border-slate-600 hover:border-slate-400 bg-slate-900/60'
                      }`}
                      aria-label={`Toggle ${habit.title}`}
                    >
                      {isDone && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                    </button>

                    <div className={`p-1.5 rounded-lg border shrink-0 ${habitConfig.bg} ${habitConfig.color}`}>
                      <IconComponent className="w-3.5 h-3.5" />
                    </div>

                    <span
                      onClick={() => handleHabitToggle(habit.id)}
                      className={`text-sm font-semibold truncate cursor-pointer select-none transition-colors ${
                        isDone ? 'line-through text-slate-500' : 'text-slate-100 hover:text-white'
                      }`}
                    >
                      {habit.title}
                    </span>

                    {meta?.rating ? (
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20 shrink-0">
                        ★ {meta.rating}
                      </span>
                    ) : null}
                  </div>

                  <button
                    type="button"
                    onClick={() => openModal({ type: 'habit', id: habit.id })}
                    title="Habit Details"
                    aria-label={`Details for ${habit.title}`}
                    className="p-1 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors shrink-0 cursor-pointer"
                  >
                    <Info className="w-3.5 h-3.5" />
                  </button>
                </div>
              );
            })}
          </div>

          <div className="flex flex-col divide-y divide-slate-800/60">
            {state.lists.habits.slice(Math.ceil(state.lists.habits.length / 2)).map(habit => {
              const isDone = dayLog.habits?.includes(habit.id);
              const habitConfig = HABIT_ICONS[habit.icon] || { icon: Sparkles, color: 'text-indigo-400', bg: 'bg-indigo-500/10 border-indigo-500/20' };
              const IconComponent = habitConfig.icon;
              const meta = state.topicMeta[habit.id];

              return (
                <div
                  key={habit.id}
                  className={`flex items-center justify-between p-3 rounded-xl transition-colors ${
                    isDone ? 'bg-slate-900/30' : 'hover:bg-slate-800/30'
                  }`}
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0 mr-2">
                    <button
                      type="button"
                      onClick={() => handleHabitToggle(habit.id)}
                      className={`w-5 h-5 rounded-lg flex items-center justify-center transition-all shrink-0 cursor-pointer ${
                        isDone
                          ? 'bg-emerald-500 text-slate-950 shadow-sm shadow-emerald-500/20'
                          : 'border-2 border-slate-600 hover:border-slate-400 bg-slate-900/60'
                      }`}
                      aria-label={`Toggle ${habit.title}`}
                    >
                      {isDone && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                    </button>

                    <div className={`p-1.5 rounded-lg border shrink-0 ${habitConfig.bg} ${habitConfig.color}`}>
                      <IconComponent className="w-3.5 h-3.5" />
                    </div>

                    <span
                      onClick={() => handleHabitToggle(habit.id)}
                      className={`text-sm font-semibold truncate cursor-pointer select-none transition-colors ${
                        isDone ? 'line-through text-slate-500' : 'text-slate-100 hover:text-white'
                      }`}
                    >
                      {habit.title}
                    </span>

                    {meta?.rating ? (
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20 shrink-0">
                        ★ {meta.rating}
                      </span>
                    ) : null}
                  </div>

                  <button
                    type="button"
                    onClick={() => openModal({ type: 'habit', id: habit.id })}
                    title="Habit Details"
                    aria-label={`Details for ${habit.title}`}
                    className="p-1 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors shrink-0 cursor-pointer"
                  >
                    <Info className="w-3.5 h-3.5" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 4. Unified Daily Notes & Reflection Container */}
      <section className="bg-[#13192b] border border-slate-800/80 rounded-2xl p-4 sm:p-5 shadow-sm flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-indigo-400" />
            <h3 className="font-display font-bold text-sm text-slate-200">
              Daily Reflection & Study Notes
            </h3>
          </div>

          {/* SQLite3 Cache Token indicator */}
          <span 
            className="inline-flex items-center gap-1.5 text-[11px] font-medium text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20"
            title={`SQLite3 in-browser cache token: ${sqliteToken}`}
          >
            <Database className="w-3 h-3 text-emerald-400" />
            <span>SQLite3 Cache Active</span>
          </span>
        </div>

        <textarea
          value={dayLog.notes || ''}
          onChange={e => updateDailyNotes(selectedDate, e.target.value)}
          rows={3}
          placeholder="How was your focus today? What needs extra attention tomorrow?"
          className="w-full px-4 py-3 rounded-xl bg-[#0b0f19] border border-slate-800 text-slate-100 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/30 transition-all resize-y placeholder-slate-500"
        />
      </section>
    </div>
  );
};
