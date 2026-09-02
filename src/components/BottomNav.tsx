import React from 'react';
import { Home, Gamepad2, BookOpen, Trees, Award } from 'lucide-react';
import { useGame } from '../context/GameContext';
import { ActiveTab } from '../types';
import { soundManager } from '../utils/audio';

interface NavItem {
  id: ActiveTab;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: number | string;
}

export const BottomNav: React.FC = () => {
  const { activeTab, setActiveTab, setActiveGame, stats } = useGame();

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

  return (
    <nav
      id="bottom-navigation-bar"
      aria-label="Ana Menü"
      className="fixed bottom-3 left-3 right-3 sm:bottom-5 sm:left-6 sm:right-6 z-40 max-w-lg mx-auto select-none"
    >
      <div className="bg-white/90 backdrop-blur-xl rounded-[32px] shadow-2xl border border-white/60 flex items-center justify-around px-2 sm:px-4 py-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              id={`nav-button-${item.id}`}
              onClick={() => handleTabChange(item.id)}
              className={`flex-1 flex flex-col items-center justify-center py-1 px-1 sm:px-2 rounded-2xl transition-all duration-200 cursor-pointer relative ${
                isActive
                  ? 'text-green-800 font-black'
                  : 'text-gray-400 hover:text-green-600 font-bold transition-colors'
              }`}
            >
              <div className="relative">
                <div
                  className={`p-1.5 rounded-2xl transition-all ${
                    isActive
                      ? 'bg-green-500 text-white shadow-lg shadow-green-400/40 -translate-y-1'
                      : 'bg-transparent'
                  }`}
                >
                  <Icon className="w-5 h-5 sm:w-5.5 sm:h-5.5" />
                </div>
                {item.badge !== undefined && (
                  <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center border-2 border-white shadow-xs">
                    {item.badge}
                  </span>
                )}
              </div>
              <span
                className={`text-[10px] sm:text-[11px] uppercase tracking-wider mt-0.5 whitespace-nowrap ${
                  isActive ? 'font-black text-green-800' : 'font-bold'
                }`}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
