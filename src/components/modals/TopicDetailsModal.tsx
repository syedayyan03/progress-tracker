import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Star, X, Calendar, AlertTriangle } from 'lucide-react';

export const TopicDetailsModal: React.FC = () => {
  const { activeModal, closeModal, state, updateTopicMeta, getSubjectTopics } = useApp();

  if (!activeModal || activeModal.type !== 'topic' || !activeModal.id) {
    return null;
  }

  const { id: topicId, category = 'medicine' } = activeModal;
  const topicItem = getSubjectTopics(category).find(t => t.id === topicId);
  const existingMeta = state.topicMeta[topicId] || {
    rating: 0,
    note: '',
    needsRevision: false,
  };

  const [rating, setRating] = useState(existingMeta.rating || 0);
  const [hoverRating, setHoverRating] = useState(0);
  const [needsRevision, setNeedsRevision] = useState(existingMeta.needsRevision || false);
  const [note, setNote] = useState(existingMeta.note || '');
  const [scheduledDay, setScheduledDay] = useState(topicItem?.day || 1);

  useEffect(() => {
    setRating(existingMeta.rating || 0);
    setNeedsRevision(existingMeta.needsRevision || false);
    setNote(existingMeta.note || '');
    if (topicItem) {
      setScheduledDay(topicItem.day);
    }
  }, [topicId, existingMeta.rating, existingMeta.needsRevision, existingMeta.note, topicItem]);

  const handleSave = () => {
    updateTopicMeta(topicId, {
      rating,
      needsRevision,
      note,
    });
    closeModal();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in">
      <div 
        className="w-full max-w-lg bg-[#13192b] border border-slate-800 rounded-2xl shadow-2xl p-6 text-slate-100 flex flex-col gap-5 max-h-[90vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-4 pb-3 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className={`text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                category === 'medicine' ? 'bg-rose-500/20 text-rose-300' : 'bg-cyan-500/20 text-cyan-300'
              }`}>
                {category === 'medicine' ? 'Internal Medicine' : 'Orthopaedics'} · Day {topicItem?.day}
              </span>
            </div>
            <h3 className="font-display font-bold text-xl text-slate-100 leading-tight">
              {topicItem?.title || 'Topic Details'}
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
            Understanding Rating (1-5)
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

        {/* Needs Revision Flag */}
        <label className="flex items-center gap-3 p-3 rounded-xl bg-slate-900/60 border border-slate-800/80 cursor-pointer hover:border-slate-700 transition-colors">
          <input
            type="checkbox"
            checked={needsRevision}
            onChange={e => setNeedsRevision(e.target.checked)}
            className="w-4 h-4 rounded text-indigo-600 bg-slate-800 border-slate-700 focus:ring-indigo-500"
          />
          <div className="flex items-center gap-2">
            <AlertTriangle className={`w-4 h-4 ${needsRevision ? 'text-amber-400' : 'text-slate-500'}`} />
            <span className="text-sm font-semibold text-slate-200">Flag for Revision</span>
          </div>
        </label>

        {/* Clinical / Study Notes */}
        <div>
          <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
            Clinical Notes & Mnemonics
          </label>
          <textarea
            value={note}
            onChange={e => setNote(e.target.value)}
            rows={4}
            placeholder="Add key diagnostic points, high-yield criteria, drug regimens or notes..."
            className="w-full px-3.5 py-2.5 rounded-xl bg-[#0b0f19] border border-slate-800 text-slate-200 text-sm focus:outline-none focus:border-indigo-500 transition-colors resize-y"
          />
        </div>

        {/* Reschedule Topic / Day Mapping */}
        <div>
          <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
            Assigned Syllabus Day
          </label>
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-slate-500" />
            <span className="text-sm text-slate-300">
              Syllabus Day: <strong className="text-indigo-400">Day {scheduledDay}</strong>
            </span>
          </div>
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
            className="px-5 py-2 rounded-xl text-sm font-semibold bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/30 transition-all"
          >
            Save Details
          </button>
        </div>
      </div>
    </div>
  );
};
