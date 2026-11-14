import React, { useState } from 'react';
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
  Layers
} from 'lucide-react';

export const ManageTasksView: React.FC = () => {
  const { 
    state, 
    addItem, 
    updateItemTitle, 
    moveItem, 
    deleteItem, 
    openModal,
    getSubjectTopics,
    deleteSubject
  } = useApp();

  const subjects = state.lists.subjects || [];

  // Active tab (defaults to 'medicine')
  const [activeTab, setActiveTab] = useState<string>('medicine');

  // Add Item form state
  const [newTitle, setNewTitle] = useState('');
  const [newDay, setNewDay] = useState<number>(1);

  // Inline editing state
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState('');

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

  const listItems = (activeTab === 'habits' ? state.lists.habits : getSubjectTopics(activeTab)) as any[];
  const activeSubject = subjects.find(s => s.id === activeTab);
  const isCustomSubject = activeSubject && !['medicine', 'ortho', 'paediatrics', 'obgyn', 'surgery', 'derma', 'anesthesia', 'psychiatry', 'ent', 'opthal'].includes(activeSubject.id);

  return (
    <div className="flex flex-col gap-6 max-w-5xl mx-auto pb-16">
      {/* Top Banner & Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-800/80">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-blue-500 flex items-center justify-center text-white shadow-lg shadow-indigo-600/30">
            <ListOrdered className="w-6 h-6 stroke-[2.5]" />
          </div>
          <div>
            <h2 className="font-display font-extrabold text-2xl text-slate-100 tracking-tight">
              Manage Tasks & Curriculum
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 font-medium">
              Add, organize, reorder, and edit study topics, clinical subjects, and daily habits.
            </p>
          </div>
        </div>

        {/* Global Action: Add Subject */}
        <button
          type="button"
          onClick={() => openModal({ type: 'addSubject' })}
          className="self-start sm:self-auto px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/25 text-xs font-bold flex items-center gap-2 transition-all cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
        >
          <BookPlus className="w-4 h-4" />
          <span>+ Add Subject</span>
        </button>
      </div>

      {/* Main Container Card */}
      <div className="bg-[#13192b] border border-slate-800/80 rounded-2xl p-4 sm:p-6 shadow-sm flex flex-col gap-5">
        {/* Dynamic Subjects Tab Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin">
            {subjects.map(subj => {
              const count = getSubjectTopics(subj.id).length;
              const theme = getSubjectTheme(subj.color);
              const isActive = activeTab === subj.id;
              return (
                <button
                  key={subj.id}
                  onClick={() => setActiveTab(subj.id)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold shrink-0 transition-all cursor-pointer ${
                    isActive
                      ? `${theme.badge} ring-1 ring-white/20 shadow-sm`
                      : 'text-slate-400 hover:text-white bg-slate-900/50 border border-slate-800 hover:border-slate-700'
                  }`}
                >
                  {subj.name} <span className="opacity-75">({count})</span>
                </button>
              );
            })}

            <button
              onClick={() => setActiveTab('habits')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold shrink-0 transition-all cursor-pointer ${
                activeTab === 'habits'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-white bg-slate-900/50 border border-slate-800 hover:border-slate-700'
              }`}
            >
              Habits <span className="opacity-75">({state.lists.habits.length})</span>
            </button>
          </div>

          {isCustomSubject && (
            <button
              type="button"
              onClick={() => {
                deleteSubject(activeSubject.id);
                setActiveTab('medicine');
              }}
              className="text-xs text-rose-400 hover:text-rose-300 px-3 py-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 shrink-0 font-semibold transition-colors flex items-center gap-1.5 self-end sm:self-auto cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Remove Subject</span>
            </button>
          )}
        </div>

        {/* Selected Subject Info Header */}
        <div className="flex items-center justify-between bg-slate-900/40 border border-slate-800/80 rounded-xl px-4 py-2.5 text-xs text-slate-300">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-indigo-400" />
            <span className="font-semibold text-slate-200">
              {activeTab === 'habits' ? 'Daily Habits Checklist' : `${activeSubject?.name || activeTab} Curriculum`}
            </span>
          </div>
          <span className="text-slate-400 font-medium">
            Total Items: <strong className="text-indigo-400">{listItems.length}</strong>
          </span>
        </div>

        {/* Add Item Form */}
        <form onSubmit={handleAddItem} className="flex flex-col sm:flex-row items-center gap-2.5">
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
                className="w-full px-3 py-2 rounded-xl bg-[#0b0f19] border border-slate-800 text-slate-100 text-sm focus:outline-none focus:border-indigo-500 font-semibold"
              />
            </div>
          )}

          <input
            type="text"
            value={newTitle}
            onChange={e => setNewTitle(e.target.value)}
            placeholder={`Add new ${activeSubject ? activeSubject.name : 'habit'} item...`}
            className="w-full px-3.5 py-2 rounded-xl bg-[#0b0f19] border border-slate-800 text-slate-100 text-sm focus:outline-none focus:border-indigo-500"
          />

          <button
            type="submit"
            className="w-full sm:w-auto px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-md shadow-indigo-600/20 transition-all shrink-0 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add</span>
          </button>
        </form>

        {/* List of Items */}
        <div className="flex flex-col gap-2 max-h-[500px] overflow-y-auto pr-1">
          {listItems.length === 0 ? (
            <div className="p-8 text-center bg-slate-900/30 border border-dashed border-slate-800 rounded-xl text-slate-400 text-sm flex flex-col items-center gap-2">
              <Sparkles className="w-8 h-8 text-slate-600 mb-1" />
              <p className="font-semibold text-slate-300">No tasks added yet for this subject</p>
              <p className="text-xs text-slate-500">Use the form above to add your first checklist item.</p>
            </div>
          ) : (
            listItems.map((item, idx) => {
              const isEditing = editingId === item.id;
              return (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-3 rounded-xl bg-slate-900/60 border border-slate-800/80 hover:border-slate-700 hover:bg-slate-900/80 transition-all group"
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0 mr-2">
                    {item.day !== undefined ? (
                      <span className="text-[11px] font-bold px-2.5 py-1 rounded-lg bg-indigo-950/60 border border-indigo-800/40 text-indigo-300 shrink-0">
                        Day {item.day}
                      </span>
                    ) : (
                      <span className="text-[11px] font-bold px-2.5 py-1 rounded-lg bg-emerald-950/60 border border-emerald-800/40 text-emerald-300 shrink-0">
                        #{idx + 1}
                      </span>
                    )}

                    {isEditing ? (
                      <div className="flex items-center gap-2 flex-1">
                        <input
                          type="text"
                          aria-label="Edit item title"
                          value={editingTitle}
                          onChange={e => setEditingTitle(e.target.value)}
                          className="flex-1 px-3 py-1.5 rounded-lg bg-[#0b0f19] border border-indigo-500 text-sm text-slate-100 focus:outline-none"
                          autoFocus
                          onKeyDown={e => {
                            if (e.key === 'Enter') saveEditing(item.id);
                            if (e.key === 'Escape') setEditingId(null);
                          }}
                        />
                        <button
                          onClick={() => saveEditing(item.id)}
                          className="p-1.5 rounded-lg bg-emerald-600/20 text-emerald-400 hover:bg-emerald-600/30 transition-colors"
                          title="Save title"
                          aria-label="Save title"
                        >
                          <Check className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <span
                        onClick={() => startEditing(item.id, item.title)}
                        className="text-sm font-medium text-slate-200 truncate cursor-pointer hover:text-indigo-300 flex items-center gap-2 flex-1"
                        title="Click to rename"
                      >
                        <span className="truncate">{item.title}</span>
                        <Edit2 className="w-3.5 h-3.5 text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
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
                      className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 disabled:opacity-25 disabled:hover:bg-transparent disabled:hover:text-slate-400 transition-colors cursor-pointer"
                    >
                      <ArrowUp className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => moveItem(activeTab, idx, 'down')}
                      disabled={idx === listItems.length - 1}
                      title="Move down"
                      aria-label="Move down"
                      className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 disabled:opacity-25 disabled:hover:bg-transparent disabled:hover:text-slate-400 transition-colors cursor-pointer"
                    >
                      <ArrowDown className="w-4 h-4" />
                    </button>

                    <button
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
