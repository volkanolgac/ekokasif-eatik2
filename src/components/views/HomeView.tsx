import React, { useState } from 'react';
import { Play, Sparkles, Trophy, ArrowRight, Trees, BookOpen, Layers, Award, User, CheckCircle, AlertCircle, Edit3 } from 'lucide-react';
import { useGame } from '../../context/GameContext';
import { MonsterStatus } from '../MonsterStatus';
import { DailyTasksCard } from '../DailyTasksCard';
import { soundManager } from '../../utils/audio';
import { triggerStarConfetti } from '../../utils/confetti';

export const HomeView: React.FC = () => {
  const { setActiveTab, setActiveGame, stats, setUserName, startCampaign } = useGame();
  const [inputName, setInputName] = useState(stats.userName || '');
  const [isEditingName, setIsEditingName] = useState(!stats.userName);

  const parts = inputName.trim().split(/\s+/);
  const isValidName = parts.length >= 2 && parts[0].length >= 1 && parts[1].length >= 1;
  const isNameSet = Boolean(stats.userName && stats.userName.trim().length > 0);

  const handleStartMission = () => {
    if (!isNameSet) {
      if (!isValidName) return;
      setUserName(inputName.trim());
      triggerStarConfetti();
    }
    soundManager.playPop();
    startCampaign();
  };

  const handleSaveNameOnly = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValidName) return;
    setUserName(inputName.trim());
    setIsEditingName(false);
    soundManager.playSuccess();
    triggerStarConfetti();
  };

  const unlockedGardenCount = stats.unlockedGardenItems.length;
  const gardenProgress = Math.round((unlockedGardenCount / 10) * 100);

  return (
    <div className="max-w-4xl mx-auto pb-12 space-y-6">
      {/* Sleek Hero Welcome Container */}
      <div className="bg-white/70 backdrop-blur-md rounded-[36px] sm:rounded-[40px] p-6 sm:p-8 border-4 border-white shadow-xl flex flex-col items-center justify-center text-center relative overflow-hidden group">
        {/* Ambient Blur Circle */}
        <div className="absolute -top-10 -right-10 w-48 h-48 bg-green-200 rounded-full blur-3xl opacity-60 pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-teal-200 rounded-full blur-3xl opacity-50 pointer-events-none" />

        {/* Mascot Emoji / Character */}
        <div className="text-6xl sm:text-7xl mb-2 animate-bounce cursor-pointer" onClick={() => soundManager.playPop()}>
          🤖
        </div>

        <div className="inline-flex items-center gap-1.5 bg-green-100 text-green-800 text-xs font-black px-3 py-1 rounded-full mb-1">
          <Sparkles className="w-3.5 h-3.5 text-green-600" />
          <span>Doğa Görevi Seni Bekliyor!</span>
        </div>

        <h2 className="text-2xl sm:text-3xl font-black text-green-900 font-['Fredoka',sans-serif] tracking-tight">
          Merhaba {stats.userName ? stats.userName : 'Kaşif'}! 👋
        </h2>
        <p className="text-green-800/80 text-xs sm:text-sm mt-1 max-w-md mx-auto font-bold leading-relaxed">
          Bugün e-atıkları doğru ayrıştırıp dönüştürelim, dünyamızı koruyalım ve sanal EkoBahçeni çiçeklerle dolduralım!
        </p>

        {/* Name & Surname Input Block */}
        <div className="mt-4 w-full max-w-sm">
          {!isNameSet || isEditingName ? (
            <div className="bg-white/95 rounded-2xl p-3.5 border-2 border-green-200 shadow-md text-left space-y-2">
              <label
                htmlFor="home-name-input"
                className="block text-xs font-black text-green-950 font-['Fredoka',sans-serif] flex items-center justify-between"
              >
                <span className="flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-green-700" />
                  <span>Kaşif Adı ve Soyadı:</span>
                </span>
                {isValidName ? (
                  <span className="text-[10px] text-green-600 font-black flex items-center gap-0.5">
                    <CheckCircle className="w-3 h-3" /> Hazır!
                  </span>
                ) : (
                  <span className="text-[10px] text-amber-700 font-bold">
                    (Ad ve Soyad gerekli)
                  </span>
                )}
              </label>
              <div className="flex items-center gap-2">
                <input
                  id="home-name-input"
                  type="text"
                  value={inputName}
                  onChange={(e) => setInputName(e.target.value)}
                  placeholder="Örn: Ali Yılmaz"
                  className={`w-full px-3.5 py-2.5 rounded-xl border-2 text-xs sm:text-sm font-bold text-slate-800 placeholder-slate-400 focus:outline-hidden transition-all ${
                    isValidName
                      ? 'border-green-500 bg-green-50/40 focus:ring-2 focus:ring-green-300'
                      : inputName.length > 0
                      ? 'border-amber-300 bg-amber-50/40 focus:ring-2 focus:ring-amber-200'
                      : 'border-slate-300 bg-white focus:border-green-400'
                  }`}
                />
                {isNameSet && isEditingName && (
                  <button
                    type="button"
                    onClick={handleSaveNameOnly}
                    disabled={!isValidName}
                    className="px-3 py-2.5 rounded-xl bg-green-600 text-white font-bold text-xs hover:bg-green-700 disabled:opacity-40 cursor-pointer shrink-0"
                  >
                    Kaydet
                  </button>
                )}
              </div>
              {inputName.length > 0 && !isValidName && (
                <p className="text-[11px] font-bold text-amber-700 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3 shrink-0" />
                  Adınız ve soyadınız arasında bir boşluk olmalıdır.
                </p>
              )}
            </div>
          ) : (
            <div className="bg-white/90 rounded-2xl p-2.5 px-3.5 border border-green-200 shadow-xs flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 text-xs sm:text-sm text-green-950 font-bold text-left">
                <span className="text-base">👤</span>
                <div>
                  <span className="text-[10px] text-green-700 font-bold block uppercase tracking-wider">Kayıtlı Kaşif</span>
                  <strong className="text-green-950 font-black font-['Fredoka',sans-serif] text-sm sm:text-base">
                    {stats.userName}
                  </strong>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setInputName(stats.userName || '');
                  setIsEditingName(true);
                }}
                className="px-2.5 py-1.5 rounded-xl bg-green-100 hover:bg-green-200 text-green-900 font-bold text-xs flex items-center gap-1 cursor-pointer transition-all"
              >
                <Edit3 className="w-3 h-3" />
                <span>Değiştir</span>
              </button>
            </div>
          )}
        </div>

        {/* Call to action & mini quest prompt */}
        <div className="mt-3 w-full max-w-sm space-y-2.5">
          <div className="bg-white/90 rounded-2xl p-3 flex items-center gap-3 border border-green-100 shadow-xs">
            <span className="text-xl">🌱</span>
            <span className="text-xs font-bold text-green-800 text-left">
              EkoBahçende yeni bitkiler açmak için puan topla!
            </span>
          </div>

          <button
            id="hero-start-mission-button"
            onClick={handleStartMission}
            disabled={!isNameSet && !isValidName}
            className={`w-full rounded-2xl p-3.5 sm:p-4 font-black text-center transition-all flex items-center justify-center gap-2 text-base font-['Fredoka',sans-serif] ${
              (isNameSet || isValidName)
                ? 'bg-green-500 hover:bg-green-600 text-white shadow-lg shadow-green-200 active:scale-95 cursor-pointer'
                : 'bg-slate-200 text-slate-400 border border-slate-300 shadow-none cursor-not-allowed opacity-75'
            }`}
          >
            <Sparkles className={`w-4 h-4 ${(isNameSet || isValidName) ? 'text-amber-200' : 'text-slate-300'}`} />
            <span>Göreve Başla 🚀</span>
          </button>
          {(!isNameSet && !isValidName) && (
            <p className="text-[11px] font-bold text-green-800/80 text-center">
              ⚠️ Göreve başlamak için yukarıya Adınızı ve Soyadınızı yazınız.
            </p>
          )}
        </div>
      </div>

      {/* 4 Sleek Chunky 3D Action Cards */}
      <div>
        <div className="flex items-center justify-between mb-3 px-1">
          <h3 className="font-['Fredoka',sans-serif] font-black text-base sm:text-lg text-green-950 uppercase tracking-wide">
            🎮 Eko Görevler & Oyunlar
          </h3>
          <span className="text-[11px] font-black bg-white/80 border border-white text-green-800 px-3 py-1 rounded-full shadow-xs">
            Hemen Oyna
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Card 1: E-ATIK AVI (Orange 3D Block) */}
          <div
            id="quick-game-hunt"
            onClick={() => {
              soundManager.playPop();
              setActiveTab('games');
              setActiveGame('hunt');
            }}
            className="bg-orange-400 rounded-[32px] p-5 sm:p-6 flex flex-col justify-between shadow-xl border-b-8 border-orange-600 cursor-pointer hover:-translate-y-1 active:translate-y-0 transition-all select-none group"
          >
            <div className="text-4xl sm:text-5xl group-hover:scale-110 transition-transform">
              🎮
            </div>
            <div className="text-white mt-4">
              <span className="text-[10px] uppercase font-black tracking-widest bg-orange-500/80 px-2 py-0.5 rounded-full inline-block mb-1">
                Refleks Oyunu
              </span>
              <h3 className="text-xl font-black leading-tight font-['Fredoka',sans-serif]">
                E-ATIK AVI
              </h3>
              <p className="text-xs sm:text-sm opacity-90 mt-1 font-bold">
                Hızlı ol, ekrandaki elektronik eşyaları topla!
              </p>
            </div>
          </div>

          {/* Card 2: DOĞRU KUTU (Blue 3D Block) */}
          <div
            id="quick-game-sort"
            onClick={() => {
              soundManager.playPop();
              setActiveTab('games');
              setActiveGame('sort');
            }}
            className="bg-blue-400 rounded-[32px] p-5 sm:p-6 flex flex-col justify-between shadow-xl border-b-8 border-blue-600 cursor-pointer hover:-translate-y-1 active:translate-y-0 transition-all select-none group"
          >
            <div className="text-4xl sm:text-5xl group-hover:scale-110 transition-transform">
              📦
            </div>
            <div className="text-white mt-4">
              <span className="text-[10px] uppercase font-black tracking-widest bg-blue-500/80 px-2 py-0.5 rounded-full inline-block mb-1">
                Ayrıştırma Becerisi
              </span>
              <h3 className="text-xl font-black leading-tight font-['Fredoka',sans-serif]">
                DOĞRU KUTU
              </h3>
              <p className="text-xs sm:text-sm opacity-90 mt-1 font-bold">
                Cihazları ve pilleri doğru geri dönüşüm kutusuna koy!
              </p>
            </div>
          </div>

          {/* Card 3: EKO BULMACA (Purple 3D Block) */}
          <div
            id="quick-game-quiz"
            onClick={() => {
              soundManager.playPop();
              setActiveTab('games');
              setActiveGame('quiz');
            }}
            className="bg-purple-400 rounded-[32px] p-5 sm:p-6 flex flex-col justify-between shadow-xl border-b-8 border-purple-600 cursor-pointer hover:-translate-y-1 active:translate-y-0 transition-all select-none group"
          >
            <div className="text-4xl sm:text-5xl group-hover:scale-110 transition-transform">
              🧩
            </div>
            <div className="text-white mt-4">
              <span className="text-[10px] uppercase font-black tracking-widest bg-purple-500/80 px-2 py-0.5 rounded-full inline-block mb-1">
                Bilgi & Zeka
              </span>
              <h3 className="text-xl font-black leading-tight font-['Fredoka',sans-serif]">
                EKO BULMACA
              </h3>
              <p className="text-xs sm:text-sm opacity-90 mt-1 font-bold">
                Eğlenceli çevre sorularını çöz, yıldızları kap!
              </p>
            </div>
          </div>

          {/* Card 4: CİHAZ KARTLARI (Yellow 3D Block) */}
          <div
            id="quick-nav-cards"
            onClick={() => {
              soundManager.playPop();
              setActiveTab('cards');
            }}
            className="bg-yellow-400 rounded-[32px] p-5 sm:p-6 flex flex-col justify-between shadow-xl border-b-8 border-yellow-600 cursor-pointer hover:-translate-y-1 active:translate-y-0 transition-all select-none group"
          >
            <div className="text-4xl sm:text-5xl group-hover:scale-110 transition-transform">
              📱
            </div>
            <div className="text-white mt-4">
              <span className="text-[10px] uppercase font-black tracking-widest bg-yellow-500/80 px-2 py-0.5 rounded-full inline-block mb-1">
                E-Atık Ansiklopedisi
              </span>
              <h3 className="text-xl font-black leading-tight font-['Fredoka',sans-serif]">
                CİHAZ KARTLARI
              </h3>
              <p className="text-xs sm:text-sm opacity-90 mt-1 font-bold">
                İçlerindeki altın ve bakır parçaları yakından tanıyalım.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 2-Column Sleek Widgets: EkoBahçem Preview & Monster / Quests */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Left Widget: EkoBahçem Mini Preview Card */}
        <div
          onClick={() => {
            soundManager.playPop();
            setActiveTab('garden');
          }}
          className="bg-white/80 backdrop-blur-md rounded-3xl p-5 border border-white shadow-lg relative overflow-hidden flex flex-col justify-between cursor-pointer hover:shadow-xl transition-all"
        >
          <div className="absolute top-0 left-0 w-full h-1.5 bg-green-400" />
          <div className="flex items-center justify-between">
            <h4 className="text-[10px] uppercase font-black text-gray-500 tracking-widest">
              Sanal EkoBahçem
            </h4>
            <span className="text-xs font-bold text-green-700">Bahçeye Git →</span>
          </div>

          <div className="relative h-28 flex items-end justify-around pb-2 my-2 select-none">
            <div className="text-4xl animate-bounce">🌳</div>
            <div className="text-3xl opacity-40">🌸</div>
            <div className="text-4xl">🌻</div>
            <div className="text-3xl opacity-60">🦋</div>
          </div>

          <div className="bg-green-50 rounded-2xl p-2.5 text-center border border-green-100">
            <div className="flex justify-between items-center text-[11px] font-bold text-green-800 mb-1 px-1">
              <span>Bahçe Canlılığı</span>
              <span>%{gardenProgress}</span>
            </div>
            <div className="w-full h-2 bg-green-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-green-500 rounded-full transition-all duration-500"
                style={{ width: `${gardenProgress}%` }}
              />
            </div>
          </div>
        </div>

        {/* Right Widget: Badges Quick Preview */}
        <div
          onClick={() => {
            soundManager.playPop();
            setActiveTab('badges');
          }}
          className="bg-white/80 backdrop-blur-md rounded-3xl p-5 border border-white shadow-lg flex flex-col justify-between cursor-pointer hover:shadow-xl transition-all"
        >
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-[10px] uppercase font-black text-gray-500 tracking-widest">
              Son Başarı Rozetleri
            </h4>
            <span className="text-xs font-bold text-green-700">Tümü ({stats.unlockedBadges.length}/10) →</span>
          </div>

          <div className="flex items-center gap-3 my-auto py-2">
            <div className="w-14 h-14 bg-orange-100 rounded-2xl flex items-center justify-center text-2xl shadow-inner border border-orange-200">
              🌱
            </div>
            <div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center text-2xl shadow-inner border border-blue-200">
              🔋
            </div>
            <div className="w-14 h-14 bg-yellow-100 rounded-2xl flex items-center justify-center text-2xl shadow-inner border border-yellow-200">
              🏆
            </div>
            <div className="w-14 h-14 bg-gray-100 rounded-2xl flex items-center justify-center text-2xl shadow-inner border border-gray-200 opacity-40">
              🔒
            </div>
          </div>

          <div className="text-[11px] font-bold text-gray-500 text-center">
            {stats.unlockedBadges.length > 0
              ? `${stats.unlockedBadges.length} rozet kazandın! Diplomayı görmek için tıkla.`
              : 'Henüz rozet açılmadı. Görevleri tamamla ve rozetleri kap!'}
          </div>
        </div>
      </div>

      {/* E-Waste Monster Transformation Card */}
      <MonsterStatus />

      {/* Daily Quests Card */}
      <DailyTasksCard />
    </div>
  );
};

