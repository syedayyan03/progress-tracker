import React, { useState, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { formatDateDisplay, getSyllabusDay, getYMD } from '../../utils/dateUtils';
import { 
  Calendar, 
  Palette, 
  ListOrdered, 
  Database, 
  Download, 
  Upload, 
  Sparkles, 
  RotateCcw, 
  ArrowUp, 
  ArrowDown, 
  Trash2, 
  Plus, 
  Check, 
  Edit2 
} from 'lucide-react';
import type { ThemeMode } from '../../types';

export const SettingsView: React.FC = () => {
  const { 
    state, 
    updateStartDate, 
    setTheme, 
    addItem, 
    updateItemTitle, 
    moveItem, 
    deleteItem, 
    exportData, 
    importData, 
    openModal 
  } = useApp();

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Settings active checklist tab
  const [activeTab, setActiveTab] = useState<'medicine' | 'ortho' | 'habits'>('medicine');

  // Add Item form state
  const [newTitle, setNewTitle] = useState('');
  const [newDay, setNewDay] = useState<number>(1);

  // Editing Item state
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState('');

  const todayStr = getYMD();
  const currentSyllabusDay = getSyllabusDay(state.settings.startDate, todayStr);

  const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value) {
      updateStartDate(e.target.value);
    }
  };

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    if (activeTab === 'habits') {
      addItem('habits', { title: newTitle.trim() });
    } else {
      addItem(activeTab, { title: newTitle.trim(), day: Number(newDay) || 1 });
    }
    setNewTitle('');
  };

  const startEditing = (id: string, title: string) => {
    setEditingId(id);
    setEditingTitle(title);
  };

  const saveEditing = (id: string) => {
    if (editingTitle.trim()) {
      updateItemTitle(activeTab, id, editingTitle.trim());
    }
    setEditingId(null);
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

  const listItems = state.lists[activeTab] as any[];

  return (
    <div className="flex flex-col gap-6 max-w-4xl mx-auto pb-16">
      {/* Header */}
      <div>
        <h2 className="font-display font-extrabold text-2xl text-slate-100">
          Settings & Configuration
        </h2>
        <p className="text-sm text-slate-400 font-medium">
          Customize your study schedule, syllabus items, appearance, and backups
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
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all ${
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

      {/* 3. Manage Checklist Items */}
      <div className="bg-[#13192b] border border-slate-800/80 rounded-2xl p-5 shadow-sm flex flex-col gap-4">
        <div className="flex items-center gap-2.5 pb-2 border-b border-slate-800">
          <ListOrdered className="w-5 h-5 text-indigo-400" />
          <h3 className="font-display font-bold text-base text-slate-100">
            Manage Checklist Items
          </h3>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
          <button
            onClick={() => setActiveTab('medicine')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'medicine'
                ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Medicine ({state.lists.medicine.length})
          </button>

          <button
            onClick={() => setActiveTab('ortho')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'ortho'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Ortho ({state.lists.ortho.length})
          </button>

          <button
            onClick={() => setActiveTab('habits')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'habits'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Habits ({state.lists.habits.length})
          </button>
        </div>

        {/* Add Item Form */}
        <form onSubmit={handleAddItem} className="flex flex-col sm:flex-row items-center gap-2">
          {activeTab !== 'habits' && (
            <div className="w-full sm:w-28 shrink-0">
              <input
                type="number"
                min="1"
                max="365"
                value={newDay}
                onChange={e => setNewDay(parseInt(e.target.value) || 1)}
                placeholder="Day"
                title="Syllabus Day"
                className="w-full px-3 py-2 rounded-xl bg-[#0b0f19] border border-slate-800 text-slate-100 text-sm focus:outline-none focus:border-indigo-500 font-medium"
              />
            </div>
          )}

          <input
            type="text"
            value={newTitle}
            onChange={e => setNewTitle(e.target.value)}
            placeholder={`Add new ${activeTab} item...`}
            className="w-full px-3.5 py-2 rounded-xl bg-[#0b0f19] border border-slate-800 text-slate-100 text-sm focus:outline-none focus:border-indigo-500"
          />

          <button
            type="submit"
            className="w-full sm:w-auto px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm transition-all shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Add</span>
          </button>
        </form>

        {/* List of Items */}
        <div className="flex flex-col gap-2 max-h-96 overflow-y-auto pr-1">
          {listItems.map((item, idx) => {
            const isEditing = editingId === item.id;
            return (
              <div
                key={item.id}
                className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900/60 border border-slate-800/80 hover:border-slate-700 transition-colors"
              >
                <div className="flex items-center gap-3 flex-1 min-w-0 mr-2">
                  {item.day !== undefined ? (
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-slate-800 text-indigo-400 shrink-0">
                      Day {item.day}
                    </span>
                  ) : (
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-slate-800 text-emerald-400 shrink-0">
                      #{idx + 1}
                    </span>
                  )}

                  {isEditing ? (
                    <div className="flex items-center gap-1.5 flex-1">
                      <input
                        type="text"
                        aria-label="Edit item title"
                        value={editingTitle}
                        onChange={e => setEditingTitle(e.target.value)}
                        className="flex-1 px-2.5 py-1 rounded-lg bg-[#0b0f19] border border-indigo-500 text-sm text-slate-100 focus:outline-none"
                        autoFocus
                        onKeyDown={e => {
                          if (e.key === 'Enter') saveEditing(item.id);
                          if (e.key === 'Escape') setEditingId(null);
                        }}
                      />
                      <button
                        onClick={() => saveEditing(item.id)}
                        className="p-1 text-emerald-400 hover:text-emerald-300"
                        title="Save title"
                        aria-label="Save title"
                      >
                        <Check className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <span
                      onClick={() => startEditing(item.id, item.title)}
                      className="text-sm font-medium text-slate-200 truncate cursor-pointer hover:text-indigo-300 flex items-center gap-2 group"
                      title="Click to rename"
                    >
                      <span>{item.title}</span>
                      <Edit2 className="w-3 h-3 text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </span>
                  )}
                </div>

                {/* Actions: Move up, Move down, Delete */}
                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={() => moveItem(activeTab, idx, 'up')}
                    disabled={idx === 0}
                    title="Move up"
                    aria-label="Move up"
                    className="p-1 rounded text-slate-400 hover:text-white disabled:opacity-30 disabled:hover:text-slate-400 transition-colors"
                  >
                    <ArrowUp className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => moveItem(activeTab, idx, 'down')}
                    disabled={idx === listItems.length - 1}
                    title="Move down"
                    aria-label="Move down"
                    className="p-1 rounded text-slate-400 hover:text-white disabled:opacity-30 disabled:hover:text-slate-400 transition-colors"
                  >
                    <ArrowDown className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => deleteItem(activeTab, item.id)}
                    title="Delete item"
                    aria-label="Delete item"
                    className="p-1 rounded text-slate-400 hover:text-rose-400 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. Data Tools & Backups */}
      <div className="bg-[#13192b] border border-slate-800/80 rounded-2xl p-5 shadow-sm flex flex-col gap-4">
        <div className="flex items-center gap-2.5 pb-2 border-b border-slate-800">
          <Database className="w-5 h-5 text-indigo-400" />
          <h3 className="font-display font-bold text-base text-slate-100">
            Data Tools & Backups
          </h3>
        </div>

        <p className="text-xs text-slate-400">
          Your data lives completely on your device. Export backups regularly or load sample data to explore analytics.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Export JSON */}
          <button
            onClick={exportData}
            className="flex items-center justify-center gap-2 p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 text-slate-200 text-xs font-bold transition-all shadow-sm"
          >
            <Download className="w-4 h-4 text-indigo-400" />
            <span>Export Backup (JSON)</span>
          </button>

          {/* Import JSON */}
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center justify-center gap-2 p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 text-slate-200 text-xs font-bold transition-all shadow-sm"
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
            className="flex items-center justify-center gap-2 p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 text-indigo-300 text-xs font-bold transition-all shadow-sm"
          >
            <Sparkles className="w-4 h-4 text-indigo-400" />
            <span>Load Sample Data (Preview)</span>
          </button>

          {/* Reset All Data */}
          <button
            onClick={() => openModal({ type: 'resetData' })}
            className="flex items-center justify-center gap-2 p-3.5 rounded-xl bg-rose-950/20 border border-rose-900/40 hover:border-rose-700/60 text-rose-300 text-xs font-bold transition-all shadow-sm"
          >
            <RotateCcw className="w-4 h-4 text-rose-400" />
            <span>Reset All Data</span>
          </button>
        </div>
      </div>
    </div>
  );
};
