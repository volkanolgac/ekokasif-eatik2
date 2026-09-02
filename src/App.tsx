/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect } from 'react';
import { GameProvider, useGame } from './context/GameContext';
import { Header } from './components/Header';
import { HomeView } from './components/views/HomeView';
import { GamesHubView } from './components/views/GamesHubView';
import { EWasteCardsView } from './components/views/EWasteCardsView';
import { EcoGardenView } from './components/views/EcoGardenView';
import { BadgesView } from './components/views/BadgesView';
import { OnboardingModal } from './components/OnboardingModal';
import { LevelUpModal } from './components/LevelUpModal';
import { BadgeUnlockedModal } from './components/BadgeUnlockedModal';
import { CampaignModals } from './components/CampaignModals';
import { Toast } from './components/Toast';

const MainAppContent: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    activeGame,
    setActiveGame,
    newBadgeUnlocked,
    clearNewBadge,
    levelUpNotification,
    clearLevelUp,
    openCertificateDirectly,
    setOpenCertificateDirectly,
  } = useGame();

  useEffect(() => {
    (window as unknown as { handleAndroidBack: () => boolean }).handleAndroidBack = () => {
      if (newBadgeUnlocked) {
        clearNewBadge();
        return true;
      }
      if (levelUpNotification !== null) {
        clearLevelUp();
        return true;
      }
      if (openCertificateDirectly) {
        setOpenCertificateDirectly(false);
        return true;
      }
      if (activeGame !== null) {
        setActiveGame(null);
        return true;
      }
      if (activeTab !== 'home') {
        setActiveTab('home');
        return true;
      }
      return false;
    };

    return () => {
      delete (window as unknown as { handleAndroidBack?: () => boolean }).handleAndroidBack;
    };
  }, [
    activeTab,
    setActiveTab,
    activeGame,
    setActiveGame,
    newBadgeUnlocked,
    clearNewBadge,
    levelUpNotification,
    clearLevelUp,
    openCertificateDirectly,
    setOpenCertificateDirectly,
  ]);

  const renderActiveView = () => {
    switch (activeTab) {
      case 'games':
        return <GamesHubView />;
      case 'cards':
        return <EWasteCardsView />;
      case 'garden':
        return <EcoGardenView />;
      case 'badges':
        return <BadgesView />;
      case 'home':
      default:
        return <HomeView />;
    }
  };

  return (
    <div className="min-h-screen bg-[#E8F5E9] text-slate-800 flex flex-col font-['Nunito',sans-serif] relative select-none">
      {/* Sleek Dot Grid Subtle Overlay from theme */}
      <div className="fixed inset-0 opacity-10 sleek-dot-grid pointer-events-none z-0" />

      {/* Top Persistent Header & Full-Width Sticky Navigation */}
      <Header />

      {/* Main Dynamic View Content */}
      <main className="flex-1 w-full max-w-4xl mx-auto pt-4 pb-12 px-2 sm:px-4 relative z-10">
        {renderActiveView()}
      </main>

      {/* Popups & Notifications */}
      <OnboardingModal />
      <LevelUpModal />
      <BadgeUnlockedModal />
      <CampaignModals />
      <Toast />
    </div>
  );
};

export default function App() {
  return (
    <GameProvider>
      <MainAppContent />
    </GameProvider>
  );
}
