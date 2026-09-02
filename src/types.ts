export type ActiveTab = 'home' | 'games' | 'cards' | 'garden' | 'badges';

export type GameMode = 'hunt' | 'sort' | 'quiz' | null;

export interface CampaignStepInfo {
  gameMode: 'hunt' | 'sort' | 'quiz';
  stageNumber: number;
  totalStages: number;
  title: string;
  subtitle: string;
  badge: string;
  icon: string;
  themeColor: string;
}

export interface CampaignState {
  isActive: boolean;
  currentStepIndex: number;
  completedSteps: string[];
  isTransitionOpen: boolean;
  completedGameName: string;
  nextGameInfo: CampaignStepInfo | null;
  isVictoryOpen: boolean;
}

export type BinCategoryType = 'battery' | 'small_electronics' | 'lighting' | 'screens' | 'recycle_general';

export interface BinDefinition {
  id: BinCategoryType;
  name: string;
  shortName: string;
  icon: string;
  color: string;
  bgColor: string;
  borderColor: string;
  description: string;
}

export interface EWasteItem {
  id: string;
  name: string;
  category: BinCategoryType;
  isEWaste: boolean;
  icon: string;
  color: string;
  description: string;
  whySeparate: string;
  funFact: string;
  hazards: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  icon: string;
  tip: string;
}

export interface GardenItem {
  id: string;
  name: string;
  icon: string;
  cost: number;
  requiredLevel: number;
  category: 'flora' | 'fauna' | 'water' | 'special';
  description: string;
  position: { x: number; y: number }; // percentage 0-100
  size: 'sm' | 'md' | 'lg';
  animation: string;
}

export interface Badge {
  id: string;
  name: string;
  icon: string;
  description: string;
  targetCount: number;
  currentCountKey: 'eWasteFound' | 'itemsSorted' | 'quizCorrect' | 'gardenItemsUnlocked' | 'level' | 'batteriesSorted';
  color: string;
}

export interface DailyQuest {
  id: string;
  title: string;
  icon: string;
  current: number;
  target: number;
  rewardPoints: number;
  rewardStars: number;
  completed: boolean;
  claimed: boolean;
  type: 'identify' | 'sort' | 'quiz';
}

export interface UserStats {
  userName: string;
  points: number;
  stars: number;
  level: number;
  xp: number;
  nextLevelXp: number;
  eWasteFound: number;
  itemsSorted: number;
  batteriesSorted: number;
  quizCorrect: number;
  unlockedGardenItems: string[];
  unlockedBadges: string[];
  monsterCleanliness: number; // 0 (messy) to 100 (fully clean eco sprite)
  dailyQuests: DailyQuest[];
  lastQuestDate: string;
  soundEnabled: boolean;
  hasSeenOnboarding: boolean;
}
