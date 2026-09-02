import React, { useState, useEffect, useCallback, useRef } from 'react';
import { ArrowLeft, Sparkles, Trophy, RotateCcw, Volume2, CheckCircle2, AlertCircle, Award, Compass } from 'lucide-react';
import { useGame } from '../../context/GameContext';
import { E_WASTE_ITEMS, NON_E_WASTE_ITEMS } from '../../data/eWasteData';
import { EWasteItem } from '../../types';
import { soundManager } from '../../utils/audio';
import { triggerStarConfetti } from '../../utils/confetti';

interface SpawnedItem {
  uid: string;
  item: EWasteItem;
  x: number; // percentage
  y: number;
  rotation: number;
  scale: number;
  isCollected?: boolean;
}

export const EWasteHuntGame: React.FC = () => {
  const { setActiveGame, recordEWasteFound, showToast, campaignState, handleGameCompleteInCampaign } = useGame();
  const [itemsOnScreen, setItemsOnScreen] = useState<SpawnedItem[]>([]);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [round, setRound] = useState(1);
  const roundRef = useRef(1);
  const TOTAL_ROUNDS = 3;
  const [feedback, setFeedback] = useState<{ text: string; isCorrect: boolean } | null>(null);
  const [gameTime, setGameTime] = useState(45);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isGameWon, setIsGameWon] = useState(false);
  const [collectedItemsList, setCollectedItemsList] = useState<EWasteItem[]>([]);
  const isTransitioningRef = useRef(false);

  const spawnItemsBatch = useCallback(() => {
    const newItems: SpawnedItem[] = [];
    const shuffledEWaste = [...E_WASTE_ITEMS].sort(() => 0.5 - Math.random());
    const shuffledNonE = [...NON_E_WASTE_ITEMS].sort(() => 0.5 - Math.random());

    // Ensure 3 e-waste items and 3 non-e-waste items per round
    const selected: EWasteItem[] = [
      shuffledEWaste[0],
      shuffledEWaste[1],
      shuffledEWaste[2],
      shuffledNonE[0],
      shuffledNonE[1],
      shuffledNonE[2] || shuffledEWaste[3],
    ].sort(() => 0.5 - Math.random());

    const slots = [
      { x: 20, y: 22 },
      { x: 50, y: 18 },
      { x: 80, y: 24 },
      { x: 22, y: 64 },
      { x: 50, y: 70 },
      { x: 78, y: 62 },
    ];

    selected.forEach((item, idx) => {
      const slot = slots[idx];
      const jitterX = (Math.random() - 0.5) * 6;
      const jitterY = (Math.random() - 0.5) * 6;
      newItems.push({
        uid: `${item.id}_${Date.now()}_${idx}`,
        item,
        x: Math.max(12, Math.min(88, slot.x + jitterX)),
        y: Math.max(16, Math.min(80, slot.y + jitterY)),
        rotation: (Math.random() - 0.5) * 16,
        scale: 0.95 + Math.random() * 0.15,
        isCollected: false,
      });
    });

    setItemsOnScreen(newItems);
    isTransitioningRef.current = false;
  }, []);

  useEffect(() => {
    roundRef.current = 1;
    setRound(1);
    spawnItemsBatch();
  }, [spawnItemsBatch]);

  useEffect(() => {
    if (isGameOver) return;
    const timer = setInterval(() => {
      setGameTime((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setIsGameOver(true);
          setIsGameWon(false);
          soundManager.playLevelUp();
          triggerStarConfetti();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isGameOver]);

  const handleFinishGame = useCallback(() => {
    setIsGameOver(true);
    setIsGameWon(true);
    soundManager.playLevelUp();
    triggerStarConfetti();
  }, []);

  const handleItemClick = (spawned: SpawnedItem) => {
    if (spawned.isCollected || isGameOver || isTransitioningRef.current) return;

    if (spawned.item.isEWaste) {
      soundManager.playSuccess();
      triggerStarConfetti();
      recordEWasteFound();
      setScore((prev) => prev + 10 + combo * 2);
      setCombo((prev) => prev + 1);
      setFeedback({
        text: `Harika! ${spawned.item.name} bir e-atıktır! +10 Puan ✨`,
        isCorrect: true,
      });
      setCollectedItemsList((prev) => [...prev, spawned.item]);

      const updated = itemsOnScreen.map((it) =>
        it.uid === spawned.uid ? { ...it, isCollected: true } : it
      );
      setItemsOnScreen(updated);

      const remainingEWaste = updated.filter((it) => it.item.isEWaste && !it.isCollected);

      // If all e-waste items in current round are collected
      if (remainingEWaste.length === 0) {
        isTransitioningRef.current = true;
        const currentRound = roundRef.current;

        if (currentRound >= TOTAL_ROUNDS) {
          // Exactly after 3 rounds, end game!
          setTimeout(() => {
            handleFinishGame();
          }, 600);
        } else {
          // Advance to next round cleanly
          const nextRound = currentRound + 1;
          roundRef.current = nextRound;
          setTimeout(() => {
            setRound(nextRound);
            spawnItemsBatch();
            soundManager.playSuccess();
            setFeedback({
              text: `🌟 ${currentRound}. Tur Bitti! ${nextRound}. Tur Başladı!`,
              isCorrect: true,
            });
          }, 600);
        }
      }
    } else {
      soundManager.playWrong();
      setCombo(0);
      setFeedback({
        text: `Tekrar dene! ${spawned.item.name} bir e-atık değildir.`,
        isCorrect: false,
      });
      showToast(`${spawned.item.name} elektronik değildir 🌱`, 'info');
    }

    setTimeout(() => {
      setFeedback((prev) => (prev?.text.includes(spawned.item.name) ? null : prev));
    }, 2200);
  };

  const handleRestart = () => {
    soundManager.playPop();
    roundRef.current = 1;
    isTransitioningRef.current = false;
    setScore(0);
    setCombo(0);
    setRound(1);
    setGameTime(45);
    setIsGameOver(false);
    setIsGameWon(false);
    setCollectedItemsList([]);
    setFeedback(null);
    spawnItemsBatch();
  };

  return (
    <div className="max-w-3xl mx-auto pb-28 space-y-4">
      {/* Top Controls Bar */}
      <div className="bg-white/80 backdrop-blur-md rounded-3xl p-3 sm:p-4 border border-white shadow-lg flex items-center justify-between gap-3">
        <button
          id="hunt-back-button"
          onClick={() => {
            soundManager.playPop();
            setActiveGame(null);
          }}
          className="flex items-center gap-1.5 text-slate-700 bg-white border border-gray-200 px-3.5 py-2 rounded-2xl font-bold text-xs shadow-xs hover:bg-gray-50 active:scale-95 transition-all cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 text-green-700" />
          <span>Geri Dön</span>
        </button>

        {/* Score, Wave & Time */}
        <div className="flex items-center gap-2 sm:gap-3 flex-wrap justify-end">
          {campaignState.isActive && (
            <div className="bg-emerald-500 text-white px-3 py-1 rounded-2xl text-[11px] font-black shadow-xs flex items-center gap-1 animate-pulse">
              <span>🌟</span>
              <span>1. Bölüm (1/3)</span>
            </div>
          )}

          <div className="bg-amber-50 text-amber-900 border border-amber-200 px-3.5 py-1.5 rounded-2xl text-xs sm:text-sm font-black flex items-center gap-1.5 shadow-xs">
            <span>⭐</span>
            <span className="font-['Fredoka',sans-serif]">{score} Puan</span>
          </div>

          <div className="bg-purple-50 text-purple-900 border border-purple-200 px-3 sm:px-3.5 py-1.5 rounded-2xl text-xs sm:text-sm font-black shadow-xs flex items-center gap-1">
            <span>🎯</span>
            <span className="font-['Fredoka',sans-serif]">Tur {round}/{TOTAL_ROUNDS}</span>
          </div>

          {combo > 1 && (
            <span className="bg-orange-500 text-white px-2.5 py-1 rounded-xl text-[10px] sm:text-xs font-black shadow-xs animate-bounce hidden sm:inline-block">
              🔥 x{combo}
            </span>
          )}

          {/* Time Remaining */}
          <div
            className={`px-3 sm:px-4 py-1.5 rounded-2xl text-xs sm:text-sm font-black border shadow-xs ${
              gameTime < 10
                ? 'bg-rose-50 text-rose-700 border-rose-300 animate-pulse'
                : 'bg-green-50 text-green-800 border-green-200'
            }`}
          >
            ⏱️ {gameTime}s
          </div>
        </div>
      </div>

      {/* Game Stage Canvas Card */}
      <div className="bg-white/70 backdrop-blur-md rounded-[36px] sm:rounded-[40px] border-4 border-white p-4 sm:p-6 shadow-xl relative overflow-hidden min-h-[420px] sm:min-h-[460px] flex flex-col justify-between select-none">
        {/* Subtle Ambient Shapes */}
        <div className="absolute top-2 left-6 text-3xl opacity-40 animate-pulse pointer-events-none">☁️</div>
        <div className="absolute top-8 right-10 text-3xl opacity-30 pointer-events-none">☁️</div>
        <div className="absolute bottom-2 left-0 right-0 text-center text-xs text-green-800/40 font-bold pointer-events-none">
          🌿 🌾 🌿 🌾 🌿 🌾 🌿 🌾 🌿 🌾 🌿 🌾 🌿
        </div>

        {/* Header Instruction */}
        <div className="text-center bg-white/95 backdrop-blur-md py-2.5 px-4 rounded-3xl border border-green-100 shadow-md max-w-sm mx-auto z-10">
          <div className="inline-flex items-center gap-1.5 bg-green-100 text-green-800 text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider mb-1">
            <span>3 Turdan Oluşan E-Atık Avı</span>
            <span>•</span>
            <span>Tur {round} / {TOTAL_ROUNDS}</span>
          </div>
          <h2 className="font-['Fredoka',sans-serif] font-black text-base sm:text-lg text-green-950 flex items-center justify-center gap-1.5">
            <Compass className="w-5 h-5 text-emerald-600" />
            <span>E-Atıkları Bul ve Dokun!</span>
          </h2>
          <p className="text-xs font-bold text-gray-500 mt-0.5">
            Eski telefon, el feneri, şarj kablosu, pil gibi elektronik eşyaları topla.
          </p>
        </div>

        {/* Interactive Floating Items Field */}
        <div className="relative flex-1 w-full h-[280px] sm:h-[320px] my-2">
          {itemsOnScreen.map((spawned) => {
            if (spawned.isCollected) return null;

            return (
              <button
                key={spawned.uid}
                id={`hunt-item-${spawned.item.id}`}
                onClick={() => handleItemClick(spawned)}
                style={{
                  left: `${spawned.x}%`,
                  top: `${spawned.y}%`,
                  transform: `translate(-50%, -50%) rotate(${spawned.rotation}deg) scale(${spawned.scale})`,
                }}
                className="absolute z-10 flex flex-col items-center group transition-all active:scale-125 cursor-pointer hover:z-20"
              >
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-[26px] bg-white border-3 border-green-300 shadow-lg flex items-center justify-center text-3xl sm:text-4xl group-hover:scale-110 group-hover:border-amber-400 group-hover:shadow-amber-400/40 transition-all">
                  <span>{spawned.item.icon}</span>
                </div>
                <span className="mt-1.5 bg-white/95 text-slate-800 text-[10px] sm:text-xs font-black px-2.5 py-0.5 rounded-xl border border-gray-200 shadow-xs whitespace-nowrap font-['Fredoka',sans-serif]">
                  {spawned.item.name}
                </span>
              </button>
            );
          })}
        </div>

        {/* Gentle Feedback Banner */}
        {feedback && (
          <div
            className={`z-20 py-2.5 px-4 rounded-2xl border-2 shadow-lg text-center text-xs sm:text-sm font-black animate-bounce mx-auto max-w-sm ${
              feedback.isCorrect
                ? 'bg-green-500 text-white border-green-300'
                : 'bg-orange-400 text-white border-orange-300'
            }`}
          >
            {feedback.text}
          </div>
        )}

        {/* Game Over / Victory Screen Overlay */}
        {isGameOver && (
          <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-md z-30 flex flex-col items-center justify-center p-6 text-center text-white">
            <div className="w-20 h-20 rounded-[28px] bg-amber-400 text-amber-950 flex items-center justify-center text-4xl mb-3 animate-bounce shadow-2xl border-4 border-white">
              {isGameWon ? '🏆' : '⏱️'}
            </div>
            <h3 className="font-['Fredoka',sans-serif] text-2xl sm:text-3xl font-black text-amber-300">
              {isGameWon ? 'Tebrikler! 3 Turu Tamamladın!' : 'Süre Doldu! Harika Av!'}
            </h3>
            <p className="text-xs sm:text-sm font-bold text-slate-200 mt-1.5 max-w-xs leading-relaxed">
              {isGameWon
                ? `Muhteşem bir başarı! 3 turu başarıyla tamamladın, toplam ${collectedItemsList.length} adet e-atık toplayıp ${score} puan kazandın!`
                : `Bu turda toplam ${collectedItemsList.length} adet e-atık topladın ve ${score} puan kazandın!`}
            </p>

            {campaignState.isActive ? (
              <div className="flex flex-col gap-2.5 mt-5 w-full max-w-xs">
                <button
                  id="hunt-next-stage-btn"
                  onClick={() => handleGameCompleteInCampaign('hunt')}
                  className="w-full py-3.5 px-5 rounded-2xl bg-gradient-to-r from-emerald-400 to-green-500 hover:from-emerald-500 hover:to-green-600 text-slate-950 font-['Fredoka',sans-serif] font-black text-sm sm:text-base shadow-xl flex items-center justify-center gap-2 active:scale-95 transition-all cursor-pointer animate-pulse"
                >
                  <span>Sıradaki Bölüme Geç (DOĞRU KUTU) 🚀</span>
                </button>
                <div className="flex gap-2">
                  <button
                    id="hunt-restart-button"
                    onClick={handleRestart}
                    className="flex-1 flex items-center justify-center gap-1.5 bg-white/20 hover:bg-white/30 text-white font-bold text-xs py-2.5 px-3 rounded-xl active:scale-95 transition-all cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Tekrar Oyna</span>
                  </button>
                  <button
                    id="hunt-exit-button"
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
                  id="hunt-restart-button"
                  onClick={handleRestart}
                  className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white font-['Fredoka',sans-serif] font-black text-sm px-5 py-3 rounded-2xl shadow-lg active:scale-95 transition-all cursor-pointer"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Tekrar Oyna</span>
                </button>
                <button
                  id="hunt-exit-button"
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

      {/* Educational Quick Tip */}
      <div className="bg-white/80 backdrop-blur-md rounded-2xl border border-white p-3.5 text-xs font-bold text-slate-600 flex items-center gap-2.5 shadow-sm">
        <Sparkles className="w-4 h-4 text-amber-500 shrink-0" />
        <span>
          İpucu: Elektrikle, pille veya şarjla çalışan her eşya kullanım ömrü bittiğinde bir <strong className="text-green-700">Elektronik Atık</strong> olur!
        </span>
      </div>
    </div>
  );
};
