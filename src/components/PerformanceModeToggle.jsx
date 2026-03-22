import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { usePerformanceMode } from '../context/PerformanceModeContext';

export default function PerformanceModeToggle({ compact = false }) {
  const { t } = useTranslation();
  const { mode, setMode } = usePerformanceMode();

  return (
    <div className={`glass rounded-full p-1 flex items-center gap-1 ${compact ? '' : 'min-w-[170px]'}`}>
      <button
        onClick={() => setMode('cinematic')}
        className={`relative px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
          mode === 'cinematic' ? 'text-white' : 'text-[var(--color-text-secondary)]'
        }`}
        aria-label={t('nav.performance_cinematic')}
      >
        {mode === 'cinematic' && (
          <motion.span
            layoutId="performanceModePill"
            className="absolute inset-0 rounded-full bg-gradient-to-r from-[var(--color-blue-500)] to-[var(--color-blue-800)]"
            transition={{ type: 'spring', bounce: 0.2, duration: 0.4 }}
          />
        )}
        <span className="relative z-10">{t('nav.performance_cinematic')}</span>
      </button>

      <button
        onClick={() => setMode('smooth')}
        className={`relative px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
          mode === 'smooth' ? 'text-white' : 'text-[var(--color-text-secondary)]'
        }`}
        aria-label={t('nav.performance_smooth')}
      >
        {mode === 'smooth' && (
          <motion.span
            layoutId="performanceModePill"
            className="absolute inset-0 rounded-full bg-gradient-to-r from-[var(--color-blue-500)] to-[var(--color-blue-800)]"
            transition={{ type: 'spring', bounce: 0.2, duration: 0.4 }}
          />
        )}
        <span className="relative z-10">{t('nav.performance_smooth')}</span>
      </button>
    </div>
  );
}
