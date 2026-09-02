import { Badge } from '../types';

export const BADGES: Badge[] = [
  {
    id: 'first_step',
    name: '🌱 İlk EkoAdım',
    icon: '🌱',
    description: 'İlk e-atığını başarıyla bul ve geri dönüşüme adım at!',
    targetCount: 1,
    currentCountKey: 'eWasteFound',
    color: 'from-emerald-400 to-green-500',
  },
  {
    id: 'battery_expert',
    name: '🔋 Pil Uzmanı',
    icon: '🔋',
    description: '5 adet pili Atık Pil Kutusu ile doğru eşleştir.',
    targetCount: 5,
    currentCountKey: 'batteriesSorted',
    color: 'from-amber-400 to-orange-500',
  },
  {
    id: 'ewaste_hunter',
    name: '📱 E-Atık Avcısı',
    icon: '📱',
    description: 'E-Atık Avı oyununda 10 elektronik eşya topla.',
    targetCount: 10,
    currentCountKey: 'eWasteFound',
    color: 'from-blue-400 to-indigo-500',
  },
  {
    id: 'recycle_hero',
    name: '♻️ Geri Dönüşüm Kahramanı',
    icon: '♻️',
    description: '15 farklı e-atığı doğru kutulara yerleştir.',
    targetCount: 15,
    currentCountKey: 'itemsSorted',
    color: 'from-teal-400 to-emerald-600',
  },
  {
    id: 'nature_friend',
    name: '🌳 Doğa Dostu',
    icon: '🌳',
    description: 'EkoBahçende en az 3 doğa öğesinin kilidini aç.',
    targetCount: 3,
    currentCountKey: 'gardenItemsUnlocked',
    color: 'from-lime-400 to-green-600',
  },
  {
    id: 'eco_quiz_master',
    name: '🧠 Eko Bilge',
    icon: '🧠',
    description: 'Eko Bulmaca oyununda 5 soruyu doğru yanıtla.',
    targetCount: 5,
    currentCountKey: 'quizCorrect',
    color: 'from-purple-400 to-pink-500',
  },
  {
    id: 'super_explorer',
    name: '🏆 Süper EkoKaşif',
    icon: '🏆',
    description: 'EkoKaşif macerasında Seviye 5 efsanesine ulaş!',
    targetCount: 5,
    currentCountKey: 'level',
    color: 'from-yellow-400 to-amber-500',
  },
];

export const LEVEL_NAMES: Record<number, string> = {
  1: 'EkoÇaylak',
  2: 'EkoKaşif',
  3: 'EkoKoruyucu',
  4: 'Doğa Kahramanı',
  5: 'Süper EkoKaşif',
};

export const LEVEL_XP_THRESHOLDS = [0, 100, 250, 450, 700, 1000];
