import React, { useId } from 'react';
import { useApp } from '../../context/AppContext';
import { getSyllabusDay, formatDateDisplay, calculateDayStats, getYMD } from '../../utils/dateUtils';
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
  Sparkle
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
    openModal 
  } = useApp();

  const gradientId = useId();
  const dayLog = state.logs[selectedDate] || { habits: [], medicine: [], ortho: [], notes: '' };
  const syllabusDay = getSyllabusDay(state.settings.startDate, selectedDate);
  const isToday = selectedDate === getYMD();

  // Find today's topics based on syllabus day
  const todayMedicineTopics = state.lists.medicine.filter(t => t.day === syllabusDay);
  const todayOrthoTopics = state.lists.ortho.filter(t => t.day === syllabusDay);

  const totalDayItems = todayMedicineTopics.length + todayOrthoTopics.length + state.lists.habits.length;
  const stats = calculateDayStats(dayLog, totalDayItems > 0 ? totalDayItems : 12);

  const completedHabitsCount = state.lists.habits.filter(h => dayLog.habits.includes(h.id)).length;

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
    // Check if this makes it 100%
    if (stats.completed + 1 === stats.total) {
      triggerCelebration();
    }
  };

  const handleTopicToggle = (topicId: string, category: 'medicine' | 'ortho') => {
    toggleTopic(selectedDate, topicId, category);
    if (stats.completed + 1 === stats.total) {
      triggerCelebration();
    }
  };

  // Motivational subtitle
  let motivationalMsg = `0 of ${stats.total} items completed. Start strong and keep your streak alive!`;
  if (stats.percent === 100) {
    motivationalMsg = 'Outstanding! 100% completed today! Keep this incredible momentum going!';
  } else if (stats.percent >= 75) {
    motivationalMsg = 'Great momentum! You are almost finished with your daily syllabus.';
  } else if (stats.percent >= 50) {
    motivationalMsg = 'Halfway there! Keep pushing through your topics and habits.';
  } else if (stats.completed > 0) {
    motivationalMsg = `${stats.completed} of ${stats.total} items completed. Keep your daily streak alive!`;
  }

  // Circular progress calculations
  const radius = 42;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (stats.percent / 100) * circumference;

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
                {stats.percent}%
              </span>
              <span className="text-[11px] font-semibold text-slate-400 mt-1">
                {stats.completed}/{stats.total} Done
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Section 1: Today's Syllabus Topics */}
      <section className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h3 className="font-display font-bold text-sm text-slate-400 uppercase tracking-wider">
              Today's Syllabus Topics
            </h3>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-800 text-indigo-300 border border-slate-700">
              Day {syllabusDay}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Medicine Card */}
          {todayMedicineTopics.length > 0 ? (
            todayMedicineTopics.map(topic => {
              const isDone = dayLog.medicine.includes(topic.id);
              const meta = state.topicMeta[topic.id];

              return (
                <div
                  key={topic.id}
                  className={`group relative flex flex-col justify-between p-4 rounded-xl border transition-all ${
                    isDone
                      ? 'bg-slate-900/40 border-slate-800/60 opacity-80'
                      : 'bg-[#13192b] border-slate-800/90 hover:border-slate-700 shadow-md'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      {/* Custom Checkbox */}
                      <button
                        type="button"
                        onClick={() => handleTopicToggle(topic.id, 'medicine')}
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
                          <span className="text-xs font-bold text-rose-400 uppercase tracking-wider">
                            Medicine (Day {topic.day})
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
                          onClick={() => handleTopicToggle(topic.id, 'medicine')}
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
                      onClick={() => openModal({ type: 'topic', id: topic.id, category: 'medicine' })}
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
            <div className="p-4 rounded-xl border border-dashed border-slate-800 bg-[#13192b]/40 text-center flex flex-col items-center justify-center py-6">
              <Award className="w-6 h-6 text-slate-500 mb-1" />
              <span className="text-xs font-semibold text-slate-400">
                No Medicine topic assigned for Day {syllabusDay}
              </span>
            </div>
          )}

          {/* Orthopaedics Card */}
          {todayOrthoTopics.length > 0 ? (
            todayOrthoTopics.map(topic => {
              const isDone = dayLog.ortho.includes(topic.id);
              const meta = state.topicMeta[topic.id];

              return (
                <div
                  key={topic.id}
                  className={`group relative flex flex-col justify-between p-4 rounded-xl border transition-all ${
                    isDone
                      ? 'bg-slate-900/40 border-slate-800/60 opacity-80'
                      : 'bg-[#13192b] border-slate-800/90 hover:border-slate-700 shadow-md'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      {/* Checkbox */}
                      <button
                        type="button"
                        onClick={() => handleTopicToggle(topic.id, 'ortho')}
                        className={`w-6 h-6 rounded-lg mt-0.5 flex items-center justify-center transition-all ${
                          isDone
                            ? 'bg-emerald-500 text-slate-950 shadow-sm shadow-emerald-500/30'
                            : 'border-2 border-slate-600 hover:border-cyan-400'
                        }`}
                        aria-label={`Toggle ${topic.title}`}
                      >
                        {isDone && <Check className="w-4 h-4 stroke-[3]" />}
                      </button>

                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider">
                            Orthopaedics (Day {topic.day})
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
                          onClick={() => handleTopicToggle(topic.id, 'ortho')}
                          className={`font-semibold text-sm cursor-pointer select-none transition-colors ${
                            isDone ? 'line-through text-slate-500' : 'text-slate-100 hover:text-cyan-300'
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
                      onClick={() => openModal({ type: 'topic', id: topic.id, category: 'ortho' })}
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
            <div className="p-4 rounded-xl border border-dashed border-slate-800 bg-[#13192b]/40 text-center flex flex-col items-center justify-center py-6">
              <Award className="w-6 h-6 text-slate-500 mb-1" />
              <span className="text-xs font-semibold text-slate-400">
                No Orthopaedics topic assigned for Day {syllabusDay}
              </span>
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
            const isDone = dayLog.habits.includes(habit.id);
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
