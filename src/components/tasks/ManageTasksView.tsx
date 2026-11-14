import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { getSubjectTheme } from '../../utils/subjectColors';
import { 
  ListOrdered, 
  Plus, 
  Check, 
  Edit2, 
  ArrowUp, 
  ArrowDown, 
  Trash2, 
  BookPlus, 
  Sparkles,
  Layers,
  Search,
  BookOpen,
  X
} from 'lucide-react';

export const ManageTasksView: React.FC = () => {
  const { 
    state, 
    addItem, 
    updateItemTitle, 
    moveItem, 
    deleteItem, 
    openModal,
    getSubjectTopics
  } = useApp();

  const subjects = state.lists.subjects || [];

  // Active tab (defaults to first subject, or 'medicine', or 'habits')
  const [activeTab, setActiveTab] = useState<string>(() => subjects[0]?.id || 'medicine');

  // Search filter query
  const [searchQuery, setSearchQuery] = useState('');

  // Add Item form state
  const [newTitle, setNewTitle] = useState('');
  const [newDay, setNewDay] = useState<number>(1);

  // Inline editing state
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState('');

  // Current active subject config
  const activeSubject = subjects.find(s => s.id === activeTab);
  const activeSubjectTheme = activeSubject ? getSubjectTheme(activeSubject.color) : null;

  // Topics or habits for active tab
  const rawItems = useMemo(() => {
    return activeTab === 'habits' ? state.lists.habits : getSubjectTopics(activeTab);
  }, [activeTab, state.lists.habits, state.lists.topics, getSubjectTopics]);

  // Filtered by search
  const filteredItems = useMemo(() => {
    if (!searchQuery.trim()) return rawItems;
    const q = searchQuery.toLowerCase().trim();
    return rawItems.filter((item: any) => {
      const titleMatch = item.title?.toLowerCase().includes(q);
      const dayMatch = item.day !== undefined && String(item.day).includes(q);
      return titleMatch || dayMatch;
    });
  }, [rawItems, searchQuery]);

  // Suggested next day for adding new topic
  const maxDay = useMemo(() => {
    if (activeTab === 'habits') return 1;
    const topics = getSubjectTopics(activeTab);
    if (!topics || topics.length === 0) return 1;
    return Math.max(...topics.map(t => t.day || 1)) + 1;
  }, [activeTab, getSubjectTopics]);

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    if (activeTab === 'habits') {
      addItem('habits', { title: newTitle.trim() });
    } else {
      addItem(activeTab, { title: newTitle.trim(), day: Number(newDay) || maxDay });
    }
    setNewTitle('');
    setNewDay(maxDay + 1);
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

  const cancelEditing = () => {
    setEditingId(null);
    setEditingTitle('');
  };

  // Total statistics across all subjects
  const totalSubjectsCount = subjects.length;
  const totalTopicsCount = Object.values(state.lists.topics || {}).reduce((acc, list) => acc + (list?.length || 0), 0);
  const totalHabitsCount = state.lists.habits.length;

  return (
    <div className="flex flex-col gap-4 max-w-5xl mx-auto pb-20 animate-in fade-in duration-300">
      {/* 1. Sleek, Clean Hero Header Card */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#10172a] via-[#0d1424] to-[#09101d] border border-slate-800/90 p-4 sm:p-5 shadow-xl backdrop-blur-xl">
        <div className="absolute top-0 right-1/4 w-60 h-60 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-tr from-indigo-600 to-blue-600 flex items-center justify-center text-white shadow-md shadow-indigo-600/20 shrink-0">
              <ListOrdered className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-0.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-400">
                  Curriculum Engine
                </span>
                <span className="text-slate-600">•</span>
                <span className="text-[11px] text-slate-400 font-medium">Starts 15/11/2026 (0 UTC)</span>
              </div>
              <h2 className="font-display font-extrabold text-lg sm:text-xl text-slate-100 tracking-tight leading-tight">
                Manage Tasks & Curriculum
              </h2>
            </div>
          </div>

          {/* Quick Action: Add Subject */}
          <button
            type="button"
            onClick={() => openModal({ type: 'addSubject' })}
            className="self-start sm:self-auto px-3.5 py-1.5 sm:py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-indigo-600/25 transition-all cursor-pointer shrink-0"
          >
            <BookPlus className="w-3.5 h-3.5" />
            <span>+ Add Subject</span>
          </button>
        </div>

        {/* Clean Inline KPI Metrics (No bulky stacked cards!) */}
        <div className="flex items-center gap-2 sm:gap-4 pt-3 mt-3 border-t border-slate-800/80 text-xs text-slate-300 overflow-x-auto no-scrollbar">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-900/60 border border-slate-800/70 shrink-0">
            <Layers className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
            <span><strong className="text-slate-100">{totalSubjectsCount}</strong> Subjects</span>
          </div>
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-900/60 border border-slate-800/70 shrink-0">
            <BookOpen className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span><strong className="text-slate-100">{totalTopicsCount}</strong> Topics</span>
          </div>
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-900/60 border border-slate-800/70 shrink-0">
            <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span><strong className="text-slate-100">{totalHabitsCount}</strong> Habits</span>
          </div>
        </div>
      </div>

      {/* 2. Horizontal Subject Navigation Tabs */}
      <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto pb-1 no-scrollbar">
        {subjects.map(subj => {
          const count = getSubjectTopics(subj.id).length;
          const theme = getSubjectTheme(subj.color);
          const isActive = activeTab === subj.id;
          return (
            <button
              key={subj.id}
              onClick={() => {
                setActiveTab(subj.id);
                setSearchQuery('');
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 transition-all cursor-pointer flex items-center gap-1.5 ${
                isActive
                  ? `${theme.badge} ring-1 ring-white/20 shadow-sm`
                  : 'text-slate-400 hover:text-white bg-slate-900/60 border border-slate-800 hover:border-slate-700'
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${theme.badgeDot}`} />
              <span>{subj.name}</span>
              <span className="opacity-75 px-1.5 py-0.5 rounded-full bg-slate-950/40 text-[10px]">
                {count}
              </span>
            </button>
          );
        })}

        <button
          onClick={() => {
            setActiveTab('habits');
            setSearchQuery('');
          }}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 transition-all cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'habits'
              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 ring-1 ring-emerald-500/20 shadow-sm'
              : 'text-slate-400 hover:text-white bg-slate-900/60 border border-slate-800 hover:border-slate-700'
          }`}
        >
          <span className="w-2 h-2 rounded-full bg-emerald-400" />
          <span>Habits</span>
          <span className="opacity-75 px-1.5 py-0.5 rounded-full bg-slate-950/40 text-[10px]">
            {totalHabitsCount}
          </span>
        </button>
      </div>

      {/* 3. Main Subject Workspace Card */}
      <div className="bg-[#13192b] border border-slate-800/80 rounded-2xl p-4 sm:p-5 shadow-sm flex flex-col gap-4">
        {/* Subject Command Header Bar */}
        <div className="flex items-center justify-between gap-3 pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2.5 min-w-0">
            {activeTab === 'habits' ? (
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
                <Sparkles className="w-4 h-4" />
              </div>
            ) : (
              <div className={`w-8 h-8 sm:w-9 sm:h-9 rounded-xl ${activeSubjectTheme?.bgSubtle || 'bg-indigo-500/10'} border ${activeSubjectTheme?.cardBorder || 'border-indigo-500/20'} flex items-center justify-center ${activeSubjectTheme?.text || 'text-indigo-400'} shrink-0`}>
                <BookOpen className="w-4 h-4" />
              </div>
            )}
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="font-display font-bold text-base sm:text-lg text-slate-100 truncate">
                  {activeTab === 'habits' ? 'Daily Habits' : activeSubject?.name || 'Subject'}
                </h3>
                {activeTab !== 'habits' && (
                  <span className="text-[10px] font-semibold text-slate-400 px-2 py-0.5 rounded-md bg-slate-900 border border-slate-800 shrink-0">
                    {rawItems.length} Topics
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Delete Subject Button (Works for ANY subject!) */}
          {activeSubject && (
            <button
              type="button"
              aria-label="Delete Subject"
              onClick={() => openModal({ 
                type: 'deleteSubject', 
                id: activeSubject.id, 
                subjectName: activeSubject.name 
              })}
              className="px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-300 hover:text-rose-200 text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer shrink-0"
              title={`Permanently delete ${activeSubject.name}`}
            >
              <Trash2 className="w-3.5 h-3.5 text-rose-400" />
              <span>Delete Subject</span>
            </button>
          )}
        </div>

        {/* 4. Add New Topic / Item Form - Clean & Non-bloated */}
        <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800/80 flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <Plus className="w-3 h-3 text-indigo-400" />
              <span>{activeTab === 'habits' ? 'Add New Habit' : `Add Topic to ${activeSubject?.name || 'Syllabus'}`}</span>
            </span>
            {activeTab !== 'habits' && (
              <span className="text-[10px] text-slate-400">
                Next: <strong className="text-indigo-400">Day {maxDay}</strong>
              </span>
            )}
          </div>

          <form onSubmit={handleAddItem} className="flex items-center gap-2">
            {activeTab !== 'habits' && (
              <div className="w-20 sm:w-24 shrink-0 flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-[#0b0f19] border border-slate-800 text-slate-100 text-xs font-semibold">
                <span className="text-slate-400 text-[10px]">Day</span>
                <input
                  type="number"
                  min="1"
                  max="365"
                  value={newDay}
                  onChange={e => setNewDay(parseInt(e.target.value) || 1)}
                  className="w-full bg-transparent text-slate-100 focus:outline-none font-bold text-center"
                />
              </div>
            )}

            <input
              type="text"
              value={newTitle}
              onChange={e => setNewTitle(e.target.value)}
              placeholder={activeTab === 'habits' ? 'Add new habit item...' : `Add new ${activeSubject ? activeSubject.name : 'topic'} item...`}
              className="flex-1 min-w-0 px-3 py-1.5 rounded-xl bg-[#0b0f19] border border-slate-800 text-slate-100 text-xs sm:text-sm focus:outline-none focus:border-indigo-500 placeholder-slate-500"
            />

            <button
              type="submit"
              className="px-3.5 sm:px-4 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center justify-center gap-1 shadow-sm shrink-0 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add</span>
            </button>
          </form>
        </div>

        {/* 5. Live Search & Filter Bar */}
        <div className="flex items-center justify-between gap-3">
          <div className="relative w-full sm:max-w-xs">
            <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder={`Search ${activeTab === 'habits' ? 'habits' : activeSubject?.name || 'topics'}...`}
              className="w-full pl-8 pr-7 py-1.5 rounded-xl bg-slate-900/50 border border-slate-800 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>

          <span className="text-[11px] sm:text-xs text-slate-400 shrink-0 font-medium">
            Showing <strong className="text-slate-200">{filteredItems.length}</strong> of {rawItems.length}
          </span>
        </div>

        {/* 6. 2 Days Per Row Grid! (Matches Day 1 | Day 2 side by side) */}
        <div className="grid grid-cols-2 gap-2 sm:gap-2.5 max-h-[580px] overflow-y-auto pr-1">
          {filteredItems.length === 0 ? (
            <div className="col-span-2 p-8 text-center bg-slate-900/30 border border-dashed border-slate-800 rounded-xl text-slate-400 text-xs sm:text-sm flex flex-col items-center gap-2">
              <Sparkles className="w-6 h-6 text-slate-600" />
              <p className="font-semibold text-slate-300">
                {searchQuery ? `No tasks found matching "${searchQuery}"` : 'No tasks created yet for this subject'}
              </p>
              <p className="text-[11px] text-slate-500">
                {searchQuery ? 'Try clearing your search query above.' : 'Use the form above to add your first syllabus topic.'}
              </p>
            </div>
          ) : (
            filteredItems.map((item: any, idx: number) => {
              const isEditing = editingId === item.id;
              return (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-2.5 sm:p-3 rounded-xl bg-slate-900/60 border border-slate-800/80 hover:border-slate-700/80 hover:bg-slate-900/90 transition-all group shadow-sm min-h-[82px]"
                >
                  {/* Top Bar inside topic card: Day badge + actions */}
                  <div className="flex items-center justify-between gap-1 mb-1.5">
                    {item.day !== undefined ? (
                      <span className={`text-[10px] sm:text-[11px] font-bold px-2 py-0.5 rounded-md ${activeSubjectTheme?.bgSubtle || 'bg-indigo-950/70'} border ${activeSubjectTheme?.cardBorder || 'border-indigo-800/40'} ${activeSubjectTheme?.text || 'text-indigo-300'} shrink-0`}>
                        Day {item.day}
                      </span>
                    ) : (
                      <span className="text-[10px] sm:text-[11px] font-bold px-2 py-0.5 rounded-md bg-emerald-950/70 border border-emerald-800/40 text-emerald-300 shrink-0">
                        #{idx + 1}
                      </span>
                    )}

                    {/* Actions: Move Up, Move Down, Edit, Delete */}
                    <div className="flex items-center gap-0.5">
                      <button
                        type="button"
                        onClick={() => moveItem(activeTab, idx, 'up')}
                        disabled={idx === 0}
                        title="Move up"
                        aria-label="Move up"
                        className="p-1 rounded text-slate-500 hover:text-white disabled:opacity-20 disabled:hover:text-slate-500 transition-colors cursor-pointer"
                      >
                        <ArrowUp className="w-3 h-3" />
                      </button>
                      <button
                        type="button"
                        onClick={() => moveItem(activeTab, idx, 'down')}
                        disabled={idx === filteredItems.length - 1}
                        title="Move down"
                        aria-label="Move down"
                        className="p-1 rounded text-slate-500 hover:text-white disabled:opacity-20 disabled:hover:text-slate-500 transition-colors cursor-pointer"
                      >
                        <ArrowDown className="w-3 h-3" />
                      </button>
                      <button
                        type="button"
                        onClick={() => startEditing(item.id, item.title)}
                        title="Edit title"
                        aria-label="Edit title"
                        className="p-1 rounded text-slate-500 hover:text-indigo-300 transition-colors cursor-pointer"
                      >
                        <Edit2 className="w-3 h-3" />
                      </button>
                      <button
                        type="button"
                        onClick={() => deleteItem(activeTab, item.id)}
                        title="Delete item"
                        aria-label="Delete item"
                        className="p-1 rounded text-slate-500 hover:text-rose-400 transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>

                  {/* Title / Inline Edit */}
                  {isEditing ? (
                    <div className="flex items-center gap-1.5 mt-1">
                      <input
                        type="text"
                        aria-label="Edit item title"
                        value={editingTitle}
                        onChange={e => setEditingTitle(e.target.value)}
                        className="flex-1 min-w-0 px-2 py-1 rounded bg-[#0b0f19] border border-indigo-500 text-xs text-slate-100 focus:outline-none"
                        autoFocus
                        onKeyDown={e => {
                          if (e.key === 'Enter') saveEditing(item.id);
                          if (e.key === 'Escape') cancelEditing();
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => saveEditing(item.id)}
                        className="p-1 rounded bg-emerald-600/30 text-emerald-400 hover:bg-emerald-600/40"
                        title="Save title"
                        aria-label="Save title"
                      >
                        <Check className="w-3 h-3" />
                      </button>
                      <button
                        type="button"
                        onClick={cancelEditing}
                        className="p-1 rounded bg-slate-800 text-slate-400 hover:text-slate-200"
                        title="Cancel"
                        aria-label="Cancel editing"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ) : (
                    <div
                      onClick={() => startEditing(item.id, item.title)}
                      className="text-xs sm:text-sm font-medium text-slate-200 line-clamp-2 cursor-pointer hover:text-indigo-300 leading-snug"
                      title="Click to rename"
                    >
                      {item.title}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
