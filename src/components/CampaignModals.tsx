import React from 'react';
import { Sparkles, Trophy, ArrowRight, Award, CheckCircle2, Gamepad2, Compass, Box, BrainCircuit, X } from 'lucide-react';
import { useGame } from '../context/GameContext';
import { soundManager } from '../utils/audio';

export const CampaignModals: React.FC = () => {
  const {
    campaignState,
    proceedToNextCampaignStep,
    claimDiplomaFromVictory,
    cancelCampaign,
    stats,
  } = useGame();

  // 1. STAGE TRANSITION MODAL (e.g. between Hunt -> Sort or Sort -> Quiz)
  if (campaignState.isTransitionOpen && campaignState.nextGameInfo) {
    const nextGame = campaignState.nextGameInfo;

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-md animate-fadeIn">
        <div className="bg-white rounded-[36px] sm:rounded-[40px] max-w-lg w-full p-6 sm:p-8 border-4 border-amber-300 shadow-2xl relative overflow-hidden text-center select-none animate-scaleUp">
          {/* Ambient decorative circles */}
          <div className="absolute -top-12 -right-12 w-36 h-36 bg-amber-100 rounded-full blur-2xl opacity-70 pointer-events-none" />
          <div className="absolute -bottom-12 -left-12 w-36 h-36 bg-green-100 rounded-full blur-2xl opacity-70 pointer-events-none" />

          {/* Top Success Badge */}
          <div className="inline-flex items-center gap-1.5 bg-emerald-100 text-emerald-800 text-xs font-black px-4 py-1.5 rounded-full mb-3 border border-emerald-300 shadow-xs">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>BÖLÜM BAŞARIYLA BİTTİ!</span>
          </div>

          {/* Completed Game Announcement */}
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 font-['Fredoka',sans-serif] leading-tight">
            🎉 {campaignState.completedGameName} Tamamlandı!
          </h2>
          <p className="text-xs sm:text-sm font-bold text-slate-600 mt-1 max-w-sm mx-auto">
            Harika iş çıkardın! Puanlarını ve tecrübeni topladın, şimdi görev serüveninde bir sonraki adıma geçiyorsun.
          </p>

          {/* Next Stage Highlight Card */}
          <div className="my-5 p-4 sm:p-5 rounded-[28px] bg-gradient-to-br from-emerald-50 via-teal-50 to-amber-50 border-2 border-emerald-300 shadow-lg text-left relative overflow-hidden">
            <div className="flex items-center justify-between gap-2 mb-2">
              <span className="text-[11px] font-black uppercase tracking-wider bg-emerald-600 text-white px-3 py-0.5 rounded-full shadow-xs">
                Sıradaki Bölüm • {nextGame.stageNumber} / {nextGame.totalStages}
              </span>
              <span className="text-2xl animate-bounce">{nextGame.icon}</span>
            </div>

            <h3 className="text-xl sm:text-2xl font-black text-emerald-950 font-['Fredoka',sans-serif]">
              {nextGame.title}
            </h3>
            <p className="text-xs sm:text-sm font-bold text-slate-700 mt-1">
              {nextGame.subtitle}
            </p>

            <div className="mt-3 pt-2.5 border-t border-emerald-200/60 flex items-center justify-between text-xs font-black text-emerald-800">
              <span>Görev Türü: {nextGame.badge}</span>
              <span className="text-amber-600 flex items-center gap-1">⭐ +Puan Kazan</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-2.5">
            <button
              id="campaign-next-stage-btn"
              onClick={proceedToNextCampaignStep}
              className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white font-['Fredoka',sans-serif] font-black text-base sm:text-lg shadow-xl shadow-emerald-500/30 flex items-center justify-center gap-2 active:scale-95 transition-all cursor-pointer"
            >
              <span>Sıradaki Göreve Geç ({nextGame.title})</span>
              <ArrowRight className="w-5 h-5" />
            </button>

            <button
              id="campaign-quit-btn"
              onClick={cancelCampaign}
              className="text-xs font-bold text-slate-400 hover:text-slate-600 transition-colors py-1 cursor-pointer"
            >
              Şimdilik Görevden Çık
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 2. CAMPAIGN VICTORY & GRADUATION MODAL (After Quiz finishes)
  if (campaignState.isVictoryOpen) {
    const recipientName = stats.userName && stats.userName.trim() ? stats.userName : 'Değerli EkoKaşif';

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/85 backdrop-blur-md animate-fadeIn">
        <div className="bg-gradient-to-b from-amber-50 via-white to-emerald-50 rounded-[36px] sm:rounded-[44px] max-w-lg w-full p-6 sm:p-8 border-4 border-amber-400 shadow-2xl relative overflow-hidden text-center select-none animate-scaleUp">
          {/* Ornate Corner Accents */}
          <div className="absolute top-3 left-3 text-2xl opacity-40">✨</div>
          <div className="absolute top-3 right-3 text-2xl opacity-40">✨</div>
          <div className="absolute -top-16 -right-16 w-44 h-44 bg-amber-300 rounded-full blur-3xl opacity-50 pointer-events-none" />
          <div className="absolute -bottom-16 -left-16 w-44 h-44 bg-emerald-300 rounded-full blur-3xl opacity-50 pointer-events-none" />

          {/* Big Bouncing Trophy/Diploma Icon */}
          <div className="w-22 h-22 sm:w-24 sm:h-24 mx-auto rounded-[32px] bg-gradient-to-tr from-amber-400 to-yellow-300 text-amber-950 p-2 shadow-xl shadow-amber-400/40 mb-3 flex items-center justify-center text-5xl animate-bounce border-4 border-white">
            🎓
          </div>

          {/* Celebration Pill */}
          <div className="inline-flex items-center gap-1.5 bg-amber-100 text-amber-900 text-xs font-black px-4 py-1.5 rounded-full mb-2 border border-amber-300 shadow-xs">
            <Sparkles className="w-4 h-4 text-amber-600" />
            <span>TÜM EKO GÖREVLER TAMAMLANDI!</span>
          </div>

          {/* Main Title & Graduation Announcement */}
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 font-['Fredoka',sans-serif] leading-tight">
            Tebrikler {recipientName}! 🌟
          </h2>
          <p className="text-xs sm:text-sm font-bold text-slate-700 mt-1 max-w-sm mx-auto leading-relaxed">
            E-Atık Avı, Doğru Kutu ve Eko Bulmaca oyunlarının tamamını üstün başarıyla bitirdin!
          </p>

          {/* Diploma Earned Badge Banner */}
          <div className="my-4 p-4 rounded-3xl bg-gradient-to-r from-emerald-600 via-teal-600 to-green-600 text-white shadow-lg text-center relative overflow-hidden border-2 border-white/40">
            <div className="text-2xl mb-1">📜✨</div>
            <h3 className="font-['Fredoka',sans-serif] text-base sm:text-lg font-black text-amber-200">
              Resmi Çevre ve Doğa Koruyucusu Diploması Almaya Hak Kazandınız!
            </h3>
            <p className="text-xs text-emerald-100 font-bold mt-0.5">
              İsminize özel düzenlenen resmi diplomanızı hemen görüntüleyin ve PDF olarak indirin.
            </p>
          </div>

          {/* Stats Badges */}
          <div className="grid grid-cols-3 gap-2 mb-5">
            <div className="bg-white rounded-2xl p-2.5 border border-amber-200 shadow-xs">
              <span className="text-[10px] font-bold text-slate-500 block">TOPLAM PUAN</span>
              <span className="font-['Fredoka',sans-serif] font-black text-base text-amber-600">⭐ {stats.points}</span>
            </div>
            <div className="bg-white rounded-2xl p-2.5 border border-emerald-200 shadow-xs">
              <span className="text-[10px] font-bold text-slate-500 block">KADEME</span>
              <span className="font-['Fredoka',sans-serif] font-black text-base text-emerald-600">🌱 {stats.level}. Seviye</span>
            </div>
            <div className="bg-white rounded-2xl p-2.5 border border-purple-200 shadow-xs">
              <span className="text-[10px] font-bold text-slate-500 block">GÖREVLER</span>
              <span className="font-['Fredoka',sans-serif] font-black text-base text-purple-600">🎯 3 / 3 Tam</span>
            </div>
          </div>

          {/* CTA: Go directly to Diploma & PDF Download */}
          <button
            id="claim-diploma-victory-btn"
            onClick={claimDiplomaFromVictory}
            className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 hover:from-amber-600 hover:to-yellow-600 text-amber-950 font-['Fredoka',sans-serif] font-black text-base sm:text-lg shadow-xl shadow-amber-400/40 flex items-center justify-center gap-2 active:scale-95 transition-all cursor-pointer animate-pulse"
          >
            <span>DİPLOMAMI AL VE PDF İNDİR 🎓📥</span>
          </button>
        </div>
      </div>
    );
  }

  return null;
};
