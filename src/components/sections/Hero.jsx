import { Suspense } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { FiArrowDown, FiMail } from 'react-icons/fi';
import HeroGeometry from '../HeroGeometry';

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
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex items-center gap-2 mb-6"
          >
            <span className="w-2 h-2 rounded-full bg-[var(--color-success)] animate-pulse" />
            <span className="text-[var(--color-text-muted)] text-xs font-mono uppercase tracking-widest">
              Available for work
            </span>
          </motion.div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
            <span className="text-gradient">{t('hero.headline')}</span>
          </h1>

          <p className="text-[var(--color-text-secondary)] text-lg md:text-xl leading-relaxed mb-10 max-w-xl">
            {t('hero.subheadline')}
          </p>

          <div className="flex flex-wrap gap-4">
            <button
              onClick={() => scrollTo('projects')}
              className="px-7 py-3.5 rounded-xl bg-gradient-to-r from-[var(--color-accent)] to-[var(--color-violet)] text-white font-medium text-sm hover:opacity-90 transition-opacity glow-accent"
            >
              {t('hero.cta_projects')}
            </button>
            <button
              onClick={() => scrollTo('contact')}
              className="px-7 py-3.5 rounded-xl border border-[var(--color-border)] text-[var(--color-text-primary)] font-medium text-sm hover:border-[var(--color-accent)] hover:text-[var(--color-accent)] transition-all flex items-center gap-2"
            >
              <FiMail size={16} />
              {t('hero.cta_contact')}
            </button>
          </div>
        </motion.div>

        {/* 3D Element */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
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
        transition={{ delay: 2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="text-[var(--color-text-muted)] cursor-pointer"
          onClick={() => scrollTo('about')}
        >
          <FiArrowDown size={20} />
        </motion.div>
      </motion.div>
    </section>
  );
}
