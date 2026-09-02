import React from 'react';
import { Sparkles, Heart, Zap, RefreshCw } from 'lucide-react';
import { useGame } from '../context/GameContext';
import { soundManager } from '../utils/audio';

export const MonsterStatus: React.FC = () => {
  const { stats, showToast } = useGame();
  const cleanPercent = Math.min(100, Math.max(0, stats.monsterCleanliness));

  // Determine Monster Stage based on cleanPercent (0-100)
  const getStageInfo = () => {
    if (cleanPercent < 25) {
      return {
        stage: 1,
        name: 'HurdaCan (Dağınık & Üzgün)',
        avatar: '👾',
        extraVisual: '⛓️🔌📺',
        subtext: 'Üzerine eski kablolar ve kırık parçalar dolanmış. Geri dönüşüm yaparak onu kurtarabilirsin!',
        bgColor: 'bg-amber-50 border-amber-200 text-amber-900',
        badgeColor: 'bg-amber-200 text-amber-900',
        quote: 'Ah, her yanım bozuk piller ve eski kablolarla dolu! Bana yardım eder misin?',
        sizeScale: 'scale-125',
      };
    }
    if (cleanPercent < 50) {
      return {
        stage: 2,
        name: 'HurdaCan (Umutlu & Toparlanıyor)',
        avatar: '🤖',
        extraVisual: '⚙️🌱',
        subtext: 'Kabloların bir kısmı temizlendi! Başında minik yeşil bir yaprak filizlendi.',
        bgColor: 'bg-sky-50 border-sky-200 text-sky-900',
        badgeColor: 'bg-sky-200 text-sky-900',
        quote: 'Harika gidiyorsun! Kendimi biraz daha hafif hissediyorum!',
        sizeScale: 'scale-110',
      };
    }
    if (cleanPercent < 75) {
      return {
        stage: 3,
        name: 'HurdaCan (Pırıl Pırıl Parlıyor)',
        avatar: '✨🤖✨',
        extraVisual: '🌸🔋',
        subtext: 'Bozuk parçalar ayrıştı, artık temiz enerjiyle parıldıyor!',
        bgColor: 'bg-emerald-50 border-emerald-200 text-emerald-900',
        badgeColor: 'bg-emerald-200 text-emerald-900',
        quote: 'Vay canına! E-atıklar dönüştükçe gücüm ve neşem yerine geliyor!',
        sizeScale: 'scale-100',
      };
    }
    if (cleanPercent < 100) {
      return {
        stage: 4,
        name: 'Doğa Dostu Canavar',
        avatar: '🧚‍♂️✨',
        extraVisual: '🦋🌿',
        subtext: 'Neredeyse tamamen temizlendi! Artık doğayı koruyan bir dost oldu.',
        bgColor: 'bg-teal-50 border-teal-200 text-teal-900',
        badgeColor: 'bg-teal-200 text-teal-900',
        quote: 'Çok az kaldı! Son atıkları da ayrıştırıp tam bir doğa perisi olalım!',
        sizeScale: 'scale-95',
      };
    }
    return {
      stage: 5,
      name: 'EkoPırıl (Tertemiz Doğa Ruhu)',
      avatar: '🌟👑🧚‍♀️',
      extraVisual: '🌈🌸🦋',
      subtext: 'Tebrikler! Canavar tamamen temizlendi ve doğayı koruyan sihirli bir dosta dönüştü!',
      bgColor: 'bg-gradient-to-br from-emerald-100 via-teal-50 to-green-100 border-emerald-300 text-emerald-950',
      badgeColor: 'bg-emerald-500 text-white',
      quote: 'Doğayı temizledin! Sen gerçek bir Süper EkoKaşifsin! 💚',
      sizeScale: 'scale-105',
    };
  };

  const info = getStageInfo();

  const handleMonsterClick = () => {
    soundManager.playPop();
    showToast(`${info.name}: "${info.quote}"`, 'star');
  };

  return (
    <div
      id="monster-status-card"
      className="bg-white/80 backdrop-blur-md rounded-[32px] border-4 border-white p-5 sm:p-6 shadow-xl relative overflow-hidden"
    >
      {/* Top Header */}
      <div className="flex items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-2">
          <span className={`text-[10px] uppercase font-black tracking-widest px-3 py-1 rounded-full shadow-xs ${info.badgeColor}`}>
            Aşama {info.stage}/5
          </span>
          <h3 className="font-['Fredoka',sans-serif] font-black text-base sm:text-lg text-slate-800">
            {info.name}
          </h3>
        </div>
        <div className="flex items-center gap-1 font-black text-xs bg-rose-50 border border-rose-200 text-rose-700 px-2.5 py-1 rounded-xl shadow-xs">
          <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
          <span>%{cleanPercent} Temiz</span>
        </div>
      </div>

      {/* Main Content Row */}
      <div className="flex items-center gap-4">
        {/* Interactive Monster Avatar */}
        <button
          onClick={handleMonsterClick}
          aria-label="E-Atık Canavarı ile konuş"
          className="w-18 h-18 sm:w-20 sm:h-20 rounded-[24px] bg-white border-2 border-green-200 flex flex-col items-center justify-center shadow-md cursor-pointer active:scale-95 transition-transform shrink-0"
        >
          <span className={`text-3xl sm:text-4xl filter drop-shadow-sm animate-pulse ${info.sizeScale}`}>
            {info.avatar}
          </span>
          <span className="text-[10px] text-slate-500 font-bold mt-0.5">
            {info.extraVisual}
          </span>
        </button>

        {/* Info & Progress */}
        <div className="flex-1 min-w-0">
          <p className="text-xs sm:text-sm font-bold text-slate-700 leading-snug">
            {info.subtext}
          </p>

          {/* Cleanliness Progress Bar */}
          <div className="mt-3">
            <div className="flex justify-between text-[11px] font-bold text-gray-500 mb-1">
              <span className="uppercase text-[10px] tracking-wider">Doğa İyileşme Oranı</span>
              <span className="text-green-700 font-black">%{cleanPercent}</span>
            </div>
            <div className="w-full bg-gray-200/80 h-3 rounded-full overflow-hidden p-0.5 border border-white">
              <div
                className="bg-gradient-to-r from-amber-400 via-green-400 to-teal-500 h-full rounded-full transition-all duration-700"
                style={{ width: `${cleanPercent}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Positive Feedback Note */}
      <div className="mt-3 pt-3 border-t border-green-100/80 flex items-center justify-between text-xs font-bold text-green-800">
        <span className="flex items-center gap-1.5">
          <Sparkles className="w-4 h-4 text-amber-500" />
          {cleanPercent >= 100
            ? 'Doğayı temizledin! EkoPırıl seninle gurur duyuyor!'
            : 'Her doğru geri dönüşüm canavarı küçültür ve temizler!'}
        </span>
      </div>
    </div>
  );
};
