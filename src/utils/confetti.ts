import confetti from 'canvas-confetti';

export const triggerStarConfetti = () => {
  try {
    confetti({
      particleCount: 40,
      spread: 60,
      origin: { y: 0.6 },
      colors: ['#10B981', '#34D399', '#FBBF24', '#60A5FA', '#F472B6'],
      shapes: ['star', 'circle'],
      scalar: 1.2,
    });
  } catch {
    // fallback if canvas not available
  }
};

export const triggerLevelUpCelebration = () => {
  try {
    const duration = 2.5 * 1000;
    const end = Date.now() + duration;

    (function frame() {
      confetti({
        particleCount: 5,
        angle: 60,
        spread: 55,
        origin: { x: 0, y: 0.7 },
        colors: ['#10B981', '#F59E0B', '#3B82F6', '#EC4899', '#8B5CF6'],
      });
      confetti({
        particleCount: 5,
        angle: 120,
        spread: 55,
        origin: { x: 1, y: 0.7 },
        colors: ['#10B981', '#F59E0B', '#3B82F6', '#EC4899', '#8B5CF6'],
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    })();
  } catch {
    // safe fallback
  }
};
