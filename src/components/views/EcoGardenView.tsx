import React, { useState } from 'react';
import { Sparkles, Trees, Sun, Moon, Lock, Check, PlusCircle, Heart } from 'lucide-react';
import { useGame } from '../../context/GameContext';
import { GARDEN_ITEMS } from '../../data/gardenData';
import { GardenItem } from '../../types';
import { soundManager } from '../../utils/audio';

export const EcoGardenView: React.FC = () => {
  const { stats, unlockGardenItem, showToast } = useGame();
  const [isNightMode, setIsNightMode] = useState(false);

  const unlockedCount = stats.unlockedGardenItems.length;
  const totalItems = GARDEN_ITEMS.length;
  const gardenProgress = Math.round((unlockedCount / totalItems) * 100);

  const handleUnlockClick = (item: GardenItem) => {
    soundManager.playPop();
    if (stats.unlockedGardenItems.includes(item.id)) {
      showToast(`${item.name} zaten bahçende neşeyle yaşıyor! 🌿`, 'info');
      return;
    }

    if (stats.level < item.requiredLevel) {
      showToast(`Bu güzellik için Seviye ${item.requiredLevel} olmalısın! 🌱`, 'info');
      soundManager.playWrong();
      return;
    }

    unlockGardenItem(item.id, item.cost);
  };

  const handleInteractiveGardenElementClick = (item: GardenItem) => {
    soundManager.playTwinkle();
    showToast(`${item.name}: ${item.description}`, 'star');
  };

  return (
    <div className="max-w-3xl mx-auto pb-12 space-y-4">
      {/* Top Garden Control Bar */}
      <div className="bg-white/80 backdrop-blur-md rounded-3xl p-3 sm:p-4 border border-white shadow-lg flex items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="font-['Fredoka',sans-serif] text-xl sm:text-2xl font-black text-green-950">
              Sanal EkoBahçem
            </h2>
            <span className="bg-green-100 text-green-800 text-xs font-black px-2.5 py-0.5 rounded-full border border-green-200">
              %{gardenProgress} Canlandı
            </span>
          </div>
          <p className="text-xs font-bold text-gray-500 mt-0.5">
            E-atıkları dönüştürdükçe doğa çiçek açıyor ve canlanıyor!
          </p>
        </div>

        {/* Day / Night Sky Toggle */}
        <button
          id="garden-sky-toggle"
          onClick={() => {
            soundManager.playPop();
            setIsNightMode(!isNightMode);
          }}
          title={isNightMode ? 'Gündüz Modu' : 'Yıldızlı Gece Modu'}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-2xl border-2 text-xs font-black transition-all active:scale-95 cursor-pointer shadow-sm ${
            isNightMode
              ? 'bg-slate-900 border-indigo-500 text-amber-300'
              : 'bg-amber-100 border-amber-300 text-amber-950'
          }`}
        >
          {isNightMode ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4 text-amber-500" />}
          <span>{isNightMode ? 'Gece' : 'Gündüz'}</span>
        </button>
      </div>

      {/* Interactive Virtual Garden Landscape Canvas Box */}
      <div
        id="virtual-garden-canvas"
        className={`relative w-full h-[320px] sm:h-[380px] rounded-[36px] sm:rounded-[40px] border-4 shadow-xl overflow-hidden select-none transition-colors duration-700 ${
          isNightMode
            ? 'bg-gradient-to-b from-slate-950 via-indigo-950 to-emerald-950 border-indigo-400'
            : 'bg-gradient-to-b from-sky-300 via-sky-100 to-emerald-200 border-white'
        }`}
      >
        {/* Sky Elements: Sun or Moon & Stars */}
        {isNightMode ? (
          <div className="absolute top-4 right-8 pointer-events-none">
            <span className="text-4xl animate-pulse">🌙</span>
            <div className="absolute -left-12 top-2 text-xs text-amber-200">✨</div>
            <div className="absolute -left-28 top-6 text-sm text-amber-200">⭐</div>
            <div className="absolute -left-44 top-1 text-xs text-amber-200">✨</div>
          </div>
        ) : (
          <div className="absolute top-4 right-8 pointer-events-none">
            <span className="text-5xl animate-spin-slow">☀️</span>
            <div className="absolute -left-24 top-2 text-3xl opacity-70">☁️</div>
            <div className="absolute -left-56 top-8 text-3xl opacity-60">☁️</div>
          </div>
        )}

        {/* Rolling Green Hills Background */}
        <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-emerald-600 to-emerald-400 rounded-t-[120px] pointer-events-none opacity-95" />
        <div className="absolute bottom-0 left-[-10%] right-[-10%] h-28 bg-gradient-to-t from-emerald-700 to-emerald-500 rounded-t-[100px] pointer-events-none" />

        {/* Empty Garden Placeholder when no items unlocked */}
        {unlockedCount === 0 && (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4 z-10 bg-black/10 backdrop-blur-xs">
            <div className="w-16 h-16 rounded-3xl bg-white/95 flex items-center justify-center text-3xl mb-2 shadow-lg animate-bounce border-2 border-white">
              🌱
            </div>
            <h4 className="font-['Fredoka',sans-serif] text-lg font-black text-slate-800">
              Bahçen Henüz Bomboş!
            </h4>
            <p className="text-xs font-bold text-slate-700 max-w-xs mt-0.5 leading-relaxed">
              Aşağıdaki katalogdan kazandığın EkoPuanlarla çiçekler, ağaçlar ve sevimli hayvanlar ekleyebilirsin!
            </p>
          </div>
        )}

        {/* Render Unlocked Garden Items */}
        {GARDEN_ITEMS.map((item) => {
          const isUnlocked = stats.unlockedGardenItems.includes(item.id);
          if (!isUnlocked) return null;

          return (
            <button
              key={item.id}
              id={`garden-element-${item.id}`}
              onClick={() => handleInteractiveGardenElementClick(item)}
              style={{
                left: `${item.position.x}%`,
                top: `${item.position.y}%`,
              }}
              title={item.name}
              className="absolute z-20 -translate-x-1/2 -translate-y-1/2 p-2 transition-transform hover:scale-130 active:scale-90 cursor-pointer group"
            >
              <div className="text-4xl sm:text-5xl filter drop-shadow-md group-hover:animate-bounce">
                {item.icon}
              </div>
              <span className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-white/95 backdrop-blur-xs text-slate-800 text-[10px] font-black px-2 py-0.5 rounded-lg shadow-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none font-['Fredoka',sans-serif]">
                {item.name}
              </span>
            </button>
          );
        })}
      </div>

      {/* Garden Unlockable Catalog Section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-['Fredoka',sans-serif] text-lg sm:text-xl font-black text-green-950 flex items-center gap-2">
            <span>🌿</span>
            <span>Bahçe Genişletme Kataloğu</span>
          </h3>
          <div className="text-xs font-black text-slate-700 bg-white/90 border border-white px-3 py-1.5 rounded-2xl shadow-xs">
            Mevcut Puanın: <span className="text-amber-600">⭐ {stats.points}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {GARDEN_ITEMS.map((item) => {
            const isUnlocked = stats.unlockedGardenItems.includes(item.id);
            const canAfford = stats.points >= item.cost;
            const meetsLevel = stats.level >= item.requiredLevel;

            return (
              <div
                key={item.id}
                className={`p-3.5 rounded-3xl border-2 flex items-center justify-between gap-3 transition-all ${
                  isUnlocked
                    ? 'bg-green-50/90 border-green-300 text-green-950 shadow-xs'
                    : meetsLevel
                    ? 'bg-white/80 backdrop-blur-md border-white hover:border-green-300 shadow-sm'
                    : 'bg-slate-100/80 border-gray-200 opacity-60'
                }`}
              >
                {/* Icon & Details */}
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-14 h-14 rounded-2xl bg-white border border-gray-100 flex items-center justify-center text-3xl shrink-0 shadow-xs">
                    {item.icon}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <h4 className="font-['Fredoka',sans-serif] font-black text-sm text-slate-900 truncate">
                        {item.name}
                      </h4>
                      {!isUnlocked && (
                        <span className="text-[9px] bg-slate-200 text-slate-700 font-black px-1.5 py-0.2 rounded-full">
                          Lvl {item.requiredLevel}
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-500 font-bold line-clamp-1 mt-0.5">
                      {item.description}
                    </p>
                    {!isUnlocked && (
                      <span className="text-xs font-black text-amber-600">
                        ⭐ {item.cost} Puan
                      </span>
                    )}
                  </div>
                </div>

                {/* Unlock / Done Action */}
                <div>
                  {isUnlocked ? (
                    <span className="flex items-center gap-1 text-xs font-black text-green-700 bg-green-100 px-3 py-1.5 rounded-xl whitespace-nowrap border border-green-200">
                      <Check className="w-3.5 h-3.5" />
                      Bahçede
                    </span>
                  ) : !meetsLevel ? (
                    <span className="flex items-center gap-1 text-[11px] font-bold text-slate-400 bg-slate-200 px-2.5 py-1.5 rounded-xl whitespace-nowrap">
                      <Lock className="w-3 h-3" />
                      Seviye {item.requiredLevel}
                    </span>
                  ) : (
                    <button
                      id={`unlock-garden-btn-${item.id}`}
                      onClick={() => handleUnlockClick(item)}
                      disabled={!canAfford}
                      className={`flex items-center gap-1 px-3.5 py-2 rounded-2xl font-['Fredoka',sans-serif] font-black text-xs shadow-xs transition-all active:scale-95 whitespace-nowrap cursor-pointer ${
                        canAfford
                          ? 'bg-green-500 hover:bg-green-600 text-white shadow-green-500/20'
                          : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                      }`}
                    >
                      <PlusCircle className="w-3.5 h-3.5" />
                      Aç ({item.cost})
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
