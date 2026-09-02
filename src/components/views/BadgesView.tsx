import React, { useState, useRef, useEffect } from 'react';
import { Award, Trophy, Sparkles, CheckCircle2, Lock, Download, Printer, Star, X, Edit3, Check, User, ShieldCheck } from 'lucide-react';
import { useGame } from '../../context/GameContext';
import { BADGES, LEVEL_NAMES, LEVEL_XP_THRESHOLDS } from '../../data/badgesData';
import { soundManager } from '../../utils/audio';
import jsPDF from 'jspdf';

function renderDiplomaToCanvas(
  stats: { points: number; level: number; userName?: string; eWasteFound: number; itemsSorted: number; unlockedBadges: string[] },
  currentLevelName: string,
  totalBadges: number,
  todayDateFormatted: string
): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = 1600;
  canvas.height = 1131; // A4 Landscape ratio (1.414)
  const ctx = canvas.getContext('2d');
  if (!ctx) return canvas;

  // 1. Background: Warm parchment luxury gradient
  const bgGrad = ctx.createLinearGradient(0, 0, 1600, 1131);
  bgGrad.addColorStop(0, '#FFFEFA');
  bgGrad.addColorStop(0.5, '#FAF6EB');
  bgGrad.addColorStop(1, '#F7F0DC');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, 1600, 1131);

  // Subtle security pattern / guilloche background grid
  ctx.strokeStyle = 'rgba(217, 119, 6, 0.05)';
  ctx.lineWidth = 1;
  for (let i = 40; i < 1600; i += 40) {
    ctx.beginPath();
    ctx.moveTo(i, 40);
    ctx.lineTo(i, 1091);
    ctx.stroke();
  }
  for (let j = 40; j < 1131; j += 40) {
    ctx.beginPath();
    ctx.moveTo(40, j);
    ctx.lineTo(1560, j);
    ctx.stroke();
  }

  // 2. Outer Ornate Golden Borders
  ctx.strokeStyle = '#B45309';
  ctx.lineWidth = 14;
  ctx.strokeRect(30, 30, 1540, 1071);

  ctx.strokeStyle = '#F59E0B';
  ctx.lineWidth = 4;
  ctx.strokeRect(44, 44, 1512, 1043);

  ctx.strokeStyle = '#D97706';
  ctx.lineWidth = 2;
  ctx.strokeRect(52, 52, 1496, 1027);

  // Corner Ornaments (Gold Fleurons / Corner Diamonds)
  const drawCornerDeco = (x: number, y: number) => {
    ctx.save();
    ctx.translate(x, y);
    ctx.fillStyle = '#D97706';
    ctx.beginPath();
    ctx.arc(0, 0, 12, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#FDE68A';
    ctx.beginPath();
    ctx.arc(0, 0, 6, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  };
  drawCornerDeco(52, 52);
  drawCornerDeco(1548, 52);
  drawCornerDeco(52, 1079);
  drawCornerDeco(1548, 1079);

  // 3. Header Ribbon Pill
  ctx.fillStyle = '#ECFDF5';
  ctx.strokeStyle = '#059669';
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.roundRect(380, 75, 840, 48, 24);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = '#065F46';
  ctx.font = 'bold 18px "Segoe UI", Arial, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('RESMİ ÇEVRE VE DOĞA KORUYUCUSU MEZUNİYET BELGESİ', 800, 106);

  // 4. Main Title
  ctx.fillStyle = '#064E3B';
  ctx.font = '900 48px "Segoe UI", Arial, sans-serif';
  ctx.fillText('🎓 EKOKAŞİF E-ATIK DİPLOMASI 🎓', 800, 180);

  // Document ID & Date
  ctx.fillStyle = '#64748B';
  ctx.font = 'bold 18px "Segoe UI", Arial, sans-serif';
  ctx.fillText(`Belge No: EK-2026-${stats.points.toString().padStart(4, '0')}   •   Düzenleme Tarihi: ${todayDateFormatted}`, 800, 220);

  // 5. Recipient Plaque
  ctx.fillStyle = 'rgba(254, 243, 199, 0.6)';
  ctx.strokeStyle = '#FBBF24';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.roundRect(250, 260, 1100, 190, 24);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = '#475569';
  ctx.font = '600 20px "Segoe UI", Arial, sans-serif';
  ctx.fillText('Bu Üstün Çevre Koruma Başarı Belgesi', 800, 305);

  const recipientName = (stats.userName && stats.userName.trim()) || 'Değerli EkoKaşif';
  ctx.fillStyle = '#065F46';
  ctx.font = '900 52px "Segoe UI", Arial, sans-serif';
  ctx.fillText(recipientName, 800, 375);

  // Gold accent line under name
  ctx.strokeStyle = '#D97706';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(450, 395);
  ctx.lineTo(1150, 395);
  ctx.stroke();

  ctx.fillStyle = '#047857';
  ctx.font = 'bold 20px "Segoe UI", Arial, sans-serif';
  ctx.fillText('adına gururla ve resmi onayla tanzim edilmiştir.', 800, 430);

  // 6. Commendation / Statement text
  ctx.fillStyle = '#334155';
  ctx.font = '600 22px "Segoe UI", Arial, sans-serif';
  ctx.fillText('Elektronik atıkları (e-atık) doğru tanıyıp ayrıştırarak doğamızı zehirli kimyasallardan korumuş,', 800, 490);
  ctx.fillText('EkoBahçeyi yeşillendirerek resmi "EkoKaşif Doğa Koruyucusu" unvanını almaya hak kazanmıştır.', 800, 525);

  // 7. Stats Panel (4 elegant boxes)
  const boxes = [
    { label: 'KADEME & SEVİYE', value: `${stats.level}. Seviye - ${currentLevelName}`, color: '#047857' },
    { label: 'TOPLAM PUAN', value: `${stats.points} EkoPuan`, color: '#D97706' },
    { label: 'KURTARILAN E-ATIK', value: `${stats.eWasteFound + stats.itemsSorted} Adet`, color: '#059669' },
    { label: 'KAZANILAN ROZET', value: `${stats.unlockedBadges.length} / ${totalBadges} Rozet`, color: '#4F46E5' },
  ];

  const boxWidth = 270;
  const boxHeight = 110;
  const startX = 225;
  const gap = 20;
  const boxY = 575;

  boxes.forEach((b, idx) => {
    const x = startX + idx * (boxWidth + gap);
    ctx.fillStyle = '#FFFFFF';
    ctx.strokeStyle = '#E2E8F0';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.roundRect(x, boxY, boxWidth, boxHeight, 16);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#64748B';
    ctx.font = 'bold 15px "Segoe UI", Arial, sans-serif';
    ctx.fillText(b.label, x + boxWidth / 2, boxY + 38);

    ctx.fillStyle = b.color;
    ctx.font = '900 24px "Segoe UI", Arial, sans-serif';
    ctx.fillText(b.value, x + boxWidth / 2, boxY + 80);
  });

  // 8. Signatures & Official Gold Seal Stamp
  const sigY = 760;

  // Left Signature: EkoKaşif Kurulu
  ctx.fillStyle = '#065F46';
  ctx.font = '900 22px "Segoe UI", Arial, sans-serif';
  ctx.fillText('🌱 EkoKaşif Yönetim Kurulu', 400, sigY + 140);
  ctx.fillStyle = '#64748B';
  ctx.font = '600 16px "Segoe UI", Arial, sans-serif';
  ctx.fillText('Çevre & Doğa Koruma Heyeti', 400, sigY + 170);
  ctx.strokeStyle = '#CBD5E1';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(250, sigY + 115);
  ctx.lineTo(550, sigY + 115);
  ctx.stroke();

  // Right Signature: Doğa Muhafızı
  ctx.fillStyle = '#065F46';
  ctx.font = '900 22px "Segoe UI", Arial, sans-serif';
  ctx.fillText('🦊 Doğa Muhafızı', 1200, sigY + 140);
  ctx.fillStyle = '#64748B';
  ctx.font = '600 16px "Segoe UI", Arial, sans-serif';
  ctx.fillText('Resmi Başarı & Mezuniyet Onayı', 1200, sigY + 170);
  ctx.beginPath();
  ctx.moveTo(1050, sigY + 115);
  ctx.lineTo(1350, sigY + 115);
  ctx.stroke();

  // Center Gold Seal (Circular Ornate Seal)
  const sealX = 800;
  const sealY = sigY + 105;

  ctx.save();
  ctx.beginPath();
  ctx.arc(sealX, sealY, 70, 0, Math.PI * 2);
  const sealGrad = ctx.createRadialGradient(sealX, sealY, 10, sealX, sealY, 70);
  sealGrad.addColorStop(0, '#FDE68A');
  sealGrad.addColorStop(0.7, '#F59E0B');
  sealGrad.addColorStop(1, '#D97706');
  ctx.fillStyle = sealGrad;
  ctx.fill();
  ctx.strokeStyle = '#B45309';
  ctx.lineWidth = 5;
  ctx.stroke();

  // Inner ring
  ctx.beginPath();
  ctx.arc(sealX, sealY, 56, 0, Math.PI * 2);
  ctx.strokeStyle = '#78350F';
  ctx.lineWidth = 1.5;
  ctx.stroke();

  ctx.fillStyle = '#78350F';
  ctx.font = 'bold 30px "Segoe UI", Arial, sans-serif';
  ctx.fillText('★', sealX, sealY - 18);
  ctx.font = '900 14px "Segoe UI", Arial, sans-serif';
  ctx.fillText('ONAYLANDI', sealX, sealY + 5);
  ctx.font = 'bold 11px "Segoe UI", Arial, sans-serif';
  ctx.fillText('RESMİ MÜHÜR', sealX, sealY + 24);
  ctx.restore();

  return canvas;
}

export const BadgesView: React.FC = () => {
  const { stats, showToast, setUserName, openCertificateDirectly, setOpenCertificateDirectly } = useGame();
  const [showCertificate, setShowCertificate] = useState(false);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [isEditingName, setIsEditingName] = useState(false);
  const [tempName, setTempName] = useState(stats.userName || '');
  const certificateRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (openCertificateDirectly) {
      setShowCertificate(true);
      setOpenCertificateDirectly(false);
      soundManager.playLevelUp();
    }
  }, [openCertificateDirectly, setOpenCertificateDirectly]);

  const currentLevelName = LEVEL_NAMES[stats.level] || 'EkoKaşif';
  const unlockedCount = stats.unlockedBadges.length;
  const totalBadges = BADGES.length;

  const handleBadgeClick = (badgeName: string, isUnlocked: boolean, desc: string) => {
    soundManager.playPop();
    if (isUnlocked) {
      showToast(`🏆 ${badgeName}: ${desc}`, 'star');
    } else {
      showToast(`🔒 ${badgeName} henüz kilitli: ${desc}`, 'info');
    }
  };

  const handleSaveName = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (tempName.trim()) {
      setUserName(tempName.trim());
      setIsEditingName(false);
      showToast('İsminiz diplomaya kaydedildi! ✨', 'success');
    }
  };

  const handleDownloadPDF = async () => {
    try {
      setIsGeneratingPdf(true);
      soundManager.playPop();
      showToast('Diplomanız yüksek kalitede PDF olarak hazırlanıyor... 📄', 'info');

      // Generate flawless Canvas directly via 2D Canvas API
      const canvas = renderDiplomaToCanvas(stats, currentLevelName, totalBadges, todayDateFormatted);

      // Convert to high-quality Image Data
      const imgData = canvas.toDataURL('image/jpeg', 0.95);

      // Create standard A4 Landscape jsPDF document
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: 'a4',
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();

      pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight);

      const recipientName = stats.userName.trim() || 'EkoKasif';
      const cleanFileName = recipientName.replace(/[^a-zA-Z0-9çğıöşüÇĞİÖŞÜ]/g, '_');
      const fileName = `EkoKasif_Diplomasi_${cleanFileName}.pdf`;

      // Safe saving with fallback
      try {
        pdf.save(fileName);
      } catch {
        const blob = pdf.output('blob');
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        setTimeout(() => URL.revokeObjectURL(url), 4000);
      }

      soundManager.playLevelUp();
      showToast('Diplomanız başarıyla PDF olarak indirildi! 🎓🎉', 'success');
    } catch (error) {
      console.error('PDF export error:', error);
      showToast('PDF oluşturulurken bir hata oluştu.', 'info');
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  const handlePrintDiploma = () => {
    try {
      soundManager.playPop();
      const canvas = renderDiplomaToCanvas(stats, currentLevelName, totalBadges, todayDateFormatted);
      const imgData = canvas.toDataURL('image/png');
      const win = window.open('', '_blank');
      if (win) {
        win.document.write(`
          <!DOCTYPE html>
          <html>
            <head>
              <title>EkoKaşif Diploması - ${stats.userName || 'Kaşif'}</title>
              <style>
                body { margin: 0; display: flex; align-items: center; justify-content: center; min-height: 100vh; background: #555; }
                img { max-width: 95vw; max-height: 95vh; box-shadow: 0 10px 30px rgba(0,0,0,0.5); }
                @media print {
                  body { background: transparent; }
                  img { width: 100%; height: auto; max-width: none; box-shadow: none; }
                }
              </style>
            </head>
            <body>
              <img src="${imgData}" onload="window.print()" />
            </body>
          </html>
        `);
        win.document.close();
      } else {
        handleDownloadPDF();
      }
    } catch (err) {
      console.error('Print preview error:', err);
      handleDownloadPDF();
    }
  };

  const todayDateFormatted = new Date().toLocaleDateString('tr-TR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <div className="max-w-3xl mx-auto pb-12 space-y-4">
      {/* Level Summary Header Card */}
      <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-green-600 rounded-[32px] sm:rounded-[36px] p-5 sm:p-6 text-white shadow-xl relative overflow-hidden border-2 border-white/20">
        <div className="flex items-center justify-between gap-3 relative z-10">
          <div>
            <div className="inline-flex items-center gap-1.5 bg-white/20 backdrop-blur-md text-xs font-black px-3 py-1 rounded-full mb-2 text-emerald-100 border border-white/20">
              <Trophy className="w-4 h-4 text-amber-300" />
              <span>{stats.level}. Kademe</span>
            </div>
            <h2 className="font-['Fredoka',sans-serif] text-2xl sm:text-3xl font-black">
              {currentLevelName}
            </h2>
            <p className="text-xs sm:text-sm font-bold text-emerald-100 mt-1">
              Toplam {stats.points} EkoPuan | {unlockedCount}/{totalBadges} Rozet Kazanıldı
            </p>
          </div>

          <button
            id="open-certificate-btn"
            onClick={() => {
              soundManager.playPop();
              setTempName(stats.userName || '');
              setShowCertificate(true);
            }}
            className="bg-amber-400 hover:bg-amber-500 text-amber-950 font-['Fredoka',sans-serif] font-black text-xs sm:text-sm px-4 sm:px-5 py-2.5 rounded-2xl shadow-lg active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer shrink-0 border-2 border-white"
          >
            <span>📜 Diplomam & PDF İndir</span>
          </button>
        </div>

        {/* Level Progression Dots */}
        <div className="grid grid-cols-5 gap-2 mt-5 pt-4 border-t border-white/20 relative z-10">
          {[1, 2, 3, 4, 5].map((lvl) => {
            const isPassed = stats.level >= lvl;
            return (
              <div key={lvl} className="flex flex-col items-center text-center">
                <div
                  className={`w-8 h-8 sm:w-9 sm:h-9 rounded-2xl flex items-center justify-center font-black text-xs transition-transform ${
                    isPassed
                      ? 'bg-amber-400 text-amber-950 shadow-md scale-105 border-2 border-white'
                      : 'bg-emerald-800/60 text-emerald-300'
                  }`}
                >
                  {isPassed ? '✓' : lvl}
                </div>
                <span className="text-[10px] font-black text-emerald-100 mt-1 line-clamp-1">
                  {LEVEL_NAMES[lvl]}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Badges Grid Section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-['Fredoka',sans-serif] text-lg sm:text-xl font-black text-green-950 flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-500" />
            <span>Kazanılan Başarı Rozetleri</span>
          </h3>
          <span className="text-xs font-black text-slate-700 bg-white/90 border border-white px-3 py-1.5 rounded-2xl shadow-xs">
            {unlockedCount} / {totalBadges} Açık
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {BADGES.map((badge) => {
            const isUnlocked = stats.unlockedBadges.includes(badge.id);

            let currentCount = 0;
            if (badge.currentCountKey === 'gardenItemsUnlocked') {
              currentCount = stats.unlockedGardenItems.length;
            } else {
              currentCount = stats[badge.currentCountKey] || 0;
            }

            const progress = Math.min(100, Math.round((currentCount / badge.targetCount) * 100));

            return (
              <button
                key={badge.id}
                id={`badge-card-${badge.id}`}
                onClick={() => handleBadgeClick(badge.name, isUnlocked, badge.description)}
                className={`p-4 rounded-[28px] border text-left flex items-start gap-3.5 transition-all active:scale-98 cursor-pointer ${
                  isUnlocked
                    ? 'bg-white/80 backdrop-blur-md border-white shadow-sm hover:shadow-lg hover:border-green-300'
                    : 'bg-slate-100/80 border-gray-200 opacity-60'
                }`}
              >
                {/* Badge Icon */}
                <div
                  className={`w-14 h-14 rounded-2xl flex items-center justify-center text-3xl shrink-0 shadow-sm ${
                    isUnlocked
                      ? `bg-gradient-to-tr ${badge.color} text-white shadow-md`
                      : 'bg-slate-200 text-slate-400 grayscale'
                  }`}
                >
                  {badge.icon}
                </div>

                {/* Badge Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <h4 className="font-['Fredoka',sans-serif] font-black text-sm text-slate-900 truncate">
                      {badge.name}
                    </h4>
                    {isUnlocked ? (
                      <span className="text-green-600 text-xs font-black flex items-center gap-0.5 bg-green-50 px-2 py-0.5 rounded-lg border border-green-200">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Kazanıldı
                      </span>
                    ) : (
                      <span className="text-slate-400 text-xs font-bold flex items-center gap-0.5">
                        <Lock className="w-3 h-3" />
                        Kilitli
                      </span>
                    )}
                  </div>

                  <p className="text-xs font-bold text-gray-500 mt-0.5 leading-snug">
                    {badge.description}
                  </p>

                  {/* Mini Progress */}
                  {!isUnlocked && (
                    <div className="mt-2">
                      <div className="flex justify-between text-[10px] font-bold text-slate-500 mb-0.5">
                        <span>İlerleme: {currentCount}/{badge.targetCount}</span>
                        <span>%{progress}</span>
                      </div>
                      <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                        <div
                          className="bg-green-500 h-full rounded-full transition-all duration-300"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Certificate Modal with PDF Export */}
      {showCertificate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-4 sm:p-6 shadow-2xl border-4 border-amber-300 relative my-auto">
            {/* Close Button Top Right */}
            <button
              onClick={() => setShowCertificate(false)}
              className="absolute top-3 right-3 w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-all cursor-pointer z-20"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Quick Name Editor inside Modal */}
            <div className="mb-4 bg-amber-50 border border-amber-200 rounded-2xl p-2.5 flex items-center justify-between gap-2">
              {isEditingName ? (
                <form onSubmit={handleSaveName} className="flex items-center gap-2 w-full">
                  <input
                    type="text"
                    value={tempName}
                    onChange={(e) => setTempName(e.target.value)}
                    placeholder="Ad ve Soyad"
                    className="flex-1 px-3 py-1.5 rounded-xl border border-amber-300 bg-white text-xs sm:text-sm font-bold focus:outline-hidden focus:ring-2 focus:ring-amber-400"
                    autoFocus
                  />
                  <button
                    type="submit"
                    className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-1 cursor-pointer"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Kaydet</span>
                  </button>
                </form>
              ) : (
                <>
                  <div className="flex items-center gap-2 text-xs sm:text-sm font-bold text-amber-950">
                    <User className="w-4 h-4 text-amber-700" />
                    <span>Diplomadaki İsim:</span>
                    <strong className="text-emerald-800 text-sm font-black">
                      {stats.userName || 'İsim Belirtilmedi'}
                    </strong>
                  </div>
                  <button
                    onClick={() => {
                      setTempName(stats.userName || '');
                      setIsEditingName(true);
                    }}
                    className="px-2.5 py-1 bg-amber-200 hover:bg-amber-300 text-amber-900 rounded-xl text-xs font-bold flex items-center gap-1 cursor-pointer transition-all"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>İsmi Düzenle</span>
                  </button>
                </>
              )}
            </div>

            {/* The Certificate Canvas element (Exported to PDF) */}
            <div
              ref={certificateRef}
              id="diploma-certificate-canvas"
              className="bg-gradient-to-br from-amber-50 via-white to-amber-50/90 rounded-2xl p-5 sm:p-7 border-8 border-double border-amber-400 shadow-inner text-center relative overflow-hidden"
              style={{
                boxShadow: 'inset 0 0 40px rgba(251, 191, 36, 0.15)',
              }}
            >
              {/* Ornate Corner Accents */}
              <div className="absolute top-2 left-2 text-xl text-amber-500 opacity-60">⚜️</div>
              <div className="absolute top-2 right-2 text-xl text-amber-500 opacity-60">⚜️</div>
              <div className="absolute bottom-2 left-2 text-xl text-amber-500 opacity-60">⚜️</div>
              <div className="absolute bottom-2 right-2 text-xl text-amber-500 opacity-60">⚜️</div>

              {/* Official Header */}
              <div className="flex items-center justify-center gap-2 text-xs font-black tracking-widest text-emerald-800 uppercase bg-emerald-100/90 py-1.5 px-4 rounded-full inline-flex border border-emerald-300 mb-2">
                <ShieldCheck className="w-4 h-4 text-emerald-700" />
                <span>RESMİ ÇEVRE VE DOĞA KORUYUCUSU MEZUNİYET BELGESİ</span>
              </div>

              <h2 className="font-['Fredoka',sans-serif] text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-1">
                🎓 EKOKAŞİF E-ATIK DİPLOMASI 🎓
              </h2>

              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                Belge No: EK-2026-00{stats.points} • Düzenleme Tarihi: {todayDateFormatted}
              </p>

              {/* Recipient Name Banner */}
              <div className="my-3.5 py-2 border-y-2 border-amber-300/80 bg-amber-100/40">
                <span className="text-xs font-semibold text-slate-500 block uppercase tracking-wider">
                  Bu Üstün Başarı Belgesi
                </span>
                <span className="font-['Fredoka',sans-serif] text-2xl sm:text-3xl font-black text-emerald-900 tracking-wide block mt-0.5">
                  {stats.userName || 'Değerli EkoKaşif'}
                </span>
                <span className="text-xs font-bold text-emerald-700 block">
                  adına gururla tanzim edilmiştir.
                </span>
              </div>

              {/* Certificate Statement */}
              <p className="text-xs sm:text-sm font-semibold text-slate-700 px-2 leading-relaxed max-w-lg mx-auto">
                Elektronik atıkları doğru tanıyıp ayrıştırarak doğamızı zehirli kimyasallardan korumuş,
                EkoBahçeyi yeşillendirerek resmi <strong className="text-emerald-800">EkoKaşif Doğa Koruyucusu</strong> unvanını
                almaya hak kazanmıştır.
              </p>

              {/* Stats Box */}
              <div className="bg-white/90 border-2 border-amber-200 rounded-2xl p-3 my-3.5 grid grid-cols-4 gap-2 text-center shadow-xs">
                <div className="border-r border-slate-200 pr-1">
                  <span className="text-[10px] font-bold text-slate-400 block">Seviye</span>
                  <span className="font-['Fredoka',sans-serif] font-black text-xs sm:text-sm text-green-700 truncate block">
                    {currentLevelName}
                  </span>
                </div>
                <div className="border-r border-slate-200 pr-1">
                  <span className="text-[10px] font-bold text-slate-400 block">Toplam Puan</span>
                  <span className="font-['Fredoka',sans-serif] font-black text-xs sm:text-sm text-amber-600 block">
                    ⭐ {stats.points}
                  </span>
                </div>
                <div className="border-r border-slate-200 pr-1">
                  <span className="text-[10px] font-bold text-slate-400 block">E-Atık</span>
                  <span className="font-['Fredoka',sans-serif] font-black text-xs sm:text-sm text-emerald-700 block">
                    🔋 {stats.eWasteFound + stats.itemsSorted} Adet
                  </span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 block">Rozetler</span>
                  <span className="font-['Fredoka',sans-serif] font-black text-xs sm:text-sm text-indigo-600 block">
                    🏆 {unlockedCount} / {totalBadges}
                  </span>
                </div>
              </div>

              {/* Signatures & Seal */}
              <div className="flex items-center justify-between pt-2 border-t border-amber-200/80 mt-3 px-2">
                <div className="text-left">
                  <div className="font-['Fredoka',sans-serif] text-xs font-black text-emerald-900">
                    🌱 EkoKaşif Kurulu
                  </div>
                  <div className="text-[10px] font-semibold text-slate-500">
                    Çevre & Doğa Koruma
                  </div>
                </div>

                {/* Gold Seal */}
                <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-amber-400 to-yellow-300 border-2 border-amber-500 text-amber-950 flex flex-col items-center justify-center shadow-md -my-2">
                  <Star className="w-4 h-4 fill-amber-600 text-amber-700" />
                  <span className="text-[8px] font-black tracking-tighter uppercase">ONAYLANDI</span>
                </div>

                <div className="text-right">
                  <div className="font-['Fredoka',sans-serif] text-xs font-black text-emerald-900">
                    🦊 Doğa Muhafızı
                  </div>
                  <div className="text-[10px] font-semibold text-slate-500">
                    Resmi Başarı Onayı
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons: PDF Download, Print & Close */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3 mt-4">
              <button
                id="download-pdf-diploma-btn"
                disabled={isGeneratingPdf}
                onClick={handleDownloadPDF}
                className="py-3 px-4 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-['Fredoka',sans-serif] font-black text-xs sm:text-sm shadow-lg flex items-center justify-center gap-2 active:scale-95 transition-all cursor-pointer disabled:opacity-50"
              >
                <Download className="w-4 h-4" />
                <span>{isGeneratingPdf ? 'PDF İndiriliyor...' : 'PDF Olarak İndir 📥'}</span>
              </button>

              <button
                id="print-preview-diploma-btn"
                onClick={handlePrintDiploma}
                className="py-3 px-4 rounded-2xl bg-amber-500 hover:bg-amber-600 text-amber-950 font-['Fredoka',sans-serif] font-black text-xs sm:text-sm shadow-md flex items-center justify-center gap-1.5 active:scale-95 transition-all cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                <span>Yazdır / Önizle 🖨️</span>
              </button>

              <button
                id="close-certificate-btn"
                onClick={() => {
                  soundManager.playPop();
                  setShowCertificate(false);
                }}
                className="py-3 px-4 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-['Fredoka',sans-serif] font-bold text-xs sm:text-sm active:scale-95 transition-all cursor-pointer text-center"
              >
                Kapat
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
