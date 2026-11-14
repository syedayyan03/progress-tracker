import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Star, X } from 'lucide-react';

export const HabitDetailsModal: React.FC = () => {
  const { activeModal, closeModal, state, updateTopicMeta } = useApp();

  if (!activeModal || activeModal.type !== 'habit' || !activeModal.id) {
    return null;
  }

  const { id: habitId } = activeModal;
  const habitItem = state.lists.habits.find(h => h.id === habitId);
  const existingMeta = state.topicMeta[habitId] || {
    rating: 0,
    note: '',
    needsRevision: false,
  };

  const [rating, setRating] = useState(existingMeta.rating || 0);
  const [hoverRating, setHoverRating] = useState(0);
  const [note, setNote] = useState(existingMeta.note || '');

  useEffect(() => {
    setRating(existingMeta.rating || 0);
    setNote(existingMeta.note || '');
  }, [habitId, existingMeta.rating, existingMeta.note]);

  const handleSave = () => {
    updateTopicMeta(habitId, {
      rating,
      note,
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
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
              Habit Focus
            </span>
            <h3 className="font-display font-bold text-xl text-slate-100 leading-tight mt-1">
              {habitItem?.title || 'Habit Details'}
            </h3>
          </div>
          <button
            onClick={closeModal}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Rating Section */}
        <div>
          <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
            Consistency / Quality Rating (1-5)
          </label>
          <div className="flex items-center gap-1.5">
            {[1, 2, 3, 4, 5].map(star => {
              const active = (hoverRating || rating) >= star;
              return (
                <button
                  key={star}
                  type="button"
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  onClick={() => setRating(star)}
                  className="p-1 rounded-md hover:scale-110 transition-transform"
                >
                  <Star
                    className={`w-7 h-7 transition-colors ${
                      active
                        ? 'fill-amber-400 text-amber-400 drop-shadow'
                        : 'text-slate-600 hover:text-slate-400'
                    }`}
                  />
                </button>
              );
            })}
            <span className="text-sm font-semibold text-slate-300 ml-2">
              {rating > 0 ? `${rating} / 5 Stars` : 'Not rated'}
            </span>
          </div>
        </div>

        {/* Habit Notes / Intentions */}
        <div>
          <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
            Habit Notes & Targets
          </label>
          <textarea
            value={note}
            onChange={e => setNote(e.target.value)}
            rows={3}
            placeholder="Add habit trigger, specific reps/verses, or focus intentions..."
            className="w-full px-3.5 py-2.5 rounded-xl bg-[#0b0f19] border border-slate-800 text-slate-200 text-sm focus:outline-none focus:border-indigo-500 transition-colors resize-y"
          />
        </div>

        {/* Modal Actions */}
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
          <button
            type="button"
            onClick={closeModal}
            className="px-4 py-2 rounded-xl text-sm font-semibold text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="px-5 py-2 rounded-xl text-sm font-semibold bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-emerald-600/30 transition-all"
          >
            Save Details
          </button>
        </div>
      </div>
    </div>
  );
};
