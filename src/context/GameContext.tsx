import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { DailyQuest, UserStats, ActiveTab, GameMode, CampaignState, CampaignStepInfo } from '../types';
import { BADGES, LEVEL_XP_THRESHOLDS } from '../data/badgesData';
import { soundManager } from '../utils/audio';
import { triggerLevelUpCelebration, triggerStarConfetti } from '../utils/confetti';

export const CAMPAIGN_STEPS: CampaignStepInfo[] = [
  {
    gameMode: 'hunt',
    stageNumber: 1,
    totalStages: 3,
    title: 'E-ATIK AVI',
    subtitle: 'Çevrendeki elektronik atıkları bul ve keşfet!',
    badge: '1. Bölüm • Refleks & Dikkat',
    icon: '🎮',
    themeColor: 'from-orange-500 to-amber-500',
  },
  {
    gameMode: 'sort',
    stageNumber: 2,
    totalStages: 3,
    title: 'DOĞRU KUTU',
    subtitle: 'Pilleri ve cihazları doğru geri dönüşüm kutusuna bırak!',
    badge: '2. Bölüm • Beceri & Ayrıştırma',
    icon: '📦',
    themeColor: 'from-blue-500 to-cyan-500',
  },
  {
    gameMode: 'quiz',
    stageNumber: 3,
    totalStages: 3,
    title: 'EKO BULMACA',
    subtitle: 'Eğlenceli çevre sorularını çöz ve bilgini göster!',
    badge: '3. Bölüm • Bilgi & Sınav',
    icon: '🧩',
    themeColor: 'from-purple-500 to-pink-500',
  },
];

interface GameContextType {
  stats: UserStats;
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  activeGame: GameMode;
  setActiveGame: (game: GameMode) => void;
  campaignState: CampaignState;
  startCampaign: () => void;
  handleGameCompleteInCampaign: (completedMode: 'hunt' | 'sort' | 'quiz') => void;
  proceedToNextCampaignStep: () => void;
  claimDiplomaFromVictory: () => void;
  cancelCampaign: () => void;
  openCertificateDirectly: boolean;
  setOpenCertificateDirectly: (val: boolean) => void;
  addPointsAndXp: (points: number, stars?: number, xpBonus?: number, reason?: string) => void;
  recordEWasteFound: () => void;
  recordItemSorted: (isBattery?: boolean) => void;
  recordQuizCorrect: () => void;
  unlockGardenItem: (itemId: string, cost: number) => boolean;
  claimDailyQuest: (questId: string) => void;
  toggleSound: () => void;
  completeOnboarding: (userName?: string) => void;
  setUserName: (name: string) => void;
  newBadgeUnlocked: string | null;
  clearNewBadge: () => void;
  levelUpNotification: number | null;
  clearLevelUp: () => void;
  toastMessage: { text: string; type: 'success' | 'info' | 'star' } | null;
  showToast: (text: string, type?: 'success' | 'info' | 'star') => void;
  resetProgress: () => void;
}

const STORAGE_KEY = 'ekokasif_game_data_v1';

const getInitialDailyQuests = (): DailyQuest[] => [
  {
    id: 'q_identify',
    title: '5 E-Atık Keşfet veya Avla',
    icon: '🔍',
    current: 0,
    target: 5,
    rewardPoints: 40,
    rewardStars: 2,
    completed: false,
    claimed: false,
    type: 'identify',
  },
  {
    id: 'q_sort',
    title: '3 E-Atığı Doğru Kutuya Bırak',
    icon: '📦',
    current: 0,
    target: 3,
    rewardPoints: 50,
    rewardStars: 2,
    completed: false,
    claimed: false,
    type: 'sort',
  },
  {
    id: 'q_quiz',
    title: '1 Eko Bulmaca Sorusunu Doğru Bil',
    icon: '🧠',
    current: 0,
    target: 1,
    rewardPoints: 30,
    rewardStars: 1,
    completed: false,
    claimed: false,
    type: 'quiz',
  },
];

const defaultStats: UserStats = {
  userName: '',
  points: 0,
  stars: 3,
  level: 1,
  xp: 0,
  nextLevelXp: 100,
  eWasteFound: 0,
  itemsSorted: 0,
  batteriesSorted: 0,
  quizCorrect: 0,
  unlockedGardenItems: [],
  unlockedBadges: [],
  monsterCleanliness: 10,
  dailyQuests: getInitialDailyQuests(),
  lastQuestDate: new Date().toDateString(),
  soundEnabled: true,
  hasSeenOnboarding: false,
};

