import React from 'react';
import { Sparkles, CheckCircle2, Info } from 'lucide-react';
import { useGame } from '../context/GameContext';

export const Toast: React.FC = () => {
  const { toastMessage } = useGame();

  if (!toastMessage) return null;

  const getIcon = () => {
    switch (toastMessage.type) {
      case 'star':
        return <Sparkles className="w-4 h-4 text-amber-500 fill-amber-400 shrink-0" />;
      case 'info':
        return <Info className="w-4 h-4 text-sky-500 shrink-0" />;
      case 'success':
      default:
        return <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />;
    }
  };

  const getBg = () => {
    switch (toastMessage.type) {
      case 'star':
        return 'bg-amber-50 border-amber-300 text-amber-950';
      case 'info':
        return 'bg-sky-50 border-sky-300 text-sky-950';
      case 'success':
      default:
        return 'bg-emerald-50 border-emerald-300 text-emerald-950';
    }
  };

  return (
    <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 pointer-events-none px-4 w-full max-w-sm">
      <div
        className={`flex items-center gap-2.5 px-4 py-2.5 rounded-2xl border-2 shadow-lg backdrop-blur-md animate-bounce ${getBg()}`}
      >
        {getIcon()}
        <p className="text-xs sm:text-sm font-bold leading-tight">{toastMessage.text}</p>
      </div>
    </div>
  );
};
