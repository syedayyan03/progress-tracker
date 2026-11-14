import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { SUBJECT_THEMES } from '../../utils/subjectColors';
import { X, BookPlus } from 'lucide-react';

export const AddSubjectModal: React.FC = () => {
  const { activeModal, closeModal, addSubject } = useApp();

  const [name, setName] = useState('');
  const [color, setColor] = useState('indigo');

  if (!activeModal || activeModal.type !== 'addSubject') {
    return null;
  }

  const availableColors = Object.keys(SUBJECT_THEMES);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    addSubject({
      name: name.trim(),
      color,
    });
    setName('');
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
            <div className="w-9 h-9 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
              <BookPlus className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-display font-bold text-lg text-slate-100 leading-tight">
                Create New Subject
              </h3>
              <p className="text-xs text-slate-400">
                Add a new subject to your study curriculum
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
          {/* Subject Name */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Subject Name
            </label>
            <input
              type="text"
              autoFocus
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="e.g. Pathology, Radiology, Pharmacology"
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#0b0f19] border border-slate-800 text-slate-100 text-sm focus:outline-none focus:border-indigo-500"
            />
          </div>

          {/* Color theme selection */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Color Tag
            </label>
            <div className="grid grid-cols-5 gap-2.5">
              {availableColors.map(c => {
                const theme = SUBJECT_THEMES[c];
                const isSelected = color === c;
                return (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setColor(c)}
                    className={`flex items-center justify-center py-2 px-3 rounded-xl border text-xs font-bold capitalize transition-all ${
                      isSelected
                        ? `${theme.activeBtn} ring-2 ring-white/40 scale-105 shadow-md`
                        : `${theme.badge} hover:opacity-80`
                    }`}
                  >
                    {c}
                  </button>
                );
              })}
            </div>
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
              disabled={!name.trim()}
              className="px-5 py-2 rounded-xl text-sm font-semibold bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white shadow-md shadow-indigo-600/30 transition-all"
            >
              Create Subject
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
