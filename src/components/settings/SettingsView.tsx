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
    <div className="flex flex-col gap-6 max-w-4xl mx-auto pb-16">
      {/* Header */}
      <div>
        <h2 className="font-display font-extrabold text-2xl text-slate-100">
          Settings & Configuration
        </h2>
        <p className="text-sm text-slate-400 font-medium">
          Customize curriculum start date, appearance, backups, daily reminders, and data storage
        </p>
      </div>

      {/* 1. Study Start Date Mapping */}
      <div className="bg-[#13192b] border border-slate-800/80 rounded-2xl p-5 shadow-sm flex flex-col gap-3">
        <div className="flex items-center gap-2.5 pb-2 border-b border-slate-800">
          <Calendar className="w-5 h-5 text-indigo-400" />
          <h3 className="font-display font-bold text-base text-slate-100">
            Study Start Date Mapping
          </h3>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
              Curriculum Start Date
            </label>
            <p className="text-xs text-slate-400 max-w-md">
              Current mapping: {formatDateDisplay(state.settings.startDate)} · Today corresponds to{' '}
              <strong className="text-indigo-400">Day {currentSyllabusDay}</strong> of your syllabus.
            </p>
          </div>

          <input
            type="date"
            value={state.settings.startDate}
            onChange={handleStartDateChange}
            className="px-3.5 py-2 rounded-xl bg-[#0b0f19] border border-slate-800 text-slate-100 text-sm focus:outline-none focus:border-indigo-500 font-medium"
          />
        </div>
      </div>

      {/* 2. Appearance & Theme */}
      <div className="bg-[#13192b] border border-slate-800/80 rounded-2xl p-5 shadow-sm flex flex-col gap-3">
        <div className="flex items-center gap-2.5 pb-2 border-b border-slate-800">
          <Palette className="w-5 h-5 text-indigo-400" />
          <h3 className="font-display font-bold text-base text-slate-100">
            Appearance & Theme
          </h3>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <p className="text-xs text-slate-400 max-w-md">
            Choose your preferred color mode. You can also toggle quickly using the theme icon in the header.
          </p>

          <div className="flex items-center gap-1 bg-[#0b0f19] border border-slate-800 rounded-xl p-1">
            {(['system', 'dark', 'light'] as ThemeMode[]).map(mode => (
              <button
                key={mode}
                onClick={() => setTheme(mode)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all cursor-pointer ${
                  state.settings.theme === mode
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {mode}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 3. Data Tools & Backups */}
      <div className="bg-[#13192b] border border-slate-800/80 rounded-2xl p-5 shadow-sm flex flex-col gap-4">
        <div className="flex items-center gap-2.5 pb-2 border-b border-slate-800">
          <Database className="w-5 h-5 text-indigo-400" />
          <h3 className="font-display font-bold text-base text-slate-100">
            Data Tools & Backups
          </h3>
        </div>

        <p className="text-xs text-slate-400">
          Your data lives completely on your device using in-browser SQLite3 cache tokens. Export backups regularly or load sample data to explore analytics.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Export JSON */}
          <button
            onClick={exportData}
            className="flex items-center justify-center gap-2 p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 text-slate-200 text-xs font-bold transition-all shadow-sm cursor-pointer hover:bg-slate-900"
          >
            <Download className="w-4 h-4 text-indigo-400" />
            <span>Export Backup (JSON)</span>
          </button>

          {/* Import JSON */}
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center justify-center gap-2 p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 text-slate-200 text-xs font-bold transition-all shadow-sm cursor-pointer hover:bg-slate-900"
          >
            <Upload className="w-4 h-4 text-emerald-400" />
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
            className="flex items-center justify-center gap-2 p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 text-indigo-300 text-xs font-bold transition-all shadow-sm cursor-pointer hover:bg-slate-900"
          >
            <Sparkles className="w-4 h-4 text-indigo-400" />
            <span>Load Sample Data (Preview)</span>
          </button>
        </div>
      </div>

      {/* 4. Daily Notification Details */}
      <div className="bg-[#13192b] border border-slate-800/80 rounded-2xl p-5 shadow-sm flex flex-col gap-4">
        <div className="flex items-center justify-between pb-2 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <BellRing className="w-5 h-5 text-indigo-400" />
            <div>
              <h3 className="font-display font-bold text-base text-slate-100">
                Daily Study Reminder
              </h3>
              <p className="text-xs text-slate-400">
                Automated notification if you haven't logged any reading or study topics
              </p>
            </div>
          </div>

          {/* Permission Status Pill */}
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-slate-900/80 border border-slate-800">
            {currentPermission === 'granted' ? (
              <>
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400">Permission Allowed</span>
              </>
            ) : currentPermission === 'denied' ? (
              <>
                <AlertCircle className="w-3.5 h-3.5 text-rose-400" />
                <span className="text-rose-400">Permission Blocked</span>
              </>
            ) : (
              <>
                <Clock className="w-3.5 h-3.5 text-amber-400" />
                <span className="text-amber-400">Permission Not Set</span>
              </>
            )}
          </div>
        </div>

        {/* Toggle & Time Picker Controls */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
          {/* Enable / Disable Switch */}
          <div className="flex items-center justify-between p-4 rounded-xl bg-slate-900/60 border border-slate-800/80">
            <div className="flex flex-col gap-0.5">
              <span className="text-sm font-bold text-slate-200">
                Enable Daily Reminder
              </span>
              <span className="text-xs text-slate-400">
                Alerts you if zero reading is logged
              </span>
            </div>

            <button
              type="button"
              role="switch"
              aria-checked={notifications.enabled}
              onClick={handleToggleNotifications}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                notifications.enabled ? 'bg-indigo-600' : 'bg-slate-700'
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                  notifications.enabled ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Time Picker */}
          <div className="flex items-center justify-between p-4 rounded-xl bg-slate-900/60 border border-slate-800/80">
            <div className="flex flex-col gap-0.5">
              <span className="text-sm font-bold text-slate-200">
                Reminder Time
              </span>
              <span className="text-xs text-slate-400">
                Daily check & alert time
              </span>
            </div>

            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-indigo-400" />
              <input
                type="time"
                value={notifications.time}
                onChange={handleTimeChange}
                className="px-3 py-1.5 rounded-lg bg-[#0b0f19] border border-slate-800 text-slate-100 text-sm font-semibold focus:outline-none focus:border-indigo-500 cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Informational Explanation & Test Button */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-xl bg-indigo-950/20 border border-indigo-900/30 text-xs text-slate-300">
          <div className="flex items-start gap-2.5">
            <Bell className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              When enabled, a native browser alert triggers at <strong className="text-indigo-300">{notifications.time}</strong> only if you have <strong>not checked off any study topics</strong> for the day. If you already studied, no notification is sent.
            </p>
          </div>

          {currentPermission === 'granted' && (
            <button
              type="button"
              onClick={sendTestNotification}
              className="px-3 py-1.5 rounded-lg bg-indigo-600/30 hover:bg-indigo-600/50 text-indigo-300 border border-indigo-500/30 font-semibold text-xs shrink-0 transition-all cursor-pointer"
            >
              Send Test Alert
            </button>
          )}
        </div>
      </div>

      {/* 5. Danger Zone (At the very bottom) */}
      <div className="bg-gradient-to-b from-[#1a111a] to-[#140d17] border border-rose-900/60 rounded-2xl p-5 shadow-lg shadow-rose-950/20 flex flex-col gap-4 mt-2">
        <div className="flex items-center gap-2.5 pb-2 border-b border-rose-900/50">
          <ShieldAlert className="w-5 h-5 text-rose-400 shrink-0" />
          <div>
            <h3 className="font-display font-bold text-base text-rose-200">
              Danger Zone
            </h3>
            <p className="text-xs text-rose-400/80">
              Irreversible actions that permanently delete your stored data
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-rose-950/30 border border-rose-900/50">
          <div className="flex flex-col gap-1 max-w-xl">
            <span className="text-sm font-bold text-rose-100 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-400" />
              <span>Clear All Cache Data & Progress</span>
            </span>
            <p className="text-xs text-slate-300 leading-relaxed">
              Permanently erase all daily study logs, completed topics, habit streaks, custom subjects, and local in-browser SQLite3 cache tokens. A confirmation popup will prompt you before anything is cleared.
            </p>
          </div>

          <button
            type="button"
            onClick={() => openModal({ type: 'clearCache' })}
            className="px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 active:scale-95 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-lg shadow-rose-600/30 transition-all shrink-0 cursor-pointer"
          >
            <Trash2 className="w-4 h-4" />
            <span>Clear All Cache Data</span>
          </button>
        </div>
      </div>
    </div>
  );
};
