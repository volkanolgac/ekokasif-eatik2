import React, { useState, useEffect } from 'react';
import { ArrowLeft, Sparkles, Trophy, RotateCcw, CheckCircle2, HelpCircle } from 'lucide-react';
import { useGame } from '../../context/GameContext';
import { BIN_DEFINITIONS, E_WASTE_ITEMS, NON_E_WASTE_ITEMS } from '../../data/eWasteData';
import { BinCategoryType, EWasteItem } from '../../types';
import { soundManager } from '../../utils/audio';
import { triggerStarConfetti } from '../../utils/confetti';

export const SortingGame: React.FC = () => {
  const { setActiveGame, recordItemSorted, showToast, campaignState, handleGameCompleteInCampaign } = useGame();
  const [activeItemIndex, setActiveItemIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [sortedCount, setSortedCount] = useState(0);
  const [selectedItemForTap, setSelectedItemForTap] = useState<EWasteItem | null>(null);
  const [wrongShake, setWrongShake] = useState(false);
  const [feedback, setFeedback] = useState<{ text: string; isCorrect: boolean } | null>(null);
  const [isCompleted, setIsCompleted] = useState(false);

  const [itemsToProcess, setItemsToProcess] = useState<EWasteItem[]>([]);

  useEffect(() => {
    const ePool = [...E_WASTE_ITEMS].sort(() => 0.5 - Math.random());
    const nonEPool = [...NON_E_WASTE_ITEMS].sort(() => 0.5 - Math.random()).slice(0, 3);
    const combined = [...ePool, ...nonEPool].sort(() => 0.5 - Math.random());
    setItemsToProcess(combined);
    setActiveItemIndex(0);
    setSelectedItemForTap(combined[0] || null);
  }, []);

  const currentItem = itemsToProcess[activeItemIndex];

  const handleBinSelect = (binId: BinCategoryType) => {
    if (!currentItem || isCompleted) return;

    if (currentItem.category === binId) {
      soundManager.playSuccess();
      triggerStarConfetti();
      const isBattery = currentItem.category === 'battery';
      recordItemSorted(isBattery);
      setScore((prev) => prev + 15);
      setSortedCount((prev) => prev + 1);

      setFeedback({
        text: `Doğru Kutu! ${currentItem.name} başarıyla ayrıştırıldı! +15 Puan ✨`,
        isCorrect: true,
      });

      setTimeout(() => {
        if (activeItemIndex + 1 >= itemsToProcess.length) {
          setIsCompleted(true);
          soundManager.playLevelUp();
          triggerStarConfetti();
        } else {
          setActiveItemIndex((prev) => prev + 1);
          setSelectedItemForTap(itemsToProcess[activeItemIndex + 1]);
          setFeedback(null);
        }
      }, 650);
    } else {
      soundManager.playWrong();
      setWrongShake(true);
      setTimeout(() => setWrongShake(false), 600);

      const targetBin = BIN_DEFINITIONS.find((b) => b.id === currentItem.category);
      setFeedback({
        text: `Tekrar dene! "${currentItem.name}" için uygun kutu: ${targetBin?.name || 'başka bir kutu'}.`,
        isCorrect: false,
      });
      showToast(`${currentItem.name}: ${currentItem.whySeparate}`, 'info');
    }
  };

  const handleRestart = () => {
    soundManager.playPop();
    const ePool = [...E_WASTE_ITEMS].sort(() => 0.5 - Math.random());
    const nonEPool = [...NON_E_WASTE_ITEMS].sort(() => 0.5 - Math.random()).slice(0, 3);
    const combined = [...ePool, ...nonEPool].sort(() => 0.5 - Math.random());
    setItemsToProcess(combined);
    setActiveItemIndex(0);
    setSelectedItemForTap(combined[0]);
    setScore(0);
    setSortedCount(0);
    setIsCompleted(false);
    setFeedback(null);
  };

  return (
    <div className="max-w-3xl mx-auto pb-28 space-y-4">
      {/* Top Header Controls */}
      <div className="bg-white/80 backdrop-blur-md rounded-3xl p-3 sm:p-4 border border-white shadow-lg flex items-center justify-between gap-3">
        <button
          id="sort-back-button"
          onClick={() => {
            soundManager.playPop();
            setActiveGame(null);
          }}
          className="flex items-center gap-1.5 text-slate-700 bg-white border border-gray-200 px-3.5 py-2 rounded-2xl font-bold text-xs shadow-xs hover:bg-gray-50 active:scale-95 transition-all cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 text-green-700" />
          <span>Geri Dön</span>
        </button>

        {/* Score & Progress */}
        <div className="flex items-center gap-2 sm:gap-3 flex-wrap justify-end">
          {campaignState.isActive && (
            <div className="bg-blue-600 text-white px-3 py-1 rounded-2xl text-[11px] font-black shadow-xs flex items-center gap-1 animate-pulse">
              <span>🌟</span>
              <span>2. Bölüm (2/3)</span>
            </div>
          )}

          <div className="bg-amber-50 text-amber-900 border border-amber-200 px-3.5 py-1.5 rounded-2xl text-xs sm:text-sm font-black flex items-center gap-1.5 shadow-xs">
            <span>⭐</span>
            <span className="font-['Fredoka',sans-serif]">{score} Puan</span>
          </div>

          <div className="bg-blue-50 text-blue-900 border border-blue-200 px-3.5 py-1.5 rounded-2xl text-xs sm:text-sm font-black shadow-xs">
            📦 {activeItemIndex + 1}/{itemsToProcess.length || 1}
          </div>
        </div>
      </div>

      {/* Main Game Arena */}
      <div className="bg-white/70 backdrop-blur-md rounded-[36px] sm:rounded-[40px] border-4 border-white p-5 sm:p-6 shadow-xl relative overflow-hidden select-none">
        {/* Game Title */}
        <div className="text-center bg-white/95 backdrop-blur-md py-2.5 px-4 rounded-3xl border border-green-100 shadow-md max-w-sm mx-auto mb-4">
          <h2 className="font-['Fredoka',sans-serif] font-black text-base sm:text-lg text-green-950">
            🎯 Doğru Geri Dönüşüm Kutusunu Bul!
          </h2>
          <p className="text-xs font-bold text-gray-500 mt-0.5">
            Aşağıdaki eşyayı incele ve gitmesi gereken doğru kutuya dokun!
          </p>
        </div>

        {/* Current Active Item Display */}
        {currentItem && !isCompleted && (
          <div className="my-3 flex flex-col items-center justify-center">
            <div
              id="active-sorting-item"
              className={`w-36 h-36 sm:w-40 sm:h-40 rounded-[32px] bg-white border-4 border-green-400 shadow-xl flex flex-col items-center justify-center p-3 relative transition-transform ${
                wrongShake ? 'animate-wobble border-rose-400 bg-rose-50' : 'hover:scale-105'
              }`}
            >
              <span className="text-6xl sm:text-7xl filter drop-shadow-sm">
                {currentItem.icon}
              </span>
              <span className="font-['Fredoka',sans-serif] font-black text-sm text-slate-800 mt-1 text-center leading-tight">
                {currentItem.name}
              </span>

              {/* Little prompt badge */}
              <span className="absolute -top-2.5 bg-green-600 text-white text-[10px] font-black px-3 py-0.5 rounded-full border-2 border-white shadow-xs uppercase tracking-wider">
                Ayrıştırılacak Nesne
              </span>
            </div>

            <p className="text-xs sm:text-sm font-bold text-slate-700 text-center mt-3 max-w-sm bg-white/90 py-2 px-4 rounded-2xl border border-gray-200 shadow-xs">
              💡 {currentItem.description}
            </p>
          </div>
        )}

        {/* Feedback Message */}
        {feedback && (
          <div
            className={`my-3 py-2.5 px-4 rounded-2xl border-2 shadow-lg text-center text-xs sm:text-sm font-black mx-auto max-w-sm ${
              feedback.isCorrect
                ? 'bg-green-500 text-white border-green-300 animate-bounce'
                : 'bg-orange-400 text-white border-orange-300'
            }`}
          >
            {feedback.text}
          </div>
        )}

        {/* Recycling Bins Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 mt-4">
          {BIN_DEFINITIONS.map((bin) => {
            return (
              <button
                key={bin.id}
                id={`bin-button-${bin.id}`}
                onClick={() => handleBinSelect(bin.id)}
                className={`p-4 rounded-[28px] border-2 ${bin.borderColor} ${bin.bgColor} hover:shadow-xl transition-all active:scale-95 flex flex-col items-center text-center cursor-pointer group shadow-md`}
              >
                <div
                  className={`w-14 h-14 rounded-2xl bg-gradient-to-tr ${bin.color} text-white flex items-center justify-center text-3xl shadow-md group-hover:scale-110 transition-transform`}
                >
                  {bin.icon}
                </div>
                <span className="font-['Fredoka',sans-serif] font-black text-sm sm:text-base text-slate-900 mt-2 line-clamp-1">
                  {bin.shortName}
                </span>
                <span className="text-[11px] text-slate-600 font-bold leading-tight line-clamp-2 mt-0.5">
                  {bin.description}
                </span>
              </button>
            );
          })}
        </div>

        {/* Completion Modal Overlay */}
        {isCompleted && (
          <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-md z-30 flex flex-col items-center justify-center p-6 text-center text-white">
            <div className="w-20 h-20 rounded-[28px] bg-green-400 text-green-950 flex items-center justify-center text-4xl mb-3 animate-bounce shadow-2xl border-4 border-white">
              📦✨
            </div>
            <h3 className="font-['Fredoka',sans-serif] text-2xl sm:text-3xl font-black text-green-300">
              Tüm Eşyalar Ayrıştırıldı!
            </h3>
            <p className="text-xs sm:text-sm font-bold text-slate-200 mt-1.5 max-w-xs leading-relaxed">
              Mükemmel iş! {sortedCount} adet atığı doğru kutulara yerleştirdin ve doğamızı korudun!
            </p>

            {campaignState.isActive ? (
              <div className="flex flex-col gap-2.5 mt-5 w-full max-w-xs">
                <button
                  id="sort-next-stage-btn"
                  onClick={() => handleGameCompleteInCampaign('sort')}
                  className="w-full py-3.5 px-5 rounded-2xl bg-gradient-to-r from-emerald-400 to-green-500 hover:from-emerald-500 hover:to-green-600 text-slate-950 font-['Fredoka',sans-serif] font-black text-sm sm:text-base shadow-xl flex items-center justify-center gap-2 active:scale-95 transition-all cursor-pointer animate-pulse"
                >
                  <span>Sıradaki Bölüme Geç (EKO BULMACA) 🚀</span>
                </button>
                <div className="flex gap-2">
                  <button
                    id="sort-restart-button"
                    onClick={handleRestart}
                    className="flex-1 flex items-center justify-center gap-1.5 bg-white/20 hover:bg-white/30 text-white font-bold text-xs py-2.5 px-3 rounded-xl active:scale-95 transition-all cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Yeniden Oyna</span>
                  </button>
                  <button
                    id="sort-exit-button"
                    onClick={() => {
                      soundManager.playPop();
                      setActiveGame(null);
                    }}
                    className="flex-1 bg-white/10 hover:bg-white/20 text-slate-300 font-bold text-xs py-2.5 px-3 rounded-xl active:scale-95 transition-all cursor-pointer"
                  >
                    Oyun Listesi
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex gap-3 mt-5">
                <button
                  id="sort-restart-button"
                  onClick={handleRestart}
                  className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white font-['Fredoka',sans-serif] font-black text-sm px-5 py-3 rounded-2xl shadow-lg active:scale-95 transition-all cursor-pointer"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Yeniden Oyna</span>
                </button>
                <button
                  id="sort-exit-button"
                  onClick={() => {
                    soundManager.playPop();
                    setActiveGame(null);
                  }}
                  className="bg-white/20 hover:bg-white/30 text-white font-bold text-sm px-5 py-3 rounded-2xl active:scale-95 transition-all cursor-pointer"
                >
                  Oyun Listesi
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Tip for sorting */}
      <div className="bg-white/80 backdrop-blur-md rounded-2xl border border-white p-3.5 text-xs font-bold text-slate-600 flex items-center gap-2.5 shadow-sm">
        <HelpCircle className="w-4 h-4 text-green-600 shrink-0" />
        <span>
          Küçük aletler (telefon, kulaklık, kablo) ile pilleri birbirine karıştırmadan ayrı kutulara bırakmak çok önemlidir!
        </span>
      </div>
    </div>
  );
};