const GameContext = createContext<GameContextType | undefined>(undefined);

const initialCampaignState: CampaignState = {
  isActive: false,
  currentStepIndex: 0,
  completedSteps: [],
  isTransitionOpen: false,
  completedGameName: '',
  nextGameInfo: null,
  isVictoryOpen: false,
};

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [stats, setStats] = useState<UserStats>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        // Check if date changed for daily quests
        const today = new Date().toDateString();
        if (parsed.lastQuestDate !== today) {
          parsed.dailyQuests = getInitialDailyQuests();
          parsed.lastQuestDate = today;
        }
        return { ...defaultStats, ...parsed };
      }
    } catch {
      // ignore
    }
    return defaultStats;
  });

  const [activeTab, setActiveTab] = useState<ActiveTab>('home');
  const [activeGame, setActiveGame] = useState<GameMode>(null);
  const [campaignState, setCampaignState] = useState<CampaignState>(initialCampaignState);
  const [openCertificateDirectly, setOpenCertificateDirectly] = useState<boolean>(false);
  const [newBadgeUnlocked, setNewBadgeUnlocked] = useState<string | null>(null);
  const [levelUpNotification, setLevelUpNotification] = useState<number | null>(null);
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'info' | 'star' } | null>(null);

  // Sync sound manager
  useEffect(() => {
    soundManager.setEnabled(stats.soundEnabled);
  }, [stats.soundEnabled]);

  // Save to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(stats));
    } catch {
      // storage quota or private mode
    }
  }, [stats]);

  const showToast = useCallback((text: string, type: 'success' | 'info' | 'star' = 'success') => {
    setToastMessage({ text, type });
    setTimeout(() => {
      setToastMessage((prev) => (prev?.text === text ? null : prev));
    }, 2800);
  }, []);

  const checkBadges = useCallback((currentStats: UserStats) => {
    const newlyUnlocked: string[] = [];

    BADGES.forEach((badge) => {
      if (currentStats.unlockedBadges.includes(badge.id)) return;

      let count = 0;
      if (badge.currentCountKey === 'gardenItemsUnlocked') {
        count = currentStats.unlockedGardenItems.length;
      } else {
        count = currentStats[badge.currentCountKey] || 0;
      }

      if (count >= badge.targetCount) {
        newlyUnlocked.push(badge.id);
      }
    });

    if (newlyUnlocked.length > 0) {
      setStats((prev) => ({
        ...prev,
        unlockedBadges: [...prev.unlockedBadges, ...newlyUnlocked],
      }));
      setNewBadgeUnlocked(newlyUnlocked[0]);
      soundManager.playSuccess();
      triggerStarConfetti();
    }
  }, []);

  const addPointsAndXp = useCallback(
    (pointsToAdd: number, starsToAdd: number = 0, xpBonus: number = 0, reason?: string) => {
      setStats((prev) => {
        const newPoints = prev.points + pointsToAdd;
        const newStars = prev.stars + starsToAdd;
        const gainedXp = xpBonus > 0 ? xpBonus : pointsToAdd;
        const newXp = prev.xp + gainedXp;

        // Calculate Level
        let newLevel = 1;
        for (let lvl = 1; lvl <= 5; lvl++) {
          if (newXp >= LEVEL_XP_THRESHOLDS[lvl - 1]) {
            newLevel = lvl;
          }
        }

        const nextThreshold = LEVEL_XP_THRESHOLDS[newLevel] || LEVEL_XP_THRESHOLDS[5];

        // Monster Cleanliness increases smoothly
        const newCleanliness = Math.min(100, prev.monsterCleanliness + Math.ceil(pointsToAdd / 5));

        const isLevelUp = newLevel > prev.level;
        if (isLevelUp) {
          setTimeout(() => {
            setLevelUpNotification(newLevel);
            soundManager.playLevelUp();
            triggerLevelUpCelebration();
          }, 300);
        }

        const updated: UserStats = {
          ...prev,
          points: newPoints,
          stars: newStars,
          xp: newXp,
          level: newLevel,
          nextLevelXp: nextThreshold,
          monsterCleanliness: newCleanliness,
        };

        // Check badges with updated stats
        setTimeout(() => checkBadges(updated), 50);

        return updated;
      });

      if (reason) {
        showToast(reason, 'star');
      }
    },
    [checkBadges, showToast]
  );

  const updateQuestProgress = (type: 'identify' | 'sort' | 'quiz') => {
    setStats((prev) => {
      const updatedQuests = prev.dailyQuests.map((quest) => {
        if (quest.type === type && !quest.completed) {
          const nextVal = quest.current + 1;
          const isDone = nextVal >= quest.target;
          return {
            ...quest,
            current: Math.min(nextVal, quest.target),
            completed: isDone,
          };
        }
        return quest;
      });
      return { ...prev, dailyQuests: updatedQuests };
    });
  };

  const recordEWasteFound = useCallback(() => {
    setStats((prev) => {
      const nextCount = prev.eWasteFound + 1;
      const updated = { ...prev, eWasteFound: nextCount };
      setTimeout(() => checkBadges(updated), 50);
      return updated;
    });
    updateQuestProgress('identify');
    addPointsAndXp(10, 0, 10);
  }, [addPointsAndXp, checkBadges]);

  const recordItemSorted = useCallback(
    (isBattery: boolean = false) => {
      setStats((prev) => {
        const nextSorted = prev.itemsSorted + 1;
        const nextBatteries = isBattery ? prev.batteriesSorted + 1 : prev.batteriesSorted;
        const updated = { ...prev, itemsSorted: nextSorted, batteriesSorted: nextBatteries };
        setTimeout(() => checkBadges(updated), 50);
        return updated;
      });
      updateQuestProgress('sort');
      addPointsAndXp(15, 0, 15);
    },
    [addPointsAndXp, checkBadges]
  );

  const recordQuizCorrect = useCallback(() => {
    setStats((prev) => {
      const nextCorrect = prev.quizCorrect + 1;
      const updated = { ...prev, quizCorrect: nextCorrect };
      setTimeout(() => checkBadges(updated), 50);
      return updated;
    });
    updateQuestProgress('quiz');
    addPointsAndXp(20, 1, 20);
  }, [addPointsAndXp, checkBadges]);

  const unlockGardenItem = useCallback(
    (itemId: string, cost: number): boolean => {
      if (stats.points < cost) {
        showToast('Yeterli EkoPuanın yok! Oyun oynayarak puan topla 🌱', 'info');
        soundManager.playWrong();
        return false;
      }
      if (stats.unlockedGardenItems.includes(itemId)) {
        return false;
      }

      setStats((prev) => {
        const updatedItems = [...prev.unlockedGardenItems, itemId];
        const updated: UserStats = {
          ...prev,
          points: prev.points - cost,
          unlockedGardenItems: updatedItems,
          monsterCleanliness: Math.min(100, prev.monsterCleanliness + 8),
        };
        setTimeout(() => checkBadges(updated), 50);
        return updated;
      });

      soundManager.playTwinkle();
      triggerStarConfetti();
      showToast('Tebrikler! EkoBahçene yeni bir güzellik kattın! 🌸', 'success');
      return true;
    },
    [stats.points, stats.unlockedGardenItems, showToast, checkBadges]
  );

  const claimDailyQuest = useCallback(
    (questId: string) => {
      setStats((prev) => {
        const quest = prev.dailyQuests.find((q) => q.id === questId);
        if (!quest || !quest.completed || quest.claimed) return prev;

        const updatedQuests = prev.dailyQuests.map((q) =>
          q.id === questId ? { ...q, claimed: true } : q
        );

        soundManager.playSuccess();
        triggerStarConfetti();
        showToast(`Görev Tamamlandı! +${quest.rewardPoints} Puan, +${quest.rewardStars} Yıldız kazandın! 🌟`, 'success');

        return {
          ...prev,
          points: prev.points + quest.rewardPoints,
          stars: prev.stars + quest.rewardStars,
          xp: prev.xp + quest.rewardPoints,
          dailyQuests: updatedQuests,
        };
      });
    },
    [showToast]
  );

  const toggleSound = useCallback(() => {
    setStats((prev) => {
      const nextVal = !prev.soundEnabled;
      soundManager.setEnabled(nextVal);
      if (nextVal) soundManager.playPop();
      return { ...prev, soundEnabled: nextVal };
    });
  }, []);

  const setUserName = useCallback((name: string) => {
    setStats((prev) => ({ ...prev, userName: name.trim() }));
  }, []);

  const completeOnboarding = useCallback((userName?: string) => {
    setStats((prev) => ({
      ...prev,
      hasSeenOnboarding: true,
      userName: userName ? userName.trim() : prev.userName,
    }));
    soundManager.playSuccess();
    triggerStarConfetti();
  }, []);

  const clearNewBadge = useCallback(() => {
    setNewBadgeUnlocked(null);
  }, []);

  const clearLevelUp = useCallback(() => {
    setLevelUpNotification(null);
  }, []);

  const startCampaign = useCallback(() => {
    setCampaignState({
      isActive: true,
      currentStepIndex: 0,
      completedSteps: [],
      isTransitionOpen: false,
      completedGameName: '',
      nextGameInfo: null,
      isVictoryOpen: false,
    });
    setActiveTab('games');
    setActiveGame('hunt');
    soundManager.playLevelUp();
    triggerStarConfetti();
    showToast('🚀 Eko Görev Serüveni Başladı! 1. Bölüm: E-ATIK AVI', 'star');
  }, [showToast]);

  const handleGameCompleteInCampaign = useCallback((completedMode: 'hunt' | 'sort' | 'quiz') => {
    if (completedMode === 'hunt') {
      setCampaignState((prev) => ({
        ...prev,
        completedSteps: Array.from(new Set([...prev.completedSteps, 'hunt'])),
        completedGameName: 'E-ATIK AVI',
        nextGameInfo: CAMPAIGN_STEPS[1], // DOĞRU KUTU
        isTransitionOpen: true,
      }));
      soundManager.playLevelUp();
      triggerStarConfetti();
    } else if (completedMode === 'sort') {
      setCampaignState((prev) => ({
        ...prev,
        completedSteps: Array.from(new Set([...prev.completedSteps, 'hunt', 'sort'])),
        completedGameName: 'DOĞRU KUTU',
        nextGameInfo: CAMPAIGN_STEPS[2], // EKO BULMACA
        isTransitionOpen: true,
      }));
      soundManager.playLevelUp();
      triggerStarConfetti();
    } else if (completedMode === 'quiz') {
      setCampaignState((prev) => ({
        ...prev,
        completedSteps: Array.from(new Set([...prev.completedSteps, 'hunt', 'sort', 'quiz'])),
        completedGameName: 'EKO BULMACA',
        nextGameInfo: null,
        isTransitionOpen: false,
        isVictoryOpen: true,
      }));
      soundManager.playLevelUp();
      triggerLevelUpCelebration();
    }
  }, []);

  const proceedToNextCampaignStep = useCallback(() => {
    setCampaignState((prev) => {
      const nextIdx = prev.currentStepIndex + 1;
      const nextStep = CAMPAIGN_STEPS[nextIdx];
      if (nextStep) {
        setActiveGame(nextStep.gameMode);
        return {
          ...prev,
          currentStepIndex: nextIdx,
          isTransitionOpen: false,
          nextGameInfo: null,
        };
      }
      return prev;
    });
    soundManager.playPop();
  }, []);

  const claimDiplomaFromVictory = useCallback(() => {
    setCampaignState(initialCampaignState);
    setActiveGame(null);
    setActiveTab('badges');
    setOpenCertificateDirectly(true);
    soundManager.playLevelUp();
    triggerLevelUpCelebration();
  }, []);

  const cancelCampaign = useCallback(() => {
    setCampaignState(initialCampaignState);
    setActiveGame(null);
  }, []);

  const resetProgress = useCallback(() => {
    setStats(defaultStats);
    setCampaignState(initialCampaignState);
    localStorage.removeItem(STORAGE_KEY);
    showToast('Tüm ilerlemen sıfırlandı. Yeni maceraya hazır mısın?', 'info');
  }, [showToast]);

  return (
    <GameContext.Provider
      value={{
        stats,
        activeTab,
        setActiveTab,
        activeGame,
        setActiveGame,
        campaignState,
        startCampaign,
        handleGameCompleteInCampaign,
        proceedToNextCampaignStep,
        claimDiplomaFromVictory,
        cancelCampaign,
        openCertificateDirectly,
        setOpenCertificateDirectly,
        addPointsAndXp,
        recordEWasteFound,
        recordItemSorted,
        recordQuizCorrect,
        unlockGardenItem,
        claimDailyQuest,
        toggleSound,
        completeOnboarding,
        setUserName,
        newBadgeUnlocked,
        clearNewBadge,
        levelUpNotification,
        clearLevelUp,
        toastMessage,
        showToast,
        resetProgress,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};
