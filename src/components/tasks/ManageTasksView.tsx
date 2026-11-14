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
  Calendar,
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
    <div className="flex flex-col gap-6 max-w-5xl mx-auto pb-16 animate-in fade-in duration-300">
      {/* 1. Executive Top Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#10172a] via-[#0d1424] to-[#09101d] border border-slate-800/90 p-5 sm:p-7 shadow-2xl backdrop-blur-xl">
        <div className="absolute top-0 right-1/4 w-80 h-80 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-blue-500 flex items-center justify-center text-white shadow-xl shadow-indigo-600/30 shrink-0">
              <ListOrdered className="w-7 h-7 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  Curriculum Engine
                </span>
                <span className="text-xs text-slate-500">•</span>
                <span className="text-xs text-slate-400 font-medium">Starts 15/11/2026 (0 UTC)</span>
              </div>
              <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-slate-100 tracking-tight">
                Manage Tasks & Curriculum
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 font-medium mt-1 max-w-xl">
                Create clinical subjects, customize daily syllabus topics, reorder tasks, and track lifestyle habits.
              </p>
            </div>
          </div>

          {/* Quick Action: Add Subject */}
          <button
            type="button"
            onClick={() => openModal({ type: 'addSubject' })}
            className="self-start md:self-auto px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-indigo-600/30 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer shrink-0"
          >
            <BookPlus className="w-4 h-4" />
            <span>+ Add Subject</span>
          </button>
        </div>

        {/* KPI Mini Counter Bar */}
        <div className="grid grid-cols-3 gap-3 pt-5 mt-5 border-t border-slate-800/80 text-center sm:text-left">
          <div className="flex flex-col sm:flex-row items-center gap-2.5 p-2 rounded-xl bg-slate-900/40 border border-slate-800/50">
            <Layers className="w-4 h-4 text-indigo-400 shrink-0" />
            <div>
              <div className="text-xs text-slate-400">Total Subjects</div>
              <div className="text-base font-extrabold text-slate-100">{totalSubjectsCount}</div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-2.5 p-2 rounded-xl bg-slate-900/40 border border-slate-800/50">
            <BookOpen className="w-4 h-4 text-emerald-400 shrink-0" />
            <div>
              <div className="text-xs text-slate-400">Total Topics</div>
              <div className="text-base font-extrabold text-slate-100">{totalTopicsCount}</div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-2.5 p-2 rounded-xl bg-slate-900/40 border border-slate-800/50">
            <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
            <div>
              <div className="text-xs text-slate-400">Daily Habits</div>
              <div className="text-base font-extrabold text-slate-100">{totalHabitsCount}</div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Horizontal Subject Navigation Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin">
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
              className={`px-4 py-2 rounded-2xl text-xs font-bold shrink-0 transition-all cursor-pointer flex items-center gap-2 ${
                isActive
                  ? `${theme.badge} ring-2 ring-white/20 shadow-md scale-105`
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
          className={`px-4 py-2 rounded-2xl text-xs font-bold shrink-0 transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === 'habits'
              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 ring-2 ring-emerald-500/20 shadow-md scale-105'
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
      <div className="bg-[#13192b] border border-slate-800/80 rounded-2xl p-5 sm:p-6 shadow-sm flex flex-col gap-6">
        {/* Subject Command Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            {activeTab === 'habits' ? (
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                <Sparkles className="w-5 h-5" />
              </div>
            ) : (
              <div className={`w-10 h-10 rounded-xl ${activeSubjectTheme?.bgSubtle || 'bg-indigo-500/10'} border ${activeSubjectTheme?.cardBorder || 'border-indigo-500/20'} flex items-center justify-center ${activeSubjectTheme?.text || 'text-indigo-400'}`}>
                <BookOpen className="w-5 h-5" />
              </div>
            )}
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-display font-bold text-lg text-slate-100">
                  {activeTab === 'habits' ? 'Daily Habits' : activeSubject?.name || 'Subject'}
                </h3>
                {activeTab !== 'habits' && (
                  <span className="text-[11px] font-semibold text-slate-400 px-2 py-0.5 rounded-lg bg-slate-900 border border-slate-800">
                    {rawItems.length} Topics
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400">
                {activeTab === 'habits'
                  ? 'Daily routines tracked across every day of your curriculum'
                  : `Structured syllabus mapped from Day 1 onward for ${activeSubject?.name || 'this subject'}`}
              </p>
            </div>
          </div>

          {/* Delete Subject Button (Works for ANY subject!) */}
          {activeSubject && (
            <button
              type="button"
              onClick={() => openModal({ 
                type: 'deleteSubject', 
                id: activeSubject.id, 
                subjectName: activeSubject.name 
              })}
              className="self-end sm:self-auto px-3.5 py-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-300 hover:text-rose-200 text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
              title={`Permanently delete ${activeSubject.name}`}
            >
              <Trash2 className="w-3.5 h-3.5 text-rose-400" />
              <span>Delete Subject</span>
            </button>
          )}
        </div>

        {/* 4. Add New Topic / Item Form */}
        <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
              <Plus className="w-3.5 h-3.5 text-indigo-400" />
              <span>{activeTab === 'habits' ? 'Add New Habit' : `Add Topic to ${activeSubject?.name || 'Syllabus'}`}</span>
            </span>
            {activeTab !== 'habits' && (
              <span className="text-[11px] text-slate-400">
                Next suggested: <strong className="text-indigo-400">Day {maxDay}</strong>
              </span>
            )}
          </div>

          <form onSubmit={handleAddItem} className="flex flex-col sm:flex-row items-center gap-2.5">
            {activeTab !== 'habits' && (
              <div className="w-full sm:w-32 shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#0b0f19] border border-slate-800 text-slate-100 text-xs font-semibold">
                <Calendar className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                <span className="text-slate-400">Day</span>
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
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#0b0f19] border border-slate-800 text-slate-100 text-sm focus:outline-none focus:border-indigo-500 placeholder-slate-500"
            />

            <button
              type="submit"
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-md shadow-indigo-600/30 hover:scale-[1.02] active:scale-[0.98] transition-all shrink-0 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add</span>
            </button>
          </form>
        </div>

        {/* 5. Live Search & Filter Bar */}
        <div className="flex items-center justify-between gap-3 pt-1">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder={`Search topics in ${activeTab === 'habits' ? 'Habits' : activeSubject?.name || 'subject'}...`}
              className="w-full pl-9 pr-9 py-2 rounded-xl bg-slate-900/50 border border-slate-800 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <span className="text-xs text-slate-400 shrink-0 font-medium">
            Showing <strong className="text-slate-200">{filteredItems.length}</strong> of {rawItems.length}
          </span>
        </div>

        {/* 6. List of Items */}
        <div className="flex flex-col gap-2 max-h-[520px] overflow-y-auto pr-1">
          {filteredItems.length === 0 ? (
            <div className="p-10 text-center bg-slate-900/30 border border-dashed border-slate-800 rounded-2xl text-slate-400 text-sm flex flex-col items-center gap-3">
              <Sparkles className="w-8 h-8 text-slate-600" />
              <div>
                <p className="font-semibold text-slate-300">
                  {searchQuery ? `No tasks found matching "${searchQuery}"` : 'No tasks created yet for this subject'}
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  {searchQuery ? 'Try clearing your search query above.' : 'Use the form above to add your first syllabus topic.'}
                </p>
              </div>
            </div>
          ) : (
            filteredItems.map((item: any, idx: number) => {
              const isEditing = editingId === item.id;
              return (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-3 rounded-xl bg-slate-900/50 border border-slate-800/80 hover:border-slate-700/80 hover:bg-slate-900/80 transition-all group shadow-sm"
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0 mr-3">
                    {/* Day Pill */}
                    {item.day !== undefined ? (
                      <span className={`text-[11px] font-bold px-2.5 py-1 rounded-lg ${activeSubjectTheme?.bgSubtle || 'bg-indigo-950/60'} border ${activeSubjectTheme?.cardBorder || 'border-indigo-800/40'} ${activeSubjectTheme?.text || 'text-indigo-300'} shrink-0`}>
                        Day {item.day}
                      </span>
                    ) : (
                      <span className="text-[11px] font-bold px-2.5 py-1 rounded-lg bg-emerald-950/60 border border-emerald-800/40 text-emerald-300 shrink-0">
                        #{idx + 1}
                      </span>
                    )}

                    {/* Title or Inline Edit Input */}
                    {isEditing ? (
                      <div className="flex items-center gap-2 flex-1">
                        <input
                          type="text"
                          aria-label="Edit item title"
                          value={editingTitle}
                          onChange={e => setEditingTitle(e.target.value)}
                          className="flex-1 px-3 py-1.5 rounded-lg bg-[#0b0f19] border border-indigo-500 text-sm text-slate-100 focus:outline-none ring-1 ring-indigo-500/30"
                          autoFocus
                          onKeyDown={e => {
                            if (e.key === 'Enter') saveEditing(item.id);
                            if (e.key === 'Escape') cancelEditing();
                          }}
                        />
                        <button
                          type="button"
                          onClick={() => saveEditing(item.id)}
                          className="p-1.5 rounded-lg bg-emerald-600/20 text-emerald-400 hover:bg-emerald-600/30 transition-colors"
                          title="Save title"
                          aria-label="Save title"
                        >
                          <Check className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={cancelEditing}
                          className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-slate-200 transition-colors"
                          title="Cancel"
                          aria-label="Cancel editing"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <div
                        onClick={() => startEditing(item.id, item.title)}
                        className="text-sm font-medium text-slate-200 truncate cursor-pointer hover:text-indigo-300 flex items-center gap-2 flex-1"
                        title="Click to rename"
                      >
                        <span className="truncate">{item.title}</span>
                        <Edit2 className="w-3.5 h-3.5 text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                      </div>
                    )}
                  </div>

                  {/* Actions: Move Up, Move Down, Delete */}
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      type="button"
                      onClick={() => moveItem(activeTab, idx, 'up')}
                      disabled={idx === 0}
                      title="Move up"
                      aria-label="Move up"
                      className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 disabled:opacity-20 disabled:hover:bg-transparent disabled:hover:text-slate-400 transition-colors cursor-pointer"
                    >
                      <ArrowUp className="w-4 h-4" />
                    </button>

                    <button
                      type="button"
                      onClick={() => moveItem(activeTab, idx, 'down')}
                      disabled={idx === filteredItems.length - 1}
                      title="Move down"
                      aria-label="Move down"
                      className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 disabled:opacity-20 disabled:hover:bg-transparent disabled:hover:text-slate-400 transition-colors cursor-pointer"
                    >
                      <ArrowDown className="w-4 h-4" />
                    </button>

                    <button
                      type="button"
                      onClick={() => deleteItem(activeTab, item.id)}
                      title="Delete item"
                      aria-label="Delete item"
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer ml-1"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
