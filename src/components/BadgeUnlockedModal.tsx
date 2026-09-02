import React from 'react';
import { Award, Sparkles, X } from 'lucide-react';
import { useGame } from '../context/GameContext';
import { BADGES } from '../data/badgesData';
import { soundManager } from '../utils/audio';

export const BadgeUnlockedModal: React.FC = () => {
  const { newBadgeUnlocked, clearNewBadge } = useGame();

  if (!newBadgeUnlocked) return null;

  const badge = BADGES.find((b) => b.id === newBadgeUnlocked);
  if (!badge) return null;

  const handleClose = () => {
    soundManager.playPop();
    clearNewBadge();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-md animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-sm w-full p-5 sm:p-6 shadow-2xl border-4 border-emerald-300 text-center relative overflow-hidden">
        <button
          onClick={handleClose}
          className="absolute top-3 right-3 text-slate-400 hover:text-slate-600 p-1"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Badge Icon */}
        <div
          className={`w-20 h-20 mx-auto rounded-3xl bg-gradient-to-tr ${badge.color} p-1 shadow-lg shadow-emerald-500/30 mb-3 flex items-center justify-center text-4xl animate-bounce`}
        >
          {badge.icon}
        </div>

        <div className="inline-block bg-emerald-100 text-emerald-900 text-xs font-black px-3 py-1 rounded-full mb-1">
          YENİ ROZET KAZANDIN!
        </div>

        <h2 className="font-['Fredoka',sans-serif] text-xl sm:text-2xl font-black text-slate-800 mt-1">
          {badge.name}
        </h2>

        <p className="text-xs sm:text-sm font-semibold text-slate-600 mt-2">
          {badge.description}
        </p>

        <button
          id="badge-modal-ok-button"
          onClick={handleClose}
          className="mt-5 w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-['Fredoka',sans-serif] font-black text-base shadow-md shadow-emerald-500/30 flex items-center justify-center gap-2 active:scale-95 transition-all cursor-pointer"
        >
          <Sparkles className="w-4 h-4 text-amber-300" />
          <span>Rozetimi Koleksiyona Ekle!</span>
        </button>
      </div>
    </div>
  );
};
