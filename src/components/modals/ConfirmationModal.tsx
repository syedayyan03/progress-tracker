import React from 'react';
import { useApp } from '../../context/AppContext';
import { Sparkles, AlertTriangle, X } from 'lucide-react';

export const ConfirmationModal: React.FC = () => {
  const { activeModal, closeModal, loadSampleData, resetAllData } = useApp();

  if (!activeModal || (activeModal.type !== 'sampleData' && activeModal.type !== 'resetData')) {
    return null;
  }

  const isReset = activeModal.type === 'resetData';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in">
      <div 
        className="w-full max-w-md bg-[#13192b] border border-slate-800 rounded-2xl shadow-2xl p-6 text-slate-100 flex flex-col gap-5"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
              isReset ? 'bg-rose-500/20 text-rose-400' : 'bg-indigo-500/20 text-indigo-400'
            }`}>
              {isReset ? <AlertTriangle className="w-5 h-5" /> : <Sparkles className="w-5 h-5" />}
            </div>
            <div>
              <h3 className="font-display font-bold text-lg text-slate-100">
                {isReset ? 'Reset All Application Data?' : 'Load Sample Data Preview?'}
              </h3>
            </div>
          </div>
          <button
            onClick={closeModal}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-sm text-slate-300 leading-relaxed">
          {isReset
            ? 'This action cannot be undone. It will permanently clear all your custom topics, logs, ratings, reflections, and settings, returning the tracker to its initial blank state.'
            : 'This will populate your tracker with 45 days of realistic study sessions, habit completion logs, clinical notes, and ratings so you can test all analytics, heatmaps, and calendars immediately.'}
        </p>

        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
          <button
            type="button"
            onClick={closeModal}
            className="px-4 py-2 rounded-xl text-sm font-semibold text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            Cancel
          </button>
          {isReset ? (
            <button
              type="button"
              onClick={resetAllData}
              className="px-5 py-2 rounded-xl text-sm font-semibold bg-rose-600 hover:bg-rose-500 text-white shadow-md shadow-rose-600/30 transition-all"
            >
              Reset Everything
            </button>
          ) : (
            <button
              type="button"
              onClick={loadSampleData}
              className="px-5 py-2 rounded-xl text-sm font-semibold bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/30 transition-all"
            >
              Load Demo Data
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
