import React, { useState } from 'react';
import { ArrowLeft, Sparkles, CheckCircle2, AlertCircle, RotateCcw, Award } from 'lucide-react';
import { useGame } from '../../context/GameContext';
import { QUIZ_QUESTIONS } from '../../data/quizData';
import { soundManager } from '../../utils/audio';
import { triggerStarConfetti } from '../../utils/confetti';

export const EcoQuizGame: React.FC = () => {
  const { setActiveGame, recordQuizCorrect, showToast, campaignState, handleGameCompleteInCampaign } = useGame();
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  const currentQ = QUIZ_QUESTIONS[currentIdx];

  const handleOptionClick = (optionIdx: number) => {
    if (isAnswered || isFinished) return;

    setSelectedOption(optionIdx);
    setIsAnswered(true);

    if (optionIdx === currentQ.correctIndex) {
      soundManager.playSuccess();
      triggerStarConfetti();
      recordQuizCorrect();
      setScore((prev) => prev + 20);
      setCorrectCount((prev) => prev + 1);
      showToast('Doğru Cevap! +20 Puan, +1 Yıldız 🌟', 'star');
    } else {
      soundManager.playWrong();
      showToast('Neredeyse doğruydu! İpucuna göz at 🌱', 'info');
    }
  };

  const handleNextQuestion = () => {
    soundManager.playPop();
    if (currentIdx + 1 >= QUIZ_QUESTIONS.length) {
      setIsFinished(true);
      if (campaignState.isActive) {
        handleGameCompleteInCampaign('quiz');
      } else {
        soundManager.playLevelUp();
        triggerStarConfetti();
      }
    } else {
      setCurrentIdx((prev) => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    }
  };

  const handleRestart = () => {
    soundManager.playPop();
    setCurrentIdx(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setScore(0);
    setCorrectCount(0);
    setIsFinished(false);
  };

  return (
    <div className="max-w-3xl mx-auto pb-28 space-y-4">
      {/* Top Header */}
      <div className="bg-white/80 backdrop-blur-md rounded-3xl p-3 sm:p-4 border border-white shadow-lg flex items-center justify-between gap-3">
        <button
          id="quiz-back-button"
          onClick={() => {
            soundManager.playPop();
            setActiveGame(null);
          }}
          className="flex items-center gap-1.5 text-slate-700 bg-white border border-gray-200 px-3.5 py-2 rounded-2xl font-bold text-xs shadow-xs hover:bg-gray-50 active:scale-95 transition-all cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 text-green-700" />
          <span>Geri Dön</span>
        </button>

        {/* Score & Counter */}
        <div className="flex items-center gap-2 sm:gap-3 flex-wrap justify-end">
          {campaignState.isActive && (
            <div className="bg-purple-600 text-white px-3 py-1 rounded-2xl text-[11px] font-black shadow-xs flex items-center gap-1 animate-pulse">
              <span>🌟</span>
              <span>3. Bölüm (3/3)</span>
            </div>
          )}

          <div className="bg-amber-50 text-amber-900 border border-amber-200 px-3.5 py-1.5 rounded-2xl text-xs sm:text-sm font-black flex items-center gap-1.5 shadow-xs">
            <span>⭐</span>
            <span className="font-['Fredoka',sans-serif]">{score} Puan</span>
          </div>

          <div className="bg-purple-50 text-purple-900 border border-purple-200 px-3.5 py-1.5 rounded-2xl text-xs sm:text-sm font-black shadow-xs">
            ❓ {currentIdx + 1}/{QUIZ_QUESTIONS.length}
          </div>
        </div>
      </div>

      {/* Main Quiz Box */}
      <div className="bg-white/70 backdrop-blur-md rounded-[36px] sm:rounded-[40px] border-4 border-white p-6 sm:p-8 shadow-xl relative overflow-hidden select-none">
        {!isFinished && currentQ ? (
          <div>
            {/* Question Badge & Title */}
            <div className="flex items-center gap-3 mb-4">
              <span className="w-12 h-12 rounded-2xl bg-purple-500 text-white flex items-center justify-center text-2xl shadow-md shrink-0">
                {currentQ.icon}
              </span>
              <div>
                <span className="text-[10px] font-black text-purple-700 uppercase tracking-widest bg-purple-100 px-2.5 py-0.5 rounded-full">
                  Soru {currentIdx + 1}
                </span>
                <h3 className="font-['Fredoka',sans-serif] text-lg sm:text-xl font-black text-slate-900 leading-snug mt-1">
                  {currentQ.question}
                </h3>
              </div>
            </div>

            {/* 3 Options with tactile feel */}
            <div className="space-y-3 my-5">
              {currentQ.options.map((option, idx) => {
                const isSelected = selectedOption === idx;
                const isCorrect = idx === currentQ.correctIndex;

                let btnStyles = 'bg-white border-2 border-gray-200 text-slate-800 hover:border-purple-300 hover:shadow-md';

                if (isAnswered) {
                  if (isCorrect) {
                    btnStyles = 'bg-green-500 border-2 border-green-400 text-white shadow-lg ring-2 ring-green-300';
                  } else if (isSelected && !isCorrect) {
                    btnStyles = 'bg-orange-100 border-2 border-orange-300 text-orange-950 shadow-xs';
                  } else {
                    btnStyles = 'bg-white/60 border border-gray-200 text-gray-400 opacity-50';
                  }
                }

                return (
                  <button
                    key={idx}
                    id={`quiz-option-${idx}`}
                    onClick={() => handleOptionClick(idx)}
                    disabled={isAnswered}
                    className={`w-full text-left p-4 rounded-2xl font-black text-xs sm:text-sm transition-all flex items-center justify-between gap-3 active:scale-98 cursor-pointer shadow-xs ${btnStyles}`}
                  >
                    <span>{option}</span>
                    {isAnswered && isCorrect && <CheckCircle2 className="w-5 h-5 text-white shrink-0" />}
                  </button>
                );
              })}
            </div>

            {/* Explanation card after answer */}
            {isAnswered && (
              <div
                className={`p-4 rounded-2xl border-2 mb-4 text-xs sm:text-sm font-bold animate-fadeIn ${
                  selectedOption === currentQ.correctIndex
                    ? 'bg-green-50 border-green-300 text-green-950 shadow-xs'
                    : 'bg-orange-50 border-orange-300 text-orange-950 shadow-xs'
                }`}
              >
                <div className="flex items-start gap-2.5">
                  <span className="text-2xl shrink-0">
                    {selectedOption === currentQ.correctIndex ? '🎉' : '💡'}
                  </span>
                  <div>
                    <p className="font-black text-sm">{currentQ.explanation}</p>
                    <p className="text-xs text-slate-600 mt-1 font-semibold">
                      Önemli Not: {currentQ.tip}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Next button */}
            {isAnswered && (
              <button
                id="quiz-next-button"
                onClick={handleNextQuestion}
                className="w-full py-3.5 sm:py-4 rounded-2xl bg-purple-500 hover:bg-purple-600 text-white font-['Fredoka',sans-serif] font-black text-base shadow-lg shadow-purple-200 flex items-center justify-center gap-2 active:scale-95 transition-all cursor-pointer animate-pulse"
              >
                <span>{currentIdx + 1 >= QUIZ_QUESTIONS.length ? 'Sonuçları Gör' : 'Sıradaki Soruya Geç'}</span>
                <Sparkles className="w-4 h-4 text-amber-300" />
              </button>
            )}
          </div>
        ) : (
          /* Finished State */
          <div className="text-center py-6">
            <div className="w-20 h-20 mx-auto rounded-[28px] bg-amber-400 text-amber-950 p-2 shadow-2xl mb-3 flex items-center justify-center text-4xl animate-bounce border-4 border-white">
              🧠🏆
            </div>
            <h3 className="font-['Fredoka',sans-serif] text-2xl sm:text-3xl font-black text-slate-900">
              Eko Bulmaca Tamamlandı!
            </h3>
            <p className="text-xs sm:text-sm font-bold text-slate-600 mt-1.5">
              Toplam <span className="text-purple-600 font-black">{QUIZ_QUESTIONS.length}</span> sorudan <span className="text-green-600 font-black">{correctCount}</span> tanesini doğru bildin!
            </p>
            <div className="inline-block bg-amber-100 text-amber-900 font-black text-sm px-5 py-2 rounded-2xl my-4 border border-amber-300 shadow-xs">
              +{score} EkoPuan Kazandın! ⭐
            </div>

            {campaignState.isActive ? (
              <div className="flex flex-col gap-2.5 mt-4 max-w-xs mx-auto w-full">
                <button
                  id="quiz-claim-diploma-btn"
                  onClick={() => handleGameCompleteInCampaign('quiz')}
                  className="w-full py-3.5 px-5 rounded-2xl bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 hover:from-amber-500 hover:to-yellow-500 text-amber-950 font-['Fredoka',sans-serif] font-black text-sm sm:text-base shadow-xl shadow-amber-300/40 flex items-center justify-center gap-2 active:scale-95 transition-all cursor-pointer animate-pulse"
                >
                  <span>DİPLOMAMI AL VE PDF İNDİR 🎓📥</span>
                </button>
                <div className="flex gap-2">
                  <button
                    id="quiz-restart-button"
                    onClick={handleRestart}
                    className="flex-1 flex items-center justify-center gap-1.5 bg-purple-100 hover:bg-purple-200 text-purple-900 font-bold text-xs py-2.5 px-3 rounded-xl active:scale-95 transition-all cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Tekrar Çöz</span>
                  </button>
                  <button
                    id="quiz-exit-button"
                    onClick={() => {
                      soundManager.playPop();
                      setActiveGame(null);
                    }}
                    className="flex-1 bg-gray-100 hover:bg-gray-200 text-slate-700 font-bold text-xs py-2.5 px-3 rounded-xl active:scale-95 transition-all cursor-pointer"
                  >
                    Oyun Listesi
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex gap-3 justify-center mt-2">
                <button
                  id="quiz-restart-button"
                  onClick={handleRestart}
                  className="flex items-center gap-2 bg-purple-500 hover:bg-purple-600 text-white font-['Fredoka',sans-serif] font-black text-sm px-5 py-3 rounded-2xl shadow-lg active:scale-95 transition-all cursor-pointer"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Tekrar Çöz</span>
                </button>
                <button
                  id="quiz-exit-button"
                  onClick={() => {
                    soundManager.playPop();
                    setActiveGame(null);
                  }}
                  className="bg-white border border-gray-200 text-slate-700 font-bold text-sm px-5 py-3 rounded-2xl active:scale-95 transition-all cursor-pointer hover:bg-gray-50"
                >
                  Oyun Listesi
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
