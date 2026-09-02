import React, { useState } from 'react';
import { Sparkles, MessageCircle, RefreshCw } from 'lucide-react';
import { soundManager } from '../utils/audio';

interface MascotProps {
  message?: string;
  mood?: 'happy' | 'excited' | 'thinking' | 'proud';
  size?: 'sm' | 'md' | 'lg';
  showTipsOnClick?: boolean;
}

const MASCOT_TIPS = [
  'Biliyor musun? 40 eski telefondan 1 gram saf altın kurtarabilirsin! 📱✨',
  'Pilleri sakın toprağa atma! Atık Pil Kutuları marketlerde ve okullarda bulunur 🔋',
  'Eski kabloların içindeki parlak bakırlar yeni bisikletlere dönüşebilir! 🚲',
  'Geri dönüştürdüğün her e-atık, E-Atık Canavarını tatlı bir doğa dostuna dönüştürür! 👾💖',
  'EkoBahçene yeni ağaçlar ve çiçekler dikmek için puan biriktirebilirsin! 🌳🌸',
  'Elektronik eşyaları kırmadan, olduğu gibi geri dönüşüme teslim etmeliyiz! 🛡️',
];

export const Mascot: React.FC<MascotProps> = ({
  message,
  mood = 'happy',
  size = 'md',
  showTipsOnClick = true,
}) => {
  const [tipIndex, setTipIndex] = useState(0);
  const [isWobbling, setIsWobbling] = useState(false);

  const displayMessage = message || MASCOT_TIPS[tipIndex];

  const handleMascotClick = () => {
    soundManager.playPop();
    setIsWobbling(true);
    setTimeout(() => setIsWobbling(false), 500);

    if (showTipsOnClick && !message) {
      setTipIndex((prev) => (prev + 1) % MASCOT_TIPS.length);
    }
  };

  const getMascotFace = () => {
    switch (mood) {
      case 'excited':
        return '🤩';
      case 'thinking':
        return '🧐';
      case 'proud':
        return '🌟';
      case 'happy':
      default:
        return '🤖';
    }
  };

  const sizeClasses = {
    sm: 'w-12 h-12 text-2xl',
    md: 'w-16 h-16 text-3xl sm:w-20 sm:h-20 sm:text-4xl',
    lg: 'w-20 h-20 text-4xl sm:w-24 sm:h-24 sm:text-5xl',
  };

  return (
    <div className="flex items-center gap-3 my-2 select-none">
      {/* Mascot Avatar */}
      <button
        id="mascot-interactive-avatar"
        onClick={handleMascotClick}
        aria-label="EkoPati Maskotu - İpucu almak için dokun"
        className={`relative rounded-3xl bg-gradient-to-b from-emerald-300 via-teal-400 to-emerald-600 p-1 shadow-lg shadow-emerald-600/25 transition-transform cursor-pointer active:scale-90 ${
          sizeClasses[size]
        } ${isWobbling ? 'animate-bounce' : 'hover:scale-105'}`}
      >
        {/* Cute Ears & Sprout */}
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-emerald-500 text-white text-[10px] px-1.5 py-0.5 rounded-full font-black flex items-center gap-0.5 border-2 border-white shadow-xs">
          🌱 EkoPati
        </div>

        {/* Character Core */}
        <div className="w-full h-full rounded-[22px] bg-emerald-100 flex items-center justify-center border-2 border-emerald-400 relative overflow-hidden">
          <span className="relative z-10 transition-transform duration-300">
            {getMascotFace()}
          </span>
          <div className="absolute inset-0 bg-gradient-to-t from-emerald-300/30 to-transparent pointer-events-none" />
        </div>
      </button>

      {/* Speech Bubble */}
      <div className="flex-1 bg-white/95 backdrop-blur-xs border-2 border-emerald-200 rounded-2xl rounded-tl-xs p-2.5 sm:p-3.5 shadow-md shadow-emerald-900/5 relative text-slate-800">
        <div className="flex items-start justify-between gap-1.5">
          <div className="flex items-center gap-1 text-[11px] font-extrabold text-emerald-700 uppercase tracking-wide">
            <Sparkles className="w-3 h-3 text-amber-500" />
            <span>EkoPati Diyor Ki:</span>
          </div>
          {showTipsOnClick && !message && (
            <button
              onClick={handleMascotClick}
              title="Başka ipucu gör"
              className="text-emerald-500 hover:text-emerald-700 p-0.5"
            >
              <RefreshCw className="w-3 h-3" />
            </button>
          )}
        </div>
        <p className="text-xs sm:text-sm font-bold text-slate-700 mt-1 leading-snug">
          {displayMessage}
        </p>
      </div>
    </div>
  );
};
