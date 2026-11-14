import React, { useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { formatDateDisplay, getSyllabusDay, getYMD } from '../../utils/dateUtils';
import { 
  Calendar, 
  Palette, 
  Database, 
  Download, 
  Upload, 
  Sparkles, 
  Bell, 
  BellRing, 
  Clock, 
  AlertTriangle, 
  Trash2, 
  ShieldAlert, 
  CheckCircle2, 
  AlertCircle
} from 'lucide-react';
import type { ThemeMode } from '../../types';

export const SettingsView: React.FC = () => {
  const { 
    state, 
    updateStartDate, 
    updateNotificationSettings, 
    requestNotificationPermission, 
    sendTestNotification, 
    setTheme, 
    exportData, 
    importData, 
    openModal 
  } = useApp();

  const fileInputRef = useRef<HTMLInputElement>(null);

  const todayStr = getYMD();
  const currentSyllabusDay = getSyllabusDay(state.settings.startDate, todayStr);

  const notifications = state.settings.notifications || {
    enabled: false,
    time: '21:00',
  };

  const hasNotificationSupport = typeof window !== 'undefined' && 'Notification' in window;
  const currentPermission = hasNotificationSupport ? Notification.permission : 'unsupported';

  const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value) {
      updateStartDate(e.target.value);
    }
  };

  const handleToggleNotifications = async () => {
    if (!notifications.enabled) {
      const granted = await requestNotificationPermission();
      if (!granted && currentPermission === 'denied') {
        // Can't grant if denied in browser
        return;
      }
    } else {
      updateNotificationSettings({ enabled: false });
    }
  };

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateNotificationSettings({ time: e.target.value });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = event => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        importData(parsed);
      } catch (err) {
        console.error(err);
      }
    };
    reader.readAsText(file);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="flex flex-col gap-5 max-w-4xl mx-auto pb-20 animate-in fade-in duration-300">
      {/* Page Header */}
      <div>
        <h2 className="font-display font-extrabold text-xl sm:text-2xl text-slate-100 tracking-tight">
          Settings & Configuration
        </h2>
        <p className="text-xs sm:text-sm text-slate-400 font-medium mt-0.5">
          Customize curriculum start date, appearance, backups, daily reminders, and data storage
        </p>
      </div>

      {/* Responsive Grid with Golden Card Proportions (2-column on tablet & desktop) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5 items-start">
        {/* 1. Study Start Date Mapping Card */}
        <div className="bg-[#13192b] border border-slate-800/80 rounded-2xl p-4 sm:p-5 shadow-sm flex flex-col justify-between gap-3 min-h-[175px]">
          <div>
            <div className="flex items-center gap-2 pb-2.5 border-b border-slate-800/80">
              <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 shrink-0">
                <Calendar className="w-4 h-4" />
              </div>
              <h3 className="font-display font-bold text-sm sm:text-base text-slate-100">
                Study Start Date Mapping
              </h3>
            </div>

            <div className="pt-2.5">
              <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1">
                Curriculum Start Date
              </label>
              <p className="text-xs text-slate-400 leading-relaxed">
                Current mapping: <span className="text-slate-200 font-medium">{formatDateDisplay(state.settings.startDate)}</span> · Today corresponds to{' '}
                <strong className="text-indigo-400">Day {currentSyllabusDay}</strong> of your syllabus.
              </p>
            </div>
          </div>

          <div className="pt-1">
            <input
              type="date"
              value={state.settings.startDate}
              onChange={handleStartDateChange}
              className="w-full sm:w-auto min-w-[170px] max-w-[220px] px-3 py-1.5 rounded-xl bg-[#0b0f19] border border-slate-800 text-slate-100 text-xs sm:text-sm focus:outline-none focus:border-indigo-500 font-medium shadow-inner"
            />
          </div>
        </div>

        {/* 2. Appearance & Theme Card */}
        <div className="bg-[#13192b] border border-slate-800/80 rounded-2xl p-4 sm:p-5 shadow-sm flex flex-col justify-between gap-3 min-h-[175px]">
          <div>
            <div className="flex items-center gap-2 pb-2.5 border-b border-slate-800/80">
              <div className="w-8 h-8 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 shrink-0">
                <Palette className="w-4 h-4" />
              </div>
              <h3 className="font-display font-bold text-sm sm:text-base text-slate-100">
                Appearance & Theme
              </h3>
            </div>

            <div className="pt-2.5">
              <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1">
                Display Theme
              </label>
              <p className="text-xs text-slate-400 leading-relaxed">
                Choose your preferred visual mode or sync with system preferences. You can also toggle via the header.
              </p>
            </div>
          </div>

          <div className="pt-1">
            <div className="inline-flex items-center gap-1 bg-[#0b0f19] border border-slate-800/90 rounded-xl p-1 shadow-inner">
              {(['system', 'dark', 'light'] as ThemeMode[]).map(mode => (
                <button
                  key={mode}
                  onClick={() => setTheme(mode)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all cursor-pointer ${
                    state.settings.theme === mode
                      ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/30'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {mode}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 3. Daily Notification Details Card */}
        <div className="bg-[#13192b] border border-slate-800/80 rounded-2xl p-4 sm:p-5 shadow-sm flex flex-col gap-3.5">
          <div className="flex items-center justify-between pb-2.5 border-b border-slate-800/80 gap-2">
            <div className="flex items-center gap-2 min-w-0">
              <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 shrink-0">
                <BellRing className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <h3 className="font-display font-bold text-sm sm:text-base text-slate-100 truncate">
                  Daily Study Reminder
                </h3>
              </div>
            </div>

            {/* Permission Status Pill */}
            <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-900 border border-slate-800 shrink-0">
              {currentPermission === 'granted' ? (
                <>
                  <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                  <span className="text-emerald-400">Allowed</span>
                </>
              ) : currentPermission === 'denied' ? (
                <>
                  <AlertCircle className="w-3 h-3 text-rose-400" />
                  <span className="text-rose-400">Blocked</span>
                </>
              ) : (
                <>
                  <Clock className="w-3 h-3 text-amber-400" />
                  <span className="text-amber-400">Not Set</span>
                </>
              )}
            </div>
          </div>

          <p className="text-xs text-slate-400 leading-relaxed">
            Automated alerts when zero reading or study topics are logged for the day.
          </p>

          {/* Toggle & Time Picker Controls in Compact Stack */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {/* Enable / Disable Switch */}
            <div className="flex items-center justify-between p-2.5 sm:p-3 rounded-xl bg-slate-900/60 border border-slate-800/80">
              <div className="flex flex-col min-w-0 mr-2">
                <span className="text-xs font-bold text-slate-200">
                  Enable Daily Reminder
                </span>
                <span className="text-[10px] text-slate-400">
                  Alerts if zero study logged
                </span>
              </div>

              <button
                type="button"
                role="switch"
                aria-checked={notifications.enabled}
                onClick={handleToggleNotifications}
                className={`relative inline-flex h-5 w-10 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  notifications.enabled ? 'bg-indigo-600' : 'bg-slate-700'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    notifications.enabled ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* Time Picker */}
            <div className="flex items-center justify-between p-2.5 sm:p-3 rounded-xl bg-slate-900/60 border border-slate-800/80">
              <div className="flex flex-col min-w-0 mr-2">
                <span className="text-xs font-bold text-slate-200">
                  Reminder Time
                </span>
                <span className="text-[10px] text-slate-400">
                  Daily check time
                </span>
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                <Clock className="w-3.5 h-3.5 text-indigo-400" />
                <input
                  type="time"
                  value={notifications.time}
                  onChange={handleTimeChange}
                  className="px-2 py-1 rounded-lg bg-[#0b0f19] border border-slate-800 text-slate-100 text-xs font-semibold focus:outline-none focus:border-indigo-500 cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* Explanation & Test Alert */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-2.5 rounded-xl bg-indigo-950/20 border border-indigo-900/30 text-[11px] text-slate-300">
            <div className="flex items-start gap-2">
              <Bell className="w-3.5 h-3.5 text-indigo-400 shrink-0 mt-0.5" />
              <p className="leading-snug">
                Alert triggers at <strong className="text-indigo-300">{notifications.time}</strong> only if no topics are logged.
              </p>
            </div>

            {currentPermission === 'granted' && (
              <button
                type="button"
                onClick={sendTestNotification}
                className="self-end sm:self-auto px-2.5 py-1 rounded-lg bg-indigo-600/30 hover:bg-indigo-600/50 text-indigo-300 border border-indigo-500/30 font-semibold text-[10px] shrink-0 transition-all cursor-pointer"
              >
                Send Test Alert
              </button>
            )}
          </div>
        </div>

        {/* 4. Data Tools & Backups Card */}
        <div className="bg-[#13192b] border border-slate-800/80 rounded-2xl p-4 sm:p-5 shadow-sm flex flex-col justify-between gap-3.5">
          <div>
            <div className="flex items-center gap-2 pb-2.5 border-b border-slate-800/80">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
                <Database className="w-4 h-4" />
              </div>
              <h3 className="font-display font-bold text-sm sm:text-base text-slate-100">
                Data Tools & Backups
              </h3>
            </div>

            <p className="text-xs text-slate-400 pt-2 leading-relaxed">
              Your study records are cached in your browser. Export periodic JSON backups or preview sample data.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1">
            {/* Export JSON */}
            <button
              onClick={exportData}
              className="flex items-center justify-center gap-1.5 p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 text-slate-200 text-xs font-bold transition-all shadow-sm cursor-pointer hover:bg-slate-900"
            >
              <Download className="w-3.5 h-3.5 text-indigo-400" />
              <span>Export Backup (JSON)</span>
            </button>

            {/* Import JSON */}
            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center justify-center gap-1.5 p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 text-slate-200 text-xs font-bold transition-all shadow-sm cursor-pointer hover:bg-slate-900"
            >
              <Upload className="w-3.5 h-3.5 text-emerald-400" />
              <span>Import Backup (JSON)</span>
            </button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              accept=".json"
              className="hidden"
            />

            {/* Load Sample Data */}
            <button
              onClick={() => openModal({ type: 'sampleData' })}
              className="flex items-center justify-center gap-1.5 p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 text-indigo-300 text-xs font-bold transition-all shadow-sm cursor-pointer hover:bg-slate-900"
            >
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              <span>Load Sample Data (Preview)</span>
            </button>
          </div>
        </div>

        {/* 5. Danger Zone Card (Full width span across columns) */}
        <div className="md:col-span-2 bg-gradient-to-b from-[#1a111a] to-[#140d17] border border-rose-900/60 rounded-2xl p-4 sm:p-5 shadow-lg shadow-rose-950/20 flex flex-col gap-3">
          <div className="flex items-center gap-2 pb-2 border-b border-rose-900/50">
            <div className="w-8 h-8 rounded-lg bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400 shrink-0">
              <ShieldAlert className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-display font-bold text-sm sm:text-base text-rose-200">
                Danger Zone
              </h3>
              <p className="text-[10px] sm:text-xs text-rose-400/80">
                Irreversible actions that permanently delete your stored data
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 rounded-xl bg-rose-950/30 border border-rose-900/50">
            <div className="flex flex-col gap-0.5 max-w-xl">
              <span className="text-xs sm:text-sm font-bold text-rose-100 flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
                <span>Clear All Cache Data & Progress</span>
              </span>
              <p className="text-[11px] text-slate-300 leading-relaxed">
                Permanently erase all daily study logs, completed topics, habit streaks, custom subjects, and local in-browser SQLite3 cache tokens. A confirmation popup will prompt you before anything is cleared.
              </p>
            </div>

            <button
              type="button"
              onClick={() => openModal({ type: 'clearCache' })}
              className="px-3.5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 active:scale-95 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-md shadow-rose-600/30 transition-all shrink-0 cursor-pointer self-start sm:self-auto"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear All Cache Data</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
