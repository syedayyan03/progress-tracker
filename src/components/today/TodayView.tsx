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
  Plus
} from 'lucide-react';
import confetti from 'canvas-confetti';

const HABIT_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
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
  Sparkle,
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
    isTopicCompleted
  } = useApp();

  const gradientId = useId();
  const dayLog = state.logs[selectedDate] || { habits: [], medicine: [], ortho: [], notes: '', subjectCompletions: {} };
  const syllabusDay = getSyllabusDay(state.settings.startDate, selectedDate);
  const isToday = selectedDate === getYMD();

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

  const triggerCelebration = () => {
    try {
      confetti({
        particleCount: 100,
        spread: 70,
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
    motivationalMsg = 'Outstanding! 100% completed today! Keep this incredible momentum going!';
  } else if (percent >= 75) {
    motivationalMsg = 'Great momentum! You are almost finished with your daily syllabus.';
  } else if (percent >= 50) {
    motivationalMsg = 'Halfway there! Keep pushing through your topics and habits.';
  } else if (completedTotal > 0) {
    motivationalMsg = `${completedTotal} of ${totalDayItems} items completed. Keep your daily streak alive!`;
  }

  // Circular progress calculations
  const radius = 42;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percent / 100) * circumference;

  return (
    <div className="flex flex-col gap-6 max-w-5xl mx-auto pb-16">
      {/* Hero Progress Card */}
      <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-950/60 via-slate-900/90 to-teal-950/40 border border-slate-800/80 p-6 shadow-xl backdrop-blur-sm">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex flex-col gap-2.5 text-center sm:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold self-center sm:self-start">
              <span>{formatDateDisplay(selectedDate)}</span>
              <span>•</span>
              <span>Day {syllabusDay}</span>
            </div>

            <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-slate-100 tracking-tight">
              {isToday ? "Today's Study & Habits" : `Checklist for ${formatDateDisplay(selectedDate)}`}
            </h2>

            <p className="text-sm text-slate-300 max-w-md font-medium">
              {motivationalMsg}
            </p>
          </div>

          {/* Animated Circular Progress Ring */}
          <div className="relative flex items-center justify-center shrink-0">
            <svg className="w-28 h-28 transform -rotate-90">
              <circle
                cx="56"
                cy="56"
                r={radius}
                className="stroke-slate-800"
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
                  <stop offset="100%" stopColor="#10b981" />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute flex flex-col items-center justify-center text-center">
              <span className="font-display font-extrabold text-2xl text-slate-100 leading-none">
                {percent}%
              </span>
              <span className="text-[11px] font-semibold text-slate-400 mt-1">
                {completedTotal}/{totalDayItems} Done
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Section 1: Today's Syllabus Topics */}
      <section className="flex flex-col gap-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <h3 className="font-display font-bold text-sm text-slate-400 uppercase tracking-wider">
              Today's Syllabus Topics
            </h3>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-800 text-indigo-300 border border-slate-700">
              Day {syllabusDay}
            </span>
          </div>

          {/* Add Checklist Item Button */}
          <button
            type="button"
            onClick={() => openModal({ type: 'addTopic', defaultDay: syllabusDay })}
            className="self-start sm:self-auto px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-indigo-600/20 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Add Checklist Item</span>
          </button>
        </div>

        {/* Subjects Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
          <button
            onClick={() => setSelectedSubjectFilter('all')}
            className={`px-3 py-1 rounded-lg font-semibold shrink-0 transition-all ${
              selectedSubjectFilter === 'all'
                ? 'bg-slate-700 text-white shadow-sm'
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
                className={`px-3 py-1 rounded-lg font-semibold shrink-0 transition-all flex items-center gap-1.5 ${
                  isSelected
                    ? `${theme.activeBtn} shadow-sm`
                    : `${theme.badge} hover:opacity-90`
                }`}
              >
                <span>{s.name}</span>
                {count > 0 && <span className="opacity-75 text-[10px]">({count})</span>}
              </button>
            );
          })}
        </div>

        {/* Topics Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredTopics.length > 0 ? (
            filteredTopics.map(({ subjectId, subjectName, subjectColor, topic }) => {
              const isDone = isTopicCompleted(selectedDate, subjectId, topic.id);
              const meta = state.topicMeta[topic.id];
              const theme = getSubjectTheme(subjectColor);

              return (
                <div
                  key={topic.id}
                  className={`group relative flex flex-col justify-between p-4 rounded-xl border transition-all ${
                    isDone
                      ? 'bg-slate-900/40 border-slate-800/60 opacity-80'
                      : `bg-[#13192b] border-slate-800/90 ${theme.hoverBorder} shadow-md`
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      {/* Checkbox */}
                      <button
                        type="button"
                        onClick={() => handleTopicToggle(subjectId, topic.id)}
                        className={`w-6 h-6 rounded-lg mt-0.5 flex items-center justify-center transition-all ${
                          isDone
                            ? 'bg-emerald-500 text-slate-950 shadow-sm shadow-emerald-500/30'
                            : 'border-2 border-slate-600 hover:border-indigo-400'
                        }`}
                        aria-label={`Toggle ${topic.title}`}
                      >
                        {isDone && <Check className="w-4 h-4 stroke-[3]" />}
                      </button>

                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className={`text-xs font-bold uppercase tracking-wider ${theme.text}`}>
                            {subjectName} (Day {topic.day})
                          </span>
                          <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-slate-800 text-slate-400">
                            DAY {topic.day}
                          </span>
                          {meta?.rating ? (
                            <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">
                              ★ {meta.rating}
                            </span>
                          ) : null}
                          {meta?.needsRevision ? (
                            <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-rose-500/10 text-rose-400 border border-rose-500/20 flex items-center gap-1">
                              <AlertTriangle className="w-3 h-3" />
                              Revision
                            </span>
                          ) : null}
                        </div>

                        <h4
                          onClick={() => handleTopicToggle(subjectId, topic.id)}
                          className={`font-semibold text-sm cursor-pointer select-none transition-colors ${
                            isDone ? 'line-through text-slate-500' : 'text-slate-100 hover:text-indigo-300'
                          }`}
                        >
                          {topic.title}
                        </h4>

                        {meta?.note ? (
                          <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-1 line-clamp-1">
                            <FileText className="w-3 h-3 text-slate-500 shrink-0" />
                            <span className="italic">{meta.note}</span>
                          </div>
                        ) : null}
                      </div>
                    </div>

                    {/* Info button */}
                    <button
                      type="button"
                      onClick={() => openModal({ type: 'topic', id: topic.id, category: subjectId })}
                      title="Topic Details & Rating"
                      className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors shrink-0"
                    >
                      <Info className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="p-6 rounded-xl border border-dashed border-slate-800 bg-[#13192b]/40 text-center flex flex-col items-center justify-center col-span-full">
              <Award className="w-6 h-6 text-slate-500 mb-1" />
              <span className="text-xs font-semibold text-slate-400">
                No topics scheduled for Day {syllabusDay} in {selectedSubjectFilter === 'all' ? 'any subject' : selectedSubjectFilter}
              </span>
              <button
                type="button"
                onClick={() => openModal({ type: 'addTopic', defaultDay: syllabusDay, category: selectedSubjectFilter !== 'all' ? selectedSubjectFilter : undefined })}
                className="mt-3 px-3 py-1.5 rounded-lg bg-indigo-600/30 hover:bg-indigo-600/50 text-indigo-300 text-xs font-bold border border-indigo-500/30 transition-all flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>Add Item for Day {syllabusDay}</span>
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Section 2: General Daily Habits */}
      <section className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h3 className="font-display font-bold text-sm text-slate-400 uppercase tracking-wider">
            General Daily Habits (10)
          </h3>
          <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-800 text-emerald-400 border border-slate-700">
            {completedHabitsCount} / {state.lists.habits.length} Done
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {state.lists.habits.map(habit => {
            const isDone = dayLog.habits?.includes(habit.id);
            const IconComponent = HABIT_ICONS[habit.icon] || Sparkles;
            const meta = state.topicMeta[habit.id];

            return (
              <div
                key={habit.id}
                className={`group flex items-center justify-between p-3.5 rounded-xl border transition-all ${
                  isDone
                    ? 'bg-slate-900/50 border-slate-800/60 opacity-85'
                    : 'bg-[#13192b] border-slate-800/90 hover:border-slate-700 shadow-sm'
                }`}
              >
                <div className="flex items-center gap-3">
                  {/* Checkbox */}
                  <button
                    type="button"
                    onClick={() => handleHabitToggle(habit.id)}
                    className={`w-5 h-5 rounded-md flex items-center justify-center transition-all ${
                      isDone
                        ? 'bg-emerald-500 text-slate-950 shadow-sm shadow-emerald-500/20'
                        : 'border-2 border-slate-600 hover:border-slate-400'
                    }`}
                    aria-label={`Toggle ${habit.title}`}
                  >
                    {isDone && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                  </button>

                  {/* Habit Icon */}
                  <div className={`p-1.5 rounded-lg ${
                    isDone ? 'bg-slate-800 text-emerald-400' : 'bg-slate-800/60 text-slate-400'
                  }`}>
                    <IconComponent className="w-4 h-4" />
                  </div>

                  {/* Habit Title */}
                  <span
                    onClick={() => handleHabitToggle(habit.id)}
                    className={`text-sm font-medium cursor-pointer select-none transition-colors ${
                      isDone ? 'line-through text-slate-500' : 'text-slate-200 hover:text-white'
                    }`}
                  >
                    {habit.title}
                  </span>

                  {meta?.rating ? (
                    <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">
                      ★ {meta.rating}
                    </span>
                  ) : null}
                </div>

                {/* Details Button */}
                <button
                  type="button"
                  onClick={() => openModal({ type: 'habit', id: habit.id })}
                  title="Habit Details"
                  className="p-1.5 rounded-lg text-slate-500 hover:text-slate-300 hover:bg-slate-800 transition-colors"
                >
                  <Info className="w-3.5 h-3.5" />
                </button>
              </div>
            );
          })}
        </div>
      </section>

      {/* Section 3: Daily Reflection & Notes */}
      <section className="flex flex-col gap-2.5">
        <div className="flex items-center justify-between">
          <h3 className="font-display font-bold text-sm text-slate-400 uppercase tracking-wider">
            Daily Reflection & Notes
          </h3>
          <span className="text-[11px] font-medium text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
            Auto-saved
          </span>
        </div>

        <textarea
          value={dayLog.notes || ''}
          onChange={e => updateDailyNotes(selectedDate, e.target.value)}
          rows={3}
          placeholder="How was your focus today? What needs extra attention tomorrow?"
          className="w-full px-4 py-3 rounded-2xl bg-[#13192b] border border-slate-800/90 text-slate-200 text-sm focus:outline-none focus:border-indigo-500 transition-colors resize-y shadow-sm"
        />
      </section>
    </div>
  );
};
