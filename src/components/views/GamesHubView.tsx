import React from 'react';
import { Gamepad2, Sparkles, Trophy, ArrowRight, BookOpen, Layers, HelpCircle, Target } from 'lucide-react';
import { useGame } from '../../context/GameContext';
import { EWasteHuntGame } from './EWasteHuntGame';
import { SortingGame } from './SortingGame';
import { EcoQuizGame } from './EcoQuizGame';
import { soundManager } from '../../utils/audio';

export const GamesHubView: React.FC = () => {
  const { activeGame, setActiveGame, setActiveTab } = useGame();

  if (activeGame === 'hunt') {
    return <EWasteHuntGame />;
  }
  if (activeGame === 'sort') {
    return <SortingGame />;
  }
  if (activeGame === 'quiz') {
    return <EcoQuizGame />;
  }

  const gamesList = [
    {
      id: 'hunt' as const,
      title: 'E-ATIK AVI',
      tagline: 'Hızlı ol ve ekrandaki e-atıkları topla!',
      icon: '🎮',
      badge: 'Refleks & Dikkat',
      cardClass: 'bg-orange-400 border-b-8 border-orange-600',
      badgeClass: 'bg-orange-500/80',
      btnClass: 'bg-white text-orange-700 hover:bg-orange-50',
      pointsDesc: '+10 Puan her doğru e-atıkta',
    },
    {
      id: 'sort' as const,
      title: 'DOĞRU KUTU',
      tagline: 'Pilleri ve cihazları doğru geri dönüşüm kutusuna yerleştir!',
      icon: '📦',
      badge: 'Beceri & Ayrıştırma',
      cardClass: 'bg-blue-400 border-b-8 border-blue-600',
      badgeClass: 'bg-blue-500/80',
      btnClass: 'bg-white text-blue-700 hover:bg-blue-50',
      pointsDesc: '+15 Puan her doğru kutuda',
    },
    {
      id: 'quiz' as const,
      title: 'EKO BULMACA',
      tagline: '3 şıklı eğlenceli çevre sorularını çöz ve yıldız kazan!',
      icon: '🧩',
      badge: 'Bilgi & Zeka',
      cardClass: 'bg-purple-400 border-b-8 border-purple-600',
      badgeClass: 'bg-purple-500/80',
      btnClass: 'bg-white text-purple-700 hover:bg-purple-50',
      pointsDesc: '+20 Puan & Yıldız',
    },
  ];

  return (
    <div className="max-w-3xl mx-auto pb-12 space-y-5">
      {/* Header Banner */}
      <div className="bg-white/70 backdrop-blur-md rounded-[32px] p-6 border-4 border-white shadow-xl text-center relative overflow-hidden">
        <div className="inline-flex items-center gap-1.5 bg-green-100 text-green-800 text-xs font-black px-3 py-1 rounded-full mb-1 shadow-xs">
          <Gamepad2 className="w-3.5 h-3.5 text-green-600" />
          <span>Oyun Merkezi</span>
        </div>
        <h2 className="font-['Fredoka',sans-serif] text-2xl sm:text-3xl font-black text-green-950">
          Oynamak İstediğin Oyunu Seç!
        </h2>
        <p className="text-xs sm:text-sm font-bold text-green-800/80 max-w-sm mx-auto mt-1">
          Her oyun seni hem eğlendirir hem de doğayı koruman için puan kazandırır!
        </p>
      </div>

      {/* 3 Games List with 3D Blocks */}
      <div className="space-y-4">
        {gamesList.map((game) => {
          return (
            <div
              key={game.id}
              onClick={() => {
                soundManager.playPop();
                setActiveGame(game.id);
              }}
              className={`rounded-[32px] p-5 sm:p-6 shadow-xl ${game.cardClass} flex flex-col sm:flex-row items-center justify-between gap-4 cursor-pointer hover:-translate-y-1 active:translate-y-0 transition-all text-white select-none group`}
            >
              <div className="flex items-center gap-4 w-full sm:w-auto">
                <div className="w-16 h-16 sm:w-18 sm:h-18 rounded-[24px] bg-white/20 backdrop-blur-xs flex items-center justify-center text-4xl shadow-inner shrink-0 group-hover:scale-110 transition-transform">
                  {game.icon}
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-['Fredoka',sans-serif] font-black text-lg sm:text-xl text-white">
                      {game.title}
                    </h3>
                    <span className={`text-[10px] font-black ${game.badgeClass} text-white px-2.5 py-0.5 rounded-full uppercase tracking-wider shadow-xs`}>
                      {game.badge}
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm font-bold text-white/90 mt-1 leading-snug">
                    {game.tagline}
                  </p>
                  <span className="text-[11px] font-black text-white/95 mt-1.5 inline-flex items-center gap-1 bg-black/15 px-2.5 py-0.5 rounded-lg">
                    ⭐ {game.pointsDesc}
                  </span>
                </div>
              </div>

              <button
                id={`play-game-btn-${game.id}`}
                className={`w-full sm:w-auto px-6 py-3 rounded-2xl font-['Fredoka',sans-serif] font-black text-sm shadow-lg flex items-center justify-center gap-2 active:scale-95 transition-all cursor-pointer whitespace-nowrap ${game.btnClass}`}
              >
                <span>Hemen Oyna</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          );
        })}
      </div>

      {/* Extra Card: E-Atıkları Tanı Guide shortcut */}
      <div
        onClick={() => {
          soundManager.playPop();
          setActiveTab('cards');
        }}
        className="bg-white/80 backdrop-blur-md rounded-[32px] border-4 border-white p-5 shadow-xl flex items-center justify-between gap-4 cursor-pointer hover:shadow-2xl transition-all select-none"
      >
        <div className="flex items-center gap-3.5">
          <div className="w-14 h-14 rounded-2xl bg-yellow-400 text-yellow-950 flex items-center justify-center text-3xl shadow-md shrink-0">
            📱
          </div>
          <div>
            <span className="text-[10px] uppercase font-black text-gray-400 tracking-widest">
              Rehber & Kartlar
            </span>
            <h4 className="font-['Fredoka',sans-serif] font-black text-base sm:text-lg text-slate-900">
              E-Atıkları Tanımak İster misin?
            </h4>
            <p className="text-xs font-bold text-gray-500">
              Resimli kartlarla pilleri ve cihazları yakından incele.
            </p>
          </div>
        </div>

        <button
          id="open-cards-from-games-hub"
          className="bg-green-500 hover:bg-green-600 text-white font-['Fredoka',sans-serif] font-black text-xs sm:text-sm px-4 py-2.5 rounded-2xl active:scale-95 transition-all shrink-0 cursor-pointer shadow-md shadow-green-300"
        >
          İncele →
        </button>
      </div>
    </div>
  );
};
