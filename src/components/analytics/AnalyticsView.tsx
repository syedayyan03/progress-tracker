import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  getYMD, 
  parseYMD, 
  addDays, 
  calculateStreak, 
  calculateDayStats 
} from '../../utils/dateUtils';
import { 
  CheckCircle2, 
  Percent, 
  Flame, 
  Calendar, 
  Award, 
  AlertCircle, 
  TrendingUp, 
  Sparkles,
  Zap,
  BookOpen,
  Activity
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
} from 'recharts';

export const AnalyticsView: React.FC = () => {
  const { state } = useApp();
  const todayStr = getYMD();

  // Filters
  const [heatmapTab, setHeatmapTab] = useState<'Overall' | 'Medicine' | 'Ortho' | 'Habits'>('Overall');
  const [trendRange, setTrendRange] = useState<'7D' | '30D' | '90D' | 'All'>('30D');

  // Total topics
  const totalMedTopics = state.lists.medicine.length;
  const totalOrthoTopics = state.lists.ortho.length;
  const totalSyllabusTopics = totalMedTopics + totalOrthoTopics;

  // Set of completed topics across all logs
  const completedMedIds = new Set<string>();
  const completedOrthoIds = new Set<string>();

  Object.values(state.logs).forEach(log => {
    log.medicine?.forEach(id => completedMedIds.add(id));
    log.ortho?.forEach(id => completedOrthoIds.add(id));
  });

  const totalTopicsCompleted = completedMedIds.size + completedOrthoIds.size;
  const remainingTopics = Math.max(0, totalSyllabusTopics - totalTopicsCompleted);

  // Overall Completion across all recorded days
  const recordedLogDates = Object.keys(state.logs).filter(d => {
    const l = state.logs[d];
    return ((l.habits?.length || 0) + (l.medicine?.length || 0) + (l.ortho?.length || 0)) > 0;
  });

  let totalPercentSum = 0;
  let bestDayPercent = 0;
  let bestDayDate = '';

  recordedLogDates.forEach(d => {
    const stats = calculateDayStats(state.logs[d], 12);
    totalPercentSum += stats.percent;
    if (stats.percent > bestDayPercent) {
      bestDayPercent = stats.percent;
      bestDayDate = d;
    }
  });

  const overallAvgCompletion = recordedLogDates.length > 0 
    ? Math.round(totalPercentSum / recordedLogDates.length) 
    : 0;

  // Streak
  const currentStreak = calculateStreak(state.logs, todayStr);

  // Velocity & Projected finish
  const velocity = recordedLogDates.length > 0
    ? (totalTopicsCompleted / Math.max(1, recordedLogDates.length)).toFixed(1)
    : '0.1';

  const daysNeeded = Number(velocity) > 0 ? Math.ceil(remainingTopics / Number(velocity)) : 300;
  const projectedFinishDate = new Date();
  projectedFinishDate.setDate(projectedFinishDate.getDate() + daysNeeded);
  const projectedFinishStr = projectedFinishDate.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  // Day of week analysis (0=Sun, 1=Mon, ..., 6=Sat)
  const dayOfWeekStats = useMemo(() => {
    const dayTotals = [0, 0, 0, 0, 0, 0, 0];
    const dayCounts = [0, 0, 0, 0, 0, 0, 0];
    const names = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    recordedLogDates.forEach(d => {
      const date = parseYMD(d);
      const dayIdx = date.getDay();
      const stats = calculateDayStats(state.logs[d], 12);
      dayTotals[dayIdx] += stats.percent;
      dayCounts[dayIdx] += 1;
    });

    return names.map((name, i) => {
      const avg = dayCounts[i] > 0 ? Math.round(dayTotals[i] / dayCounts[i]) : 0;
      return {
        day: name,
        avg,
        count: dayCounts[i],
      };
    });
  }, [state.logs, recordedLogDates]);

  // Find highest & lowest day
  const validDays = dayOfWeekStats.filter(d => d.count > 0);
  const sortedDays = [...validDays].sort((a, b) => b.avg - a.avg);
  const highestDay = sortedDays[0] || { day: 'Fri', avg: 85 };
  const lowestDay = sortedDays[sortedDays.length - 1] || { day: 'Sun', avg: 60 };

  // 30-day Habit Performance
  const habitPerformance = useMemo(() => {
    // Check last 30 days
    const last30Days: string[] = [];
    for (let i = 29; i >= 0; i--) {
      last30Days.push(addDays(todayStr, -i));
    }

    const recordedIn30 = last30Days.filter(d => state.logs[d]);
    const denominator = Math.max(1, recordedIn30.length);

    return state.lists.habits.map(habit => {
      let completedCount = 0;
      last30Days.forEach(d => {
        if (state.logs[d]?.habits?.includes(habit.id)) {
          completedCount++;
        }
      });
      const percent = Math.round((completedCount / denominator) * 100);
      return {
        id: habit.id,
        title: habit.title,
        percent,
      };
    }).sort((a, b) => a.percent - b.percent); // Lowest to highest
  }, [state.logs, state.lists.habits, todayStr]);

  const lowestHabit = habitPerformance[0] || { title: 'Workout', percent: 50 };
  const highestHabit = habitPerformance[habitPerformance.length - 1] || { title: 'Surah Waqia', percent: 95 };

  // Trend Chart Data
  const trendData = useMemo(() => {
    const count = trendRange === '7D' ? 7 : trendRange === '30D' ? 30 : trendRange === '90D' ? 90 : 120;
    const list: Array<{ date: string; displayDate: string; completion: number; movingAvg: number }> = [];

    const runningPercentages: number[] = [];

    for (let i = count - 1; i >= 0; i--) {
      const dStr = addDays(todayStr, -i);
      const log = state.logs[dStr];
      const stats = calculateDayStats(log, 12);
      const val = log ? stats.percent : 0;
      runningPercentages.push(val);

      // 7-day moving avg
      const slice = runningPercentages.slice(Math.max(0, runningPercentages.length - 7));
      const mAvg = Math.round(slice.reduce((acc, curr) => acc + curr, 0) / slice.length);

      const dObj = parseYMD(dStr);
      list.push({
        date: dStr,
        displayDate: `${dObj.getMonth() + 1}/${dObj.getDate()}`,
        completion: val,
        movingAvg: mAvg,
      });
    }

    return list;
  }, [state.logs, trendRange, todayStr]);

  // Radar Data (Medicine, Ortho, Habits balance)
  const radarData = useMemo(() => {
    const medPercent = totalMedTopics > 0 ? Math.round((completedMedIds.size / totalMedTopics) * 100) : 0;
    const orthoPercent = totalOrthoTopics > 0 ? Math.round((completedOrthoIds.size / totalOrthoTopics) * 100) : 0;
    const habitsAvg = habitPerformance.length > 0
      ? Math.round(habitPerformance.reduce((acc, h) => acc + h.percent, 0) / habitPerformance.length)
      : 70;

    return [
      { subject: 'Medicine', score: Math.max(15, medPercent) },
      { subject: 'Orthopaedics', score: Math.max(15, orthoPercent) },
      { subject: 'Habits', score: habitsAvg },
      { subject: 'Consistency', score: Math.min(100, Math.max(20, currentStreak * 4)) },
      { subject: 'Pace', score: Math.min(100, Math.max(25, Math.round(Number(velocity) * 80))) },
    ];
  }, [completedMedIds.size, completedOrthoIds.size, totalMedTopics, totalOrthoTopics, habitPerformance, currentStreak, velocity]);

  // Weekly Comparison Data (W1 to W8)
  const weeklyData = useMemo(() => {
    const weeks: Array<{ week: string; completion: number }> = [];
    for (let w = 7; w >= 0; w--) {
      let sum = 0;
      let recordedDays = 0;
      for (let d = 6; d >= 0; d--) {
        const offset = w * 7 + d;
        const dStr = addDays(todayStr, -offset);
        const log = state.logs[dStr];
        if (log) {
          sum += calculateDayStats(log, 12).percent;
          recordedDays++;
        }
      }
      weeks.push({
        week: `W${8 - w}`,
        completion: recordedDays > 0 ? Math.round(sum / 7) : 0,
      });
    }
    return weeks;
  }, [state.logs, todayStr]);

  // 52-week activity heatmap (spans 52 weeks = 364 days)
  const heatmapWeeks = useMemo(() => {
    const weeksList: Array<Array<{ dateStr: string; intensity: number; count: number }>> = [];
    const totalDays = 52 * 7;
    const startDayObj = new Date(parseYMD(todayStr));
    startDayObj.setDate(startDayObj.getDate() - (totalDays - 1));

    let currentWeek: Array<{ dateStr: string; intensity: number; count: number }> = [];

    for (let i = 0; i < totalDays; i++) {
      const d = new Date(startDayObj);
      d.setDate(startDayObj.getDate() + i);
      const dStr = getYMD(d);
      const log = state.logs[dStr];

      let score = 0;
      if (log) {
        if (heatmapTab === 'Overall') {
          score = calculateDayStats(log, 12).completed;
        } else if (heatmapTab === 'Medicine') {
          score = (log.medicine?.length || 0) * 4;
        } else if (heatmapTab === 'Ortho') {
          score = (log.ortho?.length || 0) * 4;
        } else if (heatmapTab === 'Habits') {
          score = log.habits?.length || 0;
        }
      }

      let intensity = 0;
      if (score >= 10) intensity = 4;
      else if (score >= 7) intensity = 3;
      else if (score >= 4) intensity = 2;
      else if (score > 0) intensity = 1;

      currentWeek.push({
        dateStr: dStr,
        intensity,
        count: score,
      });

      if (currentWeek.length === 7) {
        weeksList.push(currentWeek);
        currentWeek = [];
      }
    }

    return weeksList;
  }, [state.logs, heatmapTab, todayStr]);

  const medPercentDone = Math.round((completedMedIds.size / totalMedTopics) * 100);
  const orthoPercentDone = Math.round((completedOrthoIds.size / totalOrthoTopics) * 100);

  return (
    <div className="flex flex-col gap-6 max-w-5xl mx-auto pb-16">
      {/* Header */}
      <div>
        <h2 className="font-display font-extrabold text-2xl text-slate-100">
          Study & Habits Analytics
        </h2>
        <p className="text-sm text-slate-400 font-medium">
          Real-time heatmaps, completion trends, syllabus pace, and consistency insights
        </p>
      </div>

      {/* 6 Top KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5">
        {/* 1. Topics Completed */}
        <div className="bg-[#13192b] border border-slate-800/80 rounded-2xl p-4 flex flex-col justify-between shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              TOPICS COMPLETED
            </span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="mt-2">
            <div className="font-display font-extrabold text-xl text-slate-100">
              {totalTopicsCompleted} / {totalSyllabusTopics}
            </div>
            <span className="text-[11px] text-slate-400 block mt-0.5">
              {remainingTopics} remaining
            </span>
          </div>
        </div>

        {/* 2. Overall Completion */}
        <div className="bg-[#13192b] border border-slate-800/80 rounded-2xl p-4 flex flex-col justify-between shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              OVERALL COMPLETION
            </span>
            <Percent className="w-4 h-4 text-blue-400" />
          </div>
          <div className="mt-2">
            <div className="font-display font-extrabold text-xl text-blue-400">
              {overallAvgCompletion}%
            </div>
            <span className="text-[11px] text-slate-400 block mt-0.5">
              across all logs
            </span>
          </div>
        </div>

        {/* 3. Current Streak */}
        <div className="bg-[#13192b] border border-slate-800/80 rounded-2xl p-4 flex flex-col justify-between shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              CURRENT STREAK
            </span>
            <Flame className="w-4 h-4 text-amber-400 fill-amber-400" />
          </div>
          <div className="mt-2">
            <div className="font-display font-extrabold text-xl text-amber-400">
              {currentStreak} Days
            </div>
            <span className="text-[11px] text-slate-400 block mt-0.5">
              Active streak
            </span>
          </div>
        </div>

        {/* 4. Projected Finish */}
        <div className="bg-[#13192b] border border-slate-800/80 rounded-2xl p-4 flex flex-col justify-between shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              PROJECTED FINISH
            </span>
            <Calendar className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="mt-2">
            <div className="font-display font-bold text-sm text-indigo-300 truncate" title={projectedFinishStr}>
              {projectedFinishStr}
            </div>
            <span className="text-[11px] text-slate-400 block mt-0.5">
              @ {velocity} topics/day
            </span>
          </div>
        </div>

        {/* 5. Best Day Record */}
        <div className="bg-[#13192b] border border-slate-800/80 rounded-2xl p-4 flex flex-col justify-between shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              BEST DAY RECORD
            </span>
            <Award className="w-4 h-4 text-purple-400" />
          </div>
          <div className="mt-2">
            <div className="font-display font-extrabold text-xl text-purple-400">
              {bestDayPercent}%
            </div>
            <span className="text-[11px] text-slate-400 block mt-0.5 truncate" title={bestDayDate}>
              {bestDayDate || 'None yet'}
            </span>
          </div>
        </div>

        {/* 6. Pending / Overdue */}
        <div className="bg-[#13192b] border border-slate-800/80 rounded-2xl p-4 flex flex-col justify-between shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              PENDING / OVERDUE
            </span>
            <AlertCircle className="w-4 h-4 text-teal-400" />
          </div>
          <div className="mt-2">
            <div className="font-display font-extrabold text-xl text-teal-400">
              0
            </div>
            <span className="text-[11px] text-slate-400 block mt-0.5">
              All caught up!
            </span>
          </div>
        </div>
      </div>

      {/* Smart Performance Insights Engine */}
      <div className="bg-gradient-to-r from-indigo-950/40 via-[#13192b] to-slate-900/60 border border-slate-800/80 rounded-2xl p-5 shadow-md flex flex-col gap-3">
        <div className="flex items-center gap-2">
          <Zap className="w-4 h-4 text-amber-400 fill-amber-400" />
          <h3 className="font-display font-bold text-sm text-slate-200 uppercase tracking-wider">
            Smart Performance Insights
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-slate-300">
          <div className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-900/60 border border-slate-800">
            <Sparkles className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <strong className="text-slate-200 block text-xs uppercase tracking-wide mb-0.5">Strongest Day</strong>
              <span>You're strongest on <strong className="text-emerald-300">{highestDay.day}s</strong> with an average {highestDay.avg}% completion rate!</span>
            </div>
          </div>

          <div className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-900/60 border border-slate-800">
            <TrendingUp className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <strong className="text-slate-200 block text-xs uppercase tracking-wide mb-0.5">Lowest Day</strong>
              <span><strong className="text-amber-300">{lowestDay.day}</strong> is typically your lowest day ({lowestDay.avg}%). Consider planning lighter tasks or scheduling review time then.</span>
            </div>
          </div>

          <div className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-900/60 border border-slate-800">
            <Activity className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
            <div>
              <strong className="text-slate-200 block text-xs uppercase tracking-wide mb-0.5">Friction Spot</strong>
              <span>"{lowestHabit.title}" is your most-skipped habit this month ({lowestHabit.percent}% completed). Try pairing it with your morning routine.</span>
            </div>
          </div>

          <div className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-900/60 border border-slate-800">
            <BookOpen className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
            <div>
              <strong className="text-slate-200 block text-xs uppercase tracking-wide mb-0.5">Consistency Rockstar</strong>
              <span>Consistency rockstar: "{highestHabit.title}" has an impressive {highestHabit.percent}% completion score over the last 30 days!</span>
            </div>
          </div>
        </div>
      </div>

      {/* Annual Activity Heatmap */}
      <div className="bg-[#13192b] border border-slate-800/80 rounded-2xl p-5 shadow-md flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="font-display font-bold text-base text-slate-100">
              Annual Activity Heatmap
            </h3>
            <p className="text-xs text-slate-400">
              365-day consistency map across syllabus and daily habits
            </p>
          </div>

          <div className="flex items-center gap-1 bg-slate-900/80 border border-slate-800 rounded-xl p-1">
            {(['Overall', 'Medicine', 'Ortho', 'Habits'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setHeatmapTab(tab)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                  heatmapTab === tab
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* 52-week grid */}
        <div className="overflow-x-auto pb-2">
          <div className="inline-flex gap-1 min-w-[720px]">
            {heatmapWeeks.map((week, wIdx) => (
              <div key={wIdx} className="flex flex-col gap-1">
                {week.map(day => {
                  let colorClass = 'bg-slate-800/50';
                  if (day.intensity === 1) colorClass = 'bg-emerald-950 border border-emerald-800/60';
                  if (day.intensity === 2) colorClass = 'bg-emerald-800';
                  if (day.intensity === 3) colorClass = 'bg-emerald-600';
                  if (day.intensity === 4) colorClass = 'bg-emerald-400 shadow-sm shadow-emerald-500/30';

                  return (
                    <div
                      key={day.dateStr}
                      title={`${day.dateStr}: ${day.count} items completed`}
                      className={`w-3 h-3 rounded-sm transition-all hover:scale-125 cursor-pointer ${colorClass}`}
                    />
                  );
                })}
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-800/60">
          <span>52 Weeks</span>
          <div className="flex items-center gap-1.5">
            <span>Less</span>
            <div className="w-2.5 h-2.5 rounded-sm bg-slate-800/50" />
            <div className="w-2.5 h-2.5 rounded-sm bg-emerald-950 border border-emerald-800/60" />
            <div className="w-2.5 h-2.5 rounded-sm bg-emerald-800" />
            <div className="w-2.5 h-2.5 rounded-sm bg-emerald-600" />
            <div className="w-2.5 h-2.5 rounded-sm bg-emerald-400" />
            <span>More</span>
          </div>
        </div>
      </div>

      {/* Completion Trend & 7-Day Moving Average */}
      <div className="bg-[#13192b] border border-slate-800/80 rounded-2xl p-5 shadow-md flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="font-display font-bold text-base text-slate-100">
              Completion Trend & 7-Day Moving Average
            </h3>
            <p className="text-xs text-slate-400">
              Trajectory of daily completions smoothed with 7-day average
            </p>
          </div>

          <div className="flex items-center gap-1 bg-slate-900/80 border border-slate-800 rounded-xl p-1">
            {(['7D', '30D', '90D', 'All'] as const).map(range => (
              <button
                key={range}
                onClick={() => setTrendRange(range)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                  trendRange === range
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {range}
              </button>
            ))}
          </div>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="trendGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="displayDate" stroke="#64748b" tick={{ fontSize: 11 }} />
              <YAxis stroke="#64748b" tick={{ fontSize: 11 }} domain={[0, 100]} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0f172a',
                  borderColor: '#334155',
                  borderRadius: '0.75rem',
                  color: '#f8fafc',
                }}
              />
              <Area
                type="monotone"
                dataKey="completion"
                name="Daily %"
                stroke="#818cf8"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#trendGradient)"
              />
              <Area
                type="monotone"
                dataKey="movingAvg"
                name="7-Day Avg %"
                stroke="#10b981"
                strokeWidth={2}
                fill="none"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Subject Progress Rings & Habit Performance */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Subject Progress Rings */}
        <div className="bg-[#13192b] border border-slate-800/80 rounded-2xl p-5 shadow-md flex flex-col justify-between gap-4">
          <div>
            <h3 className="font-display font-bold text-base text-slate-100">
              Syllabus Completion
            </h3>
            <p className="text-xs text-slate-400">
              Subject level progress against standard curriculum
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 my-auto">
            {/* Medicine */}
            <div className="flex flex-col items-center text-center p-3 rounded-xl bg-slate-900/60 border border-slate-800">
              <div className="relative w-20 h-20 mb-2">
                <svg className="w-full h-full transform -rotate-90">
                  <circle cx="40" cy="40" r="32" stroke="#1e293b" strokeWidth="6" fill="none" />
                  <circle
                    cx="40"
                    cy="40"
                    r="32"
                    stroke="#f43f5e"
                    strokeWidth="6"
                    fill="none"
                    strokeDasharray={201}
                    strokeDashoffset={201 - (medPercentDone / 100) * 201}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center font-display font-bold text-lg text-slate-100">
                  {medPercentDone}%
                </div>
              </div>
              <span className="text-xs font-bold text-rose-400 uppercase tracking-wide">Medicine</span>
              <span className="text-[11px] text-slate-400 mt-0.5">
                {totalMedTopics - completedMedIds.size} topics left
              </span>
            </div>

            {/* Orthopaedics */}
            <div className="flex flex-col items-center text-center p-3 rounded-xl bg-slate-900/60 border border-slate-800">
              <div className="relative w-20 h-20 mb-2">
                <svg className="w-full h-full transform -rotate-90">
                  <circle cx="40" cy="40" r="32" stroke="#1e293b" strokeWidth="6" fill="none" />
                  <circle
                    cx="40"
                    cy="40"
                    r="32"
                    stroke="#06b6d4"
                    strokeWidth="6"
                    fill="none"
                    strokeDasharray={201}
                    strokeDashoffset={201 - (orthoPercentDone / 100) * 201}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center font-display font-bold text-lg text-slate-100">
                  {orthoPercentDone}%
                </div>
              </div>
              <span className="text-xs font-bold text-cyan-400 uppercase tracking-wide">Orthopaedics</span>
              <span className="text-[11px] text-slate-400 mt-0.5">
                {totalOrthoTopics - completedOrthoIds.size} topics left
              </span>
            </div>
          </div>
        </div>

        {/* Habit Performance (30 Days) */}
        <div className="bg-[#13192b] border border-slate-800/80 rounded-2xl p-5 shadow-md flex flex-col gap-3">
          <div>
            <h3 className="font-display font-bold text-base text-slate-100">
              Habit Performance & Skipped Analysis
            </h3>
            <p className="text-xs text-slate-400">
              Completion rates over the past 30 days (sorted by friction)
            </p>
          </div>

          <div className="flex flex-col gap-2 overflow-y-auto max-h-56 pr-1">
            {habitPerformance.map((habit, index) => {
              const isLowest = index === 0;
              return (
                <div key={habit.id} className="flex flex-col gap-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium text-slate-300">{habit.title}</span>
                    <span className={`font-bold ${isLowest ? 'text-amber-400' : 'text-emerald-400'}`}>
                      {habit.percent}%
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${
                        isLowest ? 'bg-amber-500' : 'bg-emerald-500'
                      }`}
                      style={{ width: `${habit.percent}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Balance Radar & Day of Week Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Radar Chart */}
        <div className="bg-[#13192b] border border-slate-800/80 rounded-2xl p-5 shadow-md flex flex-col gap-3">
          <div>
            <h3 className="font-display font-bold text-base text-slate-100">
              Study & Habit Domain Balance
            </h3>
            <p className="text-xs text-slate-400">
              Multi-dimensional balance across medicine, ortho, habits, pace and consistency
            </p>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radarData}>
                <PolarGrid stroke="#334155" />
                <PolarAngleAxis dataKey="subject" stroke="#94a3b8" tick={{ fontSize: 11 }} />
                <PolarRadiusAxis stroke="#475569" domain={[0, 100]} />
                <Radar name="Balance" dataKey="score" stroke="#818cf8" fill="#6366f1" fillOpacity={0.4} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Day of Week Analysis */}
        <div className="bg-[#13192b] border border-slate-800/80 rounded-2xl p-5 shadow-md flex flex-col gap-3">
          <div>
            <h3 className="font-display font-bold text-base text-slate-100">
              Day of Week Consistency
            </h3>
            <p className="text-xs text-slate-400">
              Average task completion rate per day of the week
            </p>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dayOfWeekStats} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="day" stroke="#64748b" tick={{ fontSize: 11 }} />
                <YAxis stroke="#64748b" tick={{ fontSize: 11 }} domain={[0, 100]} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderColor: '#334155',
                    borderRadius: '0.75rem',
                    color: '#f8fafc',
                  }}
                />
                <Bar dataKey="avg" name="Avg %" radius={[6, 6, 0, 0]}>
                  {dayOfWeekStats.map((entry) => {
                    const isMax = entry.day === highestDay.day;
                    const isMin = entry.day === lowestDay.day;
                    return (
                      <Cell
                        key={`cell-${entry.day}`}
                        fill={isMax ? '#10b981' : isMin ? '#f59e0b' : '#6366f1'}
                      />
                    );
                  })}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Weekly Progress Comparison */}
      <div className="bg-[#13192b] border border-slate-800/80 rounded-2xl p-5 shadow-md flex flex-col gap-3">
        <div>
          <h3 className="font-display font-bold text-base text-slate-100">
            Weekly Progress Comparison (Past 8 Weeks)
          </h3>
          <p className="text-xs text-slate-400">
            Consecutive week-by-week average completion performance
          </p>
        </div>

        <div className="h-56 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={weeklyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="week" stroke="#64748b" tick={{ fontSize: 11 }} />
              <YAxis stroke="#64748b" tick={{ fontSize: 11 }} domain={[0, 100]} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0f172a',
                  borderColor: '#334155',
                  borderRadius: '0.75rem',
                  color: '#f8fafc',
                }}
              />
              <Bar dataKey="completion" name="Weekly Avg %" fill="#3b82f6" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
