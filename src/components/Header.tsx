import React from 'react';
import { Volume2, VolumeX, Sparkles, Star, Trophy, RotateCcw, Home, Gamepad2, BookOpen, Trees, Award } from 'lucide-react';
import { useGame } from '../context/GameContext';
import { LEVEL_NAMES, LEVEL_XP_THRESHOLDS } from '../data/badgesData';
import { soundManager } from '../utils/audio';
import { ActiveTab } from '../types';

interface NavItem {
  id: ActiveTab;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: number | string;
}

export const Header: React.FC = () => {
  const { stats, toggleSound, activeTab, setActiveTab, setActiveGame, resetProgress } = useGame();

  const currentLevelName = LEVEL_NAMES[stats.level] || 'EkoKaşif';
  const currentLvlXp = LEVEL_XP_THRESHOLDS[stats.level - 1] || 0;
  const nextLvlXp = LEVEL_XP_THRESHOLDS[stats.level] || 1000;
  const xpInCurrentLevel = Math.max(0, stats.xp - currentLvlXp);
  const xpNeededInCurrentLevel = Math.max(1, nextLvlXp - currentLvlXp);
  const levelProgress = Math.min(100, Math.round((xpInCurrentLevel / xpNeededInCurrentLevel) * 100));

  const navItems: NavItem[] = [
    { id: 'home', label: 'Ana Sayfa', icon: Home },
    { id: 'games', label: 'Oyunlar', icon: Gamepad2 },
    { id: 'cards', label: 'E-Atıklar', icon: BookOpen },
    { id: 'garden', label: 'EkoBahçem', icon: Trees },
    { id: 'badges', label: 'Rozetler', icon: Award, badge: stats.unlockedBadges.length > 0 ? stats.unlockedBadges.length : undefined },
  ];

  const handleTabChange = (tabId: ActiveTab) => {
    soundManager.playPop();
    setActiveTab(tabId);
    if (tabId !== 'games') {
      setActiveGame(null);
    }
  };

  const handleReset = () => {
    if (window.confirm('Tüm oyun puanlarını ve bahçeni sıfırlamak istediğine emin misin?')) {
      resetProgress();
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-white/85 backdrop-blur-xl border-b border-emerald-100 shadow-sm select-none">
      {/* Top Header Row: Logo, Level, Points & Sound */}
      <div className="w-full px-3 sm:px-6 py-2.5">
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-3 flex-wrap sm:flex-nowrap">
          {/* Brand / Logo */}
          <button
            id="header-brand-button"
            onClick={() => {
              soundManager.playPop();
              setActiveTab('home');
              setActiveGame(null);
            }}
            className="flex items-center gap-2.5 sm:gap-3 text-left group transition-transform active:scale-95 cursor-pointer"
          >
            <div className="w-11 h-11 sm:w-13 sm:h-13 bg-teal-500 rounded-2xl flex items-center justify-center shadow-md border-3 sm:border-4 border-teal-400 text-2xl sm:text-3xl group-hover:scale-105 transition-transform shrink-0">
              🌍
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5 flex-wrap">
                <h1 className="text-lg sm:text-2xl font-black text-green-900 tracking-tight leading-none font-['Fredoka',sans-serif]">
                  EKOKAŞİF
                </h1>
                <span className="bg-emerald-600 text-white text-[10px] sm:text-xs font-black px-2 py-0.5 rounded-lg uppercase tracking-wide shadow-xs font-['Fredoka',sans-serif]">
                  E-ATIK
                </span>
              </div>
              <div className="flex items-center gap-1.5 sm:gap-2 mt-1 flex-wrap">
                <span className="bg-green-100 text-green-800 border border-green-200 text-[10px] sm:text-[11px] px-2.5 py-0.5 rounded-full font-black uppercase tracking-wider shadow-xs">
                  Seviye {stats.level}: {currentLevelName}
                </span>
                {stats.userName && (
                  <span className="bg-amber-100 text-amber-900 border border-amber-200 text-[10px] sm:text-[11px] px-2.5 py-0.5 rounded-full font-black tracking-wide shadow-xs flex items-center gap-1">
                    👤 {stats.userName}
                  </span>
                )}
              </div>
            </div>
          </button>

          {/* Level, Points & Sound Controls */}
          <div className="flex items-center gap-1.5 sm:gap-2.5 ml-auto sm:ml-0">
            {/* Level Progress Pill */}
            <button
              id="header-level-badge"
              onClick={() => {
                soundManager.playPop();
                setActiveTab('badges');
                setActiveGame(null);
              }}
              className="hidden xs:flex bg-white/90 backdrop-blur-md px-2.5 sm:px-3 py-1.5 rounded-2xl shadow-xs border border-white items-center gap-2 hover:bg-white transition-all cursor-pointer"
            >
              <span className="text-lg sm:text-xl">🔋</span>
              <div className="flex flex-col text-left">
                <span className="text-[9px] uppercase font-bold text-gray-500 leading-none">İlerleme</span>
                <div className="w-14 sm:w-18 h-1.5 sm:h-2 bg-gray-200 rounded-full mt-1 overflow-hidden">
                  <div
                    className="h-full bg-green-500 rounded-full transition-all duration-500"
                    style={{ width: `${levelProgress}%` }}
                  />
                </div>
              </div>
            </button>

            {/* Points Pill */}
            <div className="bg-white/90 backdrop-blur-md px-2.5 sm:px-3.5 py-1.5 rounded-2xl shadow-xs border border-white flex items-center gap-1.5 sm:gap-2">
              <span className="text-lg sm:text-xl">🌟</span>
              <div className="flex flex-col text-left">
                <span className="text-[9px] uppercase font-bold text-gray-500 leading-none">Puan</span>
                <span className="text-sm sm:text-base font-bold text-green-700 leading-none font-['Fredoka',sans-serif]">
                  {stats.points.toLocaleString()}
                </span>
              </div>
            </div>

            {/* Stars Pill */}
            <div className="bg-white/90 backdrop-blur-md px-2.5 sm:px-3 py-1.5 rounded-2xl shadow-xs border border-white flex items-center gap-1.5">
              <span className="text-base sm:text-lg">✨</span>
              <div className="flex flex-col text-left">
                <span className="text-[9px] uppercase font-bold text-gray-500 leading-none">Yıldız</span>
                <span className="text-sm sm:text-base font-bold text-amber-600 leading-none font-['Fredoka',sans-serif]">
                  {stats.stars}
                </span>
              </div>
            </div>

            {/* Sound Toggle */}
            <button
              id="header-sound-toggle"
              onClick={toggleSound}
              aria-label="Ses Aç/Kapat"
              title={stats.soundEnabled ? 'Sesi Kapat' : 'Sesi Aç'}
              className="w-9 h-9 sm:w-10 sm:h-10 bg-white/90 rounded-2xl shadow-xs border border-white flex items-center justify-center text-lg hover:bg-white transition-transform active:scale-90 cursor-pointer"
            >
              {stats.soundEnabled ? (
                <Volume2 className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
              ) : (
                <VolumeX className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
              )}
            </button>

            {/* Reset button (replay) */}
            <button
              id="header-reset-button"
              onClick={handleReset}
              aria-label="Oyunu Sıfırla"
              title="İlerlemeyi Sıfırla"
              className="w-9 h-9 hidden md:flex items-center justify-center rounded-2xl bg-white/70 hover:bg-white border border-white text-gray-400 hover:text-red-500 transition-colors shadow-xs cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Horizontal Navigation Menu: 100% width, directly beneath title */}
      <nav
        id="top-main-navigation-menu"
        aria-label="Ana Menü"
        className="w-full bg-white/95 border-t border-emerald-100 shadow-xs px-2 sm:px-4 py-1.5"
      >
        <div className="w-full max-w-4xl mx-auto grid grid-cols-5 gap-1 sm:gap-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                id={`top-nav-button-${item.id}`}
                onClick={() => handleTabChange(item.id)}
                className={`w-full flex items-center justify-center gap-1 sm:gap-2 py-2 px-1 sm:px-3 rounded-xl sm:rounded-2xl transition-all duration-200 cursor-pointer relative select-none ${
                  isActive
                    ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30 scale-[1.02]'
                    : 'text-slate-600 hover:text-emerald-800 hover:bg-emerald-50/70 font-bold'
                }`}
              >
                <div className="relative shrink-0 flex items-center justify-center">
                  <Icon className={`w-4 h-4 sm:w-5 sm:h-5 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                  {item.badge !== undefined && (
                    <span className="absolute -top-1.5 -right-2 bg-amber-500 text-white text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center border border-white shadow-xs">
                      {item.badge}
                    </span>
                  )}
                </div>
                <span
                  className={`text-[10px] sm:text-xs tracking-tight whitespace-nowrap font-['Fredoka',sans-serif] ${
                    isActive ? 'font-black text-white' : 'font-bold'
                  }`}
                >
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </nav>
    </header>
  );
};
