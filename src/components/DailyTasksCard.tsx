import React from 'react';
import { CheckCircle2, Gift, Sparkles, Trophy } from 'lucide-react';
import { useGame } from '../context/GameContext';
import { soundManager } from '../utils/audio';

export const DailyTasksCard: React.FC = () => {
  const { stats, claimDailyQuest } = useGame();

  const handleClaim = (questId: string) => {
    claimDailyQuest(questId);
  };

  const allCompleted = stats.dailyQuests.every((q) => q.completed && q.claimed);

  return (
    <div
      id="daily-tasks-section"
      className="bg-white/80 backdrop-blur-md rounded-[32px] border-4 border-white p-5 sm:p-6 shadow-xl"
    >
      <div className="flex items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-2xl bg-white border border-green-100 flex items-center justify-center text-xl shadow-xs">
            🎯
          </div>
          <div>
            <h3 className="font-['Fredoka',sans-serif] font-black text-base sm:text-lg text-slate-900">
              Günün EkoGörevleri
            </h3>
            <p className="text-xs font-bold text-gray-500">
              Görevleri tamamla, bonus puan ve yıldız kazan!
            </p>
          </div>
        </div>

        {allCompleted && (
          <span className="bg-green-600 text-white text-[10px] uppercase tracking-widest font-black px-3 py-1 rounded-full flex items-center gap-1 shadow-xs">
            <Sparkles className="w-3 h-3 text-amber-300" />
            Tümü Bitti!
          </span>
        )}
      </div>

      <div className="space-y-3">
        {stats.dailyQuests.map((quest) => {
          const progressPercent = Math.min(100, Math.round((quest.current / quest.target) * 100));

          return (
            <div
              key={quest.id}
              className={`p-3.5 rounded-2xl border-2 transition-all ${
                quest.claimed
                  ? 'bg-gray-50 border-gray-200 text-gray-400 opacity-70'
                  : quest.completed
                  ? 'bg-green-50 border-green-300 text-green-950 shadow-xs'
                  : 'bg-white border-green-100 text-slate-800 shadow-xs'
              }`}
            >
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <span className="text-2xl shrink-0">{quest.icon}</span>
                  <div className="min-w-0">
                    <p className={`text-xs sm:text-sm font-black ${quest.claimed ? 'line-through text-gray-400' : 'text-slate-800'}`}>
                      {quest.title}
                    </p>
                    <div className="flex items-center gap-2 text-[11px] font-bold text-gray-500 mt-0.5">
                      <span>
                        İlerleme: {quest.current}/{quest.target}
                      </span>
                      <span className="text-amber-600 font-black">
                        +{quest.rewardPoints} Puan | +{quest.rewardStars} ⭐
                      </span>
                    </div>
                  </div>
                </div>

                {/* Action button */}
                <div>
                  {quest.claimed ? (
                    <span className="flex items-center gap-1 text-[11px] font-black text-green-700 bg-green-100 px-3 py-1.5 rounded-xl whitespace-nowrap">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Alındı
                    </span>
                  ) : quest.completed ? (
                    <button
                      id={`claim-quest-btn-${quest.id}`}
                      onClick={() => handleClaim(quest.id)}
                      className="flex items-center gap-1.5 bg-green-500 hover:bg-green-600 text-white font-black text-xs px-3.5 py-2 rounded-xl shadow-md shadow-green-400/30 active:scale-95 transition-all cursor-pointer animate-pulse whitespace-nowrap"
                    >
                      <Gift className="w-3.5 h-3.5" />
                      Ödülü Al!
                    </button>
                  ) : (
                    <div className="w-16 sm:w-20 bg-gray-100 h-2.5 rounded-full overflow-hidden border border-gray-200">
                      <div
                        className="bg-green-500 h-full rounded-full transition-all duration-300"
                        style={{ width: `${progressPercent}%` }}
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
