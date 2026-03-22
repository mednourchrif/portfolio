import { Suspense, lazy } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { FiArrowDown, FiMail } from 'react-icons/fi';

const HeroGeometry = lazy(() => import('../HeroGeometry'));

export default function Hero() {
  const { t } = useTranslation();

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative min-h-screen flex items-center pt-16">
      <div className="max-w-7xl mx-auto px-6 w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Text */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.45, delay: 0.3 }}
            className="flex items-center gap-3 mb-6"
          >
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--color-success)] opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[var(--color-success)]" />
            </span>
            <span className="text-[var(--color-text-muted)] text-xs font-mono uppercase tracking-[0.2em]">
              Available for work
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.45 }}
            className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6 text-gradient"
          >
            {t('hero.headline')}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="text-[var(--color-text-secondary)] text-lg md:text-xl leading-relaxed mb-10 max-w-xl"
          >
            {t('hero.subheadline')}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.75 }}
            className="flex flex-wrap gap-4"
          >
            <motion.button
              whileHover={{ scale: 1.04, boxShadow: '0 0 30px rgba(79,107,255,0.3)' }}
              whileTap={{ scale: 0.97 }}
              onClick={() => scrollTo('projects')}
              className="relative px-7 py-3.5 rounded-xl bg-gradient-to-r from-[var(--color-blue-500)] to-[var(--color-blue-900)] text-white font-medium text-sm overflow-hidden group"
            >
              <span className="relative z-10">{t('hero.cta_projects')}</span>
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-[var(--color-blue-400)] to-[var(--color-blue-700)] opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.04, borderColor: 'var(--color-accent)' }}
              whileTap={{ scale: 0.97 }}
              onClick={() => scrollTo('contact')}
              className="px-7 py-3.5 rounded-xl border border-[var(--color-border)] text-[var(--color-text-primary)] font-medium text-sm hover:text-[var(--color-accent)] transition-all flex items-center gap-2 hover:shadow-[0_0_20px_rgba(79,107,255,0.1)]"
            >
              <FiMail size={16} />
              {t('hero.cta_contact')}
            </motion.button>
          </motion.div>
        </motion.div>

        {/* 3D Element */}
        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.35, ease: [0.215, 0.61, 0.355, 1] }}
          className="hidden lg:block"
        >
          <Suspense
            fallback={
              <div className="w-full h-[400px] flex items-center justify-center">
                <div className="w-16 h-16 border-2 border-[var(--color-accent)] border-t-transparent rounded-full animate-spin" />
              </div>
            }
          >
            <HeroGeometry />
          </Suspense>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          className="flex flex-col items-center gap-2 text-[var(--color-text-muted)] cursor-pointer group"
          onClick={() => scrollTo('about')}
        >
          <span className="text-[10px] font-mono uppercase tracking-widest opacity-50 group-hover:opacity-100 transition-opacity">
            scroll
          </span>
          <div className="w-5 h-8 rounded-full border border-[var(--color-border)] flex items-start justify-center p-1 group-hover:border-[var(--color-accent)] transition-colors">
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="w-1 h-1.5 rounded-full bg-[var(--color-accent)]"
            />
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
