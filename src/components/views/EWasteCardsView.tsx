import React, { useState } from 'react';
import { Sparkles, Info, X, ShieldAlert, CheckCircle2, Search } from 'lucide-react';
import { E_WASTE_ITEMS } from '../../data/eWasteData';
import { EWasteItem } from '../../types';
import { soundManager } from '../../utils/audio';
import { useGame } from '../../context/GameContext';

export const EWasteCardsView: React.FC = () => {
  const [selectedItem, setSelectedItem] = useState<EWasteItem | null>(null);
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const { addPointsAndXp } = useGame();
  const [readItems, setReadItems] = useState<string[]>([]);

  const handleCardClick = (item: EWasteItem) => {
    soundManager.playPop();
    setSelectedItem(item);

    // Reward points for discovering new e-waste card
    if (!readItems.includes(item.id)) {
      setReadItems((prev) => [...prev, item.id]);
      addPointsAndXp(5, 0, 5, `${item.name} kartını öğrendin! +5 Puan 🌱`);
    }
  };

  const filteredItems = E_WASTE_ITEMS.filter((item) => {
    const matchesCategory = filterCategory === 'all' || item.category === filterCategory;
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="max-w-3xl mx-auto pb-12 space-y-4">
      {/* Header Card */}
      <div className="bg-white/80 backdrop-blur-md rounded-3xl p-4 sm:p-5 border border-white shadow-lg text-center">
        <div className="inline-flex items-center gap-1.5 bg-green-100 text-green-800 text-xs font-black px-3 py-1 rounded-full mb-1 border border-green-200">
          <Sparkles className="w-3.5 h-3.5 text-green-600" />
          <span>E-Atık Ansiklopedisi</span>
        </div>
        <h2 className="font-['Fredoka',sans-serif] text-xl sm:text-2xl font-black text-green-950">
          E-Atıkları Yakından Tanı!
        </h2>
        <p className="text-xs sm:text-sm font-bold text-gray-500 max-w-md mx-auto mt-0.5">
          Her bir kartın üzerine dokunarak içindeki değerli madenleri ve nasıl geri dönüştürüldüğünü keşfet.
        </p>
      </div>

      {/* Category Filter Pills & Search */}
      <div className="space-y-3">
        {/* Search Input */}
        <div className="relative max-w-md mx-auto">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="E-atık ara (pil, telefon, kablo, ampul...)"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white/80 backdrop-blur-md border border-white rounded-2xl pl-10 pr-4 py-2.5 text-xs sm:text-sm font-bold text-slate-800 placeholder-gray-400 focus:outline-none focus:border-green-400 shadow-sm"
          />
        </div>

        {/* Categories */}
        <div className="flex items-center justify-center gap-2 overflow-x-auto py-1 no-scrollbar text-xs">
          {[
            { id: 'all', label: 'Tümü 🌟' },
            { id: 'battery', label: 'Piller 🔋' },
            { id: 'small_electronics', label: 'Küçük Cihazlar 📱' },
            { id: 'lighting', label: 'Ampuller 💡' },
            { id: 'screens', label: 'Ekranlar 🖥️' },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => {
                soundManager.playPop();
                setFilterCategory(cat.id);
              }}
              className={`px-3.5 py-2 rounded-2xl font-black whitespace-nowrap transition-all text-xs cursor-pointer shadow-xs ${
                filterCategory === cat.id
                  ? 'bg-green-500 text-white shadow-green-500/20'
                  : 'bg-white/80 backdrop-blur-md text-slate-700 border border-white hover:bg-white'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        {filteredItems.map((item) => {
          const isRead = readItems.includes(item.id);
          return (
            <button
              key={item.id}
              id={`card-item-${item.id}`}
              onClick={() => handleCardClick(item)}
              className="bg-white/80 backdrop-blur-md border border-white hover:border-green-300 rounded-[28px] p-3.5 shadow-sm hover:shadow-lg transition-all active:scale-95 flex flex-col items-center text-center relative group cursor-pointer"
            >
              {/* Icon Container */}
              <div className="w-16 h-16 sm:w-18 sm:h-18 rounded-2xl bg-white border border-gray-100 flex items-center justify-center text-3xl sm:text-4xl group-hover:scale-110 transition-transform shadow-xs mb-2">
                {item.icon}
              </div>

              {/* Title & Short Desc */}
              <h3 className="font-['Fredoka',sans-serif] font-black text-xs sm:text-sm text-slate-900 line-clamp-1">
                {item.name}
              </h3>
              <p className="text-[11px] font-bold text-gray-500 line-clamp-2 mt-0.5 leading-snug">
                {item.description}
              </p>

              {/* Read indicator */}
              {isRead && (
                <span className="absolute top-2.5 right-2.5 text-green-600 bg-green-100 p-0.5 rounded-full border border-green-200">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Detail Modal */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-[32px] max-w-sm w-full p-5 shadow-2xl border-4 border-green-300 relative">
            <button
              onClick={() => {
                soundManager.playPop();
                setSelectedItem(null);
              }}
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 bg-gray-100 p-1.5 rounded-full cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Icon Banner */}
            <div className="w-20 h-20 mx-auto rounded-3xl bg-green-100 border-2 border-green-300 flex items-center justify-center text-5xl shadow-md mb-3">
              {selectedItem.icon}
            </div>

            <h3 className="font-['Fredoka',sans-serif] text-xl font-black text-slate-900 text-center">
              {selectedItem.name}
            </h3>

            <div className="space-y-2.5 mt-3 text-xs sm:text-sm">
              {/* Description */}
              <div className="bg-slate-50 p-2.5 rounded-2xl border border-slate-200">
                <span className="font-black text-slate-800">🔍 Ne Olduğu: </span>
                <span className="text-slate-600 font-bold">{selectedItem.description}</span>
              </div>

              {/* Why Separate */}
              <div className="bg-green-50 p-2.5 rounded-2xl border border-green-200">
                <span className="font-black text-green-900">♻️ Neden Ayrı Toplanmalı: </span>
                <span className="text-green-800 font-bold">{selectedItem.whySeparate}</span>
              </div>

              {/* Fun Fact */}
              <div className="bg-amber-50 p-2.5 rounded-2xl border border-amber-200">
                <span className="font-black text-amber-900">💡 Biliyor muydun? </span>
                <span className="text-amber-800 font-bold">{selectedItem.funFact}</span>
              </div>
            </div>

            {/* Close Button */}
            <button
              id="card-modal-close"
              onClick={() => {
                soundManager.playPop();
                setSelectedItem(null);
              }}
              className="mt-4 w-full py-3 rounded-2xl bg-green-500 hover:bg-green-600 text-white font-['Fredoka',sans-serif] font-black text-sm shadow-md active:scale-95 transition-all cursor-pointer"
            >
              Anladım, Teşekkürler! 👍
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
