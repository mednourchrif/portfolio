import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const BOOT_LINES = [
  { text: '> Initializing Mohamed.dev...', delay: 0 },
  { text: '> Loading AI modules...', delay: 800 },
  { text: '> Syncing GitHub data...', delay: 1600 },
  { text: '> Compiling experience matrix...', delay: 2400 },
  { text: '> Interface Ready.', delay: 3200, accent: true },
];

const STORAGE_KEY = 'mnc-intro-seen';

function TerminalLine({ text, accent, index }) {
  const [displayed, setDisplayed] = useState('');
  const [done, setDone] = useState(false);

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      if (i <= text.length) {
        setDisplayed(text.slice(0, i));
        i++;
      } else {
        clearInterval(interval);
        setDone(true);
      }
    }, 20);
    return () => clearInterval(interval);
  }, [text]);

  return (
    <motion.div
      initial={{ opacity: 0, x: -15 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
      className="flex items-center gap-2"
    >
      <span
        className={`font-mono text-sm md:text-base ${
          accent ? 'text-[var(--color-blue-100)]' : 'text-[var(--color-text-secondary)]'
        }`}
      >
        {displayed}
        {!done && (
          <motion.span
            animate={{ opacity: [1, 0] }}
            transition={{ duration: 0.5, repeat: Infinity }}
            className="inline-block w-2 h-4 ml-0.5 bg-[var(--color-accent)]"
          />
        )}
      </span>
      {done && accent && (
        <motion.span
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 500, damping: 15 }}
          className="inline-block w-2 h-2 rounded-full bg-[var(--color-success)]"
        />
      )}
    </motion.div>
  );
}

/* Progress bar that fills during boot */
function ProgressBar({ progress }) {
  return (
    <div className="mt-6 h-0.5 w-full bg-[var(--color-border)] rounded-full overflow-hidden">
      <motion.div
        initial={{ width: '0%' }}
        animate={{ width: `${progress}%` }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className="h-full bg-gradient-to-r from-[var(--color-blue-600)] to-[var(--color-blue-100)] rounded-full"
      />
    </div>
  );
}

export default function IntroAnimation({ onComplete }) {
  const [visibleLines, setVisibleLines] = useState([]);
  const [phase, setPhase] = useState('boot');
  const [progress, setProgress] = useState(0);

  const skipIntro = useCallback(() => {
    setPhase('fadeout');
    setTimeout(() => {
      localStorage.setItem(STORAGE_KEY, 'true');
      onComplete();
    }, 600);
  }, [onComplete]);

  useEffect(() => {
    if (localStorage.getItem(STORAGE_KEY)) {
      onComplete();
      return;
    }

    BOOT_LINES.forEach((line, idx) => {
      setTimeout(() => {
        setVisibleLines((prev) => [...prev, { ...line, index: idx }]);
        setProgress(((idx + 1) / BOOT_LINES.length) * 100);
      }, line.delay);
    });

    const totalDuration = BOOT_LINES[BOOT_LINES.length - 1].delay + 1500;
    const timer = setTimeout(() => {
      skipIntro();
    }, totalDuration);

    return () => clearTimeout(timer);
  }, [onComplete, skipIntro]);

  if (phase === 'done') return null;

  return (
    <AnimatePresence>
      {phase !== 'done' && (
        <motion.div
          key="intro"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          animate={{ opacity: phase === 'fadeout' ? 0 : 1 }}
          transition={{ duration: 0.6 }}
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-[var(--color-bg)]"
          onClick={skipIntro}
        >
          {/* Grid overlay */}
          <div
            className="absolute inset-0 pointer-events-none opacity-[0.02]"
            style={{
              backgroundImage:
                'linear-gradient(rgba(79,107,255,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(79,107,255,0.15) 1px, transparent 1px)',
              backgroundSize: '60px 60px',
            }}
          />

          {/* Scanline effect */}
          <div
            className="absolute inset-0 pointer-events-none opacity-[0.02]"
            style={{
              backgroundImage:
                'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.03) 2px, rgba(255,255,255,0.03) 4px)',
            }}
          />

          {/* Radial glow */}
          <div className="absolute inset-0 pointer-events-none" style={{
            background: 'radial-gradient(ellipse at center, rgba(79,107,255,0.04) 0%, transparent 70%)',
          }} />

          {/* Glitch overlay */}
          <motion.div
            className="absolute inset-0 pointer-events-none"
            animate={{
              opacity: [0, 0.02, 0, 0.01, 0],
              x: [0, -2, 0, 1, 0],
            }}
            transition={{ duration: 0.3, repeat: Infinity, repeatDelay: 2 }}
            style={{
              background:
                'linear-gradient(90deg, transparent 0%, rgba(79,107,255,0.05) 50%, transparent 100%)',
            }}
          />

          <div className="relative max-w-lg w-full px-8">
            {/* Terminal header */}
            <div className="flex items-center gap-2 mb-6">
              <div className="w-3 h-3 rounded-full bg-[var(--color-error)] opacity-60" />
              <div className="w-3 h-3 rounded-full bg-[var(--color-warning)] opacity-60" />
              <div className="w-3 h-3 rounded-full bg-[var(--color-success)] opacity-60" />
              <span className="text-[var(--color-text-muted)] text-xs ml-3 font-mono">
                system.init
              </span>
            </div>

            {/* Boot lines */}
            <div className="space-y-3">
              {visibleLines.map((line) => (
                <TerminalLine
                  key={line.index}
                  text={line.text}
                  accent={line.accent}
                  index={line.index}
                />
              ))}
            </div>

            {/* Progress bar */}
            <ProgressBar progress={progress} />

            {/* Skip hint */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.3 }}
              transition={{ delay: 1 }}
              className="text-[var(--color-text-muted)] text-xs font-mono mt-6 text-center"
            >
              click anywhere to skip
            </motion.p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
