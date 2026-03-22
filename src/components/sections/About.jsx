import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import SectionWrapper from '../SectionWrapper';
import { FiCode, FiCpu, FiGlobe } from 'react-icons/fi';

export default function About() {
  const { t } = useTranslation();

  const highlights = [
    { icon: FiGlobe, label: 'Full Stack', value: 'Web & Mobile', gradient: 'from-[var(--color-blue-400)] to-[var(--color-blue-700)]' },
    { icon: FiCpu, label: 'AI & ML', value: 'Intelligent Systems', gradient: 'from-[var(--color-blue-500)] to-[var(--color-blue-900)]' },
    { icon: FiCode, label: 'Clean Code', value: 'Scalable Architecture', gradient: 'from-[var(--color-blue-300)] to-[var(--color-blue-600)]' },
  ];

  return (
    <SectionWrapper id="about">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        {/* Left - highlights */}
        <div className="space-y-5">
          {highlights.map((item, i) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.45, ease: [0.215, 0.61, 0.355, 1] }}
              whileHover={{ y: -2, transition: { duration: 0.15 } }}
              className="glass-card rounded-2xl p-6 flex items-center gap-5 group cursor-default"
            >
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${item.gradient} flex items-center justify-center shrink-0 shadow-lg group-hover:shadow-[var(--color-accent-glow)] transition-shadow`}>
                <item.icon className="text-white" size={22} />
              </div>
              <div>
                <p className="text-[var(--color-text-primary)] font-semibold">{item.label}</p>
                <p className="text-[var(--color-text-muted)] text-sm">{item.value}</p>
              </div>
              <div className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="w-1.5 h-1.5 rounded-full bg-[var(--color-accent)]" />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Right - text */}
        <div>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-[var(--color-accent)] font-mono text-sm mb-3 uppercase tracking-[0.2em]"
          >
            whoami
          </motion.p>
          <h2 className="text-3xl md:text-4xl font-bold text-[var(--color-text-primary)] mb-8">
            {t('about.title')}
          </h2>
          <div className="space-y-4 text-[var(--color-text-secondary)] leading-relaxed">
            {['p1', 'p2', 'p3', 'p4'].map((key, i) => (
              <motion.p
                key={key}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 + i * 0.1, duration: 0.5 }}
              >
                {t(`about.${key}`)}
              </motion.p>
            ))}
          </div>
        </div>
      </div>
    </SectionWrapper>
  );
}
