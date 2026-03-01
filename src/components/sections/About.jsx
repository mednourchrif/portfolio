import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import SectionWrapper from '../SectionWrapper';
import { FiCode, FiCpu, FiGlobe } from 'react-icons/fi';

export default function About() {
  const { t } = useTranslation();

  const highlights = [
    { icon: FiGlobe, label: 'Full Stack', value: 'Web & Mobile' },
    { icon: FiCpu, label: 'AI & ML', value: 'Intelligent Systems' },
    { icon: FiCode, label: 'Clean Code', value: 'Scalable Architecture' },
  ];

  return (
    <SectionWrapper id="about">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        {/* Left - highlights */}
        <div className="space-y-6">
          {highlights.map((item, i) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15, duration: 0.5 }}
              className="glass rounded-2xl p-6 flex items-center gap-5 group hover:border-[var(--color-accent)]/30 transition-colors"
            >
              <div className="w-12 h-12 rounded-xl bg-[var(--color-accent-glow)] flex items-center justify-center shrink-0">
                <item.icon className="text-[var(--color-accent-light)]" size={22} />
              </div>
              <div>
                <p className="text-[var(--color-text-primary)] font-semibold">{item.label}</p>
                <p className="text-[var(--color-text-muted)] text-sm">{item.value}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Right - text */}
        <div>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-[var(--color-accent)] font-mono text-sm mb-3 uppercase tracking-widest"
          >
            whoami
          </motion.p>
          <h2 className="text-3xl md:text-4xl font-bold text-[var(--color-text-primary)] mb-8">
            {t('about.title')}
          </h2>
          <div className="space-y-4 text-[var(--color-text-secondary)] leading-relaxed">
            <p>{t('about.p1')}</p>
            <p>{t('about.p2')}</p>
            <p>{t('about.p3')}</p>
            <p>{t('about.p4')}</p>
          </div>
        </div>
      </div>
    </SectionWrapper>
  );
}
