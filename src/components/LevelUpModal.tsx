import React from 'react';
import { Trophy, Sparkles, ArrowRight } from 'lucide-react';
import { useGame } from '../context/GameContext';
import { LEVEL_NAMES } from '../data/badgesData';
import { soundManager } from '../utils/audio';

export const LevelUpModal: React.FC = () => {
  const { levelUpNotification, clearLevelUp } = useGame();

  if (!levelUpNotification) return null;

  const levelName = LEVEL_NAMES[levelUpNotification] || 'EkoKaşif';

  const handleClose = () => {
    soundManager.playPop();
    clearLevelUp();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-md animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-sm w-full p-5 sm:p-6 shadow-2xl border-4 border-amber-300 text-center relative overflow-hidden">
        {/* Animated Trophy Header */}
        <div className="w-20 h-20 mx-auto rounded-3xl bg-gradient-to-tr from-amber-400 to-yellow-300 p-1 shadow-lg shadow-amber-500/40 mb-3 flex items-center justify-center text-4xl animate-bounce">
          🏆
        </div>

        <div className="inline-block bg-amber-100 text-amber-900 text-xs font-black px-3 py-1 rounded-full mb-1">
          TEBRİKLER! SEVİYE ATLADIN!
        </div>

        <h2 className="font-['Fredoka',sans-serif] text-2xl sm:text-3xl font-black text-slate-800">
          Seviye {levelUpNotification}
        </h2>
        <p className="font-['Fredoka',sans-serif] text-lg font-bold text-emerald-600 mt-0.5">
          "{levelName}"
        </p>

        <p className="text-xs sm:text-sm font-semibold text-slate-600 mt-2">
          E-atıkları başarıyla ayırarak doğayı korumaya devam ediyorsun. EkoBahçende yeni öğelerin kilidi açıldı!
        </p>

        <button
          id="level-up-continue-button"
          onClick={handleClose}
          className="mt-5 w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-['Fredoka',sans-serif] font-black text-base shadow-md shadow-emerald-500/30 flex items-center justify-center gap-2 active:scale-95 transition-all cursor-pointer"
        >
          <Sparkles className="w-4 h-4 text-amber-300" />
          <span>Harika! Devam Et</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
