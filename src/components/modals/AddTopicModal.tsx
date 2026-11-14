import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { getSubjectTheme } from '../../utils/subjectColors';
import { X, Plus } from 'lucide-react';

export const AddTopicModal: React.FC = () => {
  const { activeModal, closeModal, state, addItem } = useApp();

  if (!activeModal || activeModal.type !== 'addTopic') {
    return null;
  }

  const subjects = state.lists.subjects || [];
  const defaultSubj = activeModal.category || (subjects.length > 0 ? subjects[0].id : 'medicine');

  const [subjectId, setSubjectId] = useState(defaultSubj);
  const [day, setDay] = useState(activeModal.defaultDay || 1);
  const [title, setTitle] = useState('');

  useEffect(() => {
    if (activeModal.category) setSubjectId(activeModal.category);
    if (activeModal.defaultDay) setDay(activeModal.defaultDay);
  }, [activeModal.category, activeModal.defaultDay]);

  const selectedSubject = subjects.find(s => s.id === subjectId) || subjects[0];
  const theme = getSubjectTheme(selectedSubject?.color);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    addItem(subjectId, {
      title: title.trim(),
      day: Number(day) || 1,
    });
    closeModal();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in">
      <div 
        className="w-full max-w-md bg-[#13192b] border border-slate-800 rounded-2xl shadow-2xl p-6 text-slate-100 flex flex-col gap-5 max-h-[90vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-4 pb-3 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${theme.badge}`}>
              <Plus className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <h3 className="font-display font-bold text-lg text-slate-100 leading-tight">
                Add Subject Checklist Item
              </h3>
              <p className="text-xs text-slate-400">
                Create a new study topic under any subject
              </p>
            </div>
          </div>
          <button
            onClick={closeModal}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Subject Dropdown */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Select Subject
            </label>
            <div className="relative">
              <select
                value={subjectId}
                onChange={e => setSubjectId(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#0b0f19] border border-slate-800 text-slate-100 text-sm focus:outline-none focus:border-indigo-500 font-medium cursor-pointer"
              >
                {subjects.map(s => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Syllabus Day input */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Syllabus Day
            </label>
            <div className="relative">
              <input
                type="number"
                min="1"
                max="365"
                value={day}
                onChange={e => setDay(parseInt(e.target.value) || 1)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#0b0f19] border border-slate-800 text-slate-100 text-sm focus:outline-none focus:border-indigo-500 font-medium"
              />
            </div>
            <span className="text-[11px] text-slate-500 mt-1 block">
              Which day of the curriculum this topic belongs to.
            </span>
          </div>

          {/* Topic Title */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Topic Title
            </label>
            <input
              type="text"
              autoFocus
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="e.g. Acute Appendicitis & Peritonitis"
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#0b0f19] border border-slate-800 text-slate-100 text-sm focus:outline-none focus:border-indigo-500"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
            <button
              type="button"
              onClick={closeModal}
              className="px-4 py-2 rounded-xl text-sm font-semibold text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!title.trim()}
              className="px-5 py-2 rounded-xl text-sm font-semibold bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white shadow-md shadow-indigo-600/30 transition-all flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>Add Topic</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
