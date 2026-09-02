import React, { useState } from 'react';
import { Sparkles, ArrowRight, ShieldCheck, User, CheckCircle, AlertCircle } from 'lucide-react';
import { useGame } from '../context/GameContext';

export const OnboardingModal: React.FC = () => {
  const { stats, completeOnboarding } = useGame();
  const [fullName, setFullName] = useState(stats.userName || '');

  if (stats.hasSeenOnboarding) return null;

  // Validation: at least one word, then a space, then second word
  const parts = fullName.trim().split(/\s+/);
  const isValidName = parts.length >= 2 && parts[0].length >= 1 && parts[1].length >= 1;

  const handleStart = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValidName) return;
    completeOnboarding(fullName.trim());
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-emerald-950/70 backdrop-blur-md animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-md w-full p-5 sm:p-6 shadow-2xl border-4 border-emerald-300 text-center relative overflow-hidden">
        {/* Decorative background glow */}
        <div className="absolute -top-12 -right-12 w-32 h-32 bg-emerald-200 rounded-full blur-2xl opacity-60 pointer-events-none" />
        <div className="absolute -bottom-12 -left-12 w-32 h-32 bg-amber-200 rounded-full blur-2xl opacity-60 pointer-events-none" />

        {/* Mascot Header */}
        <div className="w-20 h-20 sm:w-24 sm:h-24 mx-auto rounded-3xl bg-gradient-to-tr from-emerald-400 to-teal-300 p-1 shadow-lg shadow-emerald-500/30 mb-3 flex items-center justify-center text-4xl sm:text-5xl animate-bounce">
          🤖
        </div>

        <h2 className="font-['Fredoka',sans-serif] text-2xl sm:text-3xl font-black text-emerald-900 tracking-tight">
          EkoKaşif Dünyasına Hoş Geldin!
        </h2>

        <p className="text-xs sm:text-sm font-semibold text-slate-600 mt-2 leading-relaxed">
          Merhaba minik kahraman! Dünyamızda eski telefonlar, piller ve bozuk aletler doğayı kirletmesin diye maceraya başlıyoruz.
        </p>

        {/* 3 Step Features */}
        <div className="grid grid-cols-3 gap-2 my-3.5 text-left">
          <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-2.5 flex flex-col items-center text-center">
            <span className="text-2xl mb-1">🎮</span>
            <span className="font-['Fredoka',sans-serif] font-bold text-xs text-emerald-900">Oyun Oyna</span>
            <span className="text-[10px] text-slate-500 font-semibold mt-0.5">E-atıkları doğru kutulara ayır</span>
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-2.5 flex flex-col items-center text-center">
            <span className="text-2xl mb-1">⭐</span>
            <span className="font-['Fredoka',sans-serif] font-bold text-xs text-amber-900">Puan Kazan</span>
            <span className="text-[10px] text-slate-500 font-semibold mt-0.5">Rozetleri ve seviyeleri aç</span>
          </div>

          <div className="bg-sky-50 border border-sky-200 rounded-2xl p-2.5 flex flex-col items-center text-center">
            <span className="text-2xl mb-1">🌸</span>
            <span className="font-['Fredoka',sans-serif] font-bold text-xs text-sky-900">Bahçe Kur</span>
            <span className="text-[10px] text-slate-500 font-semibold mt-0.5">Kendi EkoBahçeni güzelleştir</span>
          </div>
        </div>

        {/* Name & Surname Input Form */}
        <form onSubmit={handleStart} className="space-y-3 my-3 text-left">
          <div>
            <label
              htmlFor="kaşif-name-input"
              className="block text-xs font-black text-emerald-900 mb-1 font-['Fredoka',sans-serif] flex items-center justify-between"
            >
              <span className="flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-emerald-600" />
                <span>Kaşif Adı ve Soyadı:</span>
              </span>
              {isValidName ? (
                <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-0.5">
                  <CheckCircle className="w-3 h-3" /> Hazır!
                </span>
              ) : (
                <span className="text-[10px] text-slate-400 font-bold">
                  (Ad + Boşluk + Soyad)
                </span>
              )}
            </label>
            <div className="relative">
              <input
                id="kaşif-name-input"
                type="text"
                autoFocus
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Örn: Ali Yılmaz"
                className={`w-full px-4 py-3 rounded-2xl border-2 text-sm sm:text-base font-bold text-slate-800 placeholder-slate-400 focus:outline-hidden transition-all bg-emerald-50/50 ${
                  isValidName
                    ? 'border-emerald-500 focus:ring-3 focus:ring-emerald-200 bg-white'
                    : fullName.length > 0
                    ? 'border-amber-300 focus:ring-3 focus:ring-amber-100 bg-white'
                    : 'border-slate-200 focus:border-emerald-400'
                }`}
              />
            </div>
            {fullName.length > 0 && !isValidName && (
              <p className="text-[11px] font-bold text-amber-700 mt-1 flex items-center gap-1">
                <AlertCircle className="w-3 h-3 shrink-0" />
                Lütfen adınızdan sonra bir boşluk bırakıp soyadınızı yazın.
              </p>
            )}
          </div>

          {/* Child Safe Pill */}
          <div className="flex items-center justify-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-100/80 rounded-xl py-1 px-3">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>%100 Güvenli, Reklamsız ve Eğitici Çocuk Oyunu</span>
          </div>

          {/* Start Mission Button (Disabled initially until valid name is typed) */}
          <button
            type="submit"
            id="onboarding-start-button"
            disabled={!isValidName}
            className={`w-full py-3.5 px-6 rounded-2xl font-['Fredoka',sans-serif] font-black text-lg shadow-lg flex items-center justify-center gap-2 transition-all cursor-pointer ${
              isValidName
                ? 'bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 hover:from-emerald-600 hover:to-teal-600 text-white shadow-emerald-600/30 active:scale-95 animate-pulse'
                : 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none border border-slate-300'
            }`}
          >
            <Sparkles className={`w-5 h-5 ${isValidName ? 'text-amber-300' : 'text-slate-300'}`} />
            <span>Göreve Başla! 🚀</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </form>
      </div>
    </div>
  );
};
