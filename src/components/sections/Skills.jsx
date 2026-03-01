import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import SectionWrapper from '../SectionWrapper';
import {
  SiReact, SiNextdotjs, SiTailwindcss, SiTypescript, SiJavascript,
  SiNodedotjs, SiExpress, SiPython, SiPostgresql, SiMongodb,
  SiFlutter, SiReact as SiReactNative, SiSwift,
  SiOpenai, SiTensorflow, SiPytorch,
  SiDocker, SiGit, SiVercel, SiFigma, SiLinux,
  SiVuedotjs, SiPrisma, SiRedis,
} from 'react-icons/si';

const categories = [
  {
    key: 'frontend',
    skills: [
      { name: 'React', icon: SiReact, color: '#61DAFB' },
      { name: 'Next.js', icon: SiNextdotjs, color: '#ffffff' },
      { name: 'Vue.js', icon: SiVuedotjs, color: '#4FC08D' },
      { name: 'TypeScript', icon: SiTypescript, color: '#3178C6' },
      { name: 'JavaScript', icon: SiJavascript, color: '#F7DF1E' },
      { name: 'Tailwind CSS', icon: SiTailwindcss, color: '#06B6D4' },
    ],
  },
  {
    key: 'backend',
    skills: [
      { name: 'Node.js', icon: SiNodedotjs, color: '#339933' },
      { name: 'Express', icon: SiExpress, color: '#ffffff' },
      { name: 'Python', icon: SiPython, color: '#3776AB' },
      { name: 'PostgreSQL', icon: SiPostgresql, color: '#4169E1' },
      { name: 'MongoDB', icon: SiMongodb, color: '#47A248' },
      { name: 'Prisma', icon: SiPrisma, color: '#2D3748' },
      { name: 'Redis', icon: SiRedis, color: '#DC382D' },
    ],
  },
  {
    key: 'mobile',
    skills: [
      { name: 'React Native', icon: SiReactNative, color: '#61DAFB' },
      { name: 'Flutter', icon: SiFlutter, color: '#02569B' },
      { name: 'Swift', icon: SiSwift, color: '#F05138' },
    ],
  },
  {
    key: 'ai',
    skills: [
      { name: 'OpenAI API', icon: SiOpenai, color: '#412991' },
      { name: 'TensorFlow', icon: SiTensorflow, color: '#FF6F00' },
      { name: 'PyTorch', icon: SiPytorch, color: '#EE4C2C' },
    ],
  },
  {
    key: 'tools',
    skills: [
      { name: 'Docker', icon: SiDocker, color: '#2496ED' },
      { name: 'Git', icon: SiGit, color: '#F05032' },
      { name: 'Vercel', icon: SiVercel, color: '#ffffff' },
      { name: 'Figma', icon: SiFigma, color: '#F24E1E' },
      { name: 'Linux', icon: SiLinux, color: '#FCC624' },
    ],
  },
];

export default function Skills() {
  const { t } = useTranslation();
  const [activeCategory, setActiveCategory] = useState('frontend');

  const activeSkills = categories.find((c) => c.key === activeCategory)?.skills || [];

  return (
    <SectionWrapper id="skills">
      <div className="text-center mb-16">
        <p className="text-[var(--color-accent)] font-mono text-sm mb-3 uppercase tracking-widest">
          ./skills
        </p>
        <h2 className="text-3xl md:text-4xl font-bold text-[var(--color-text-primary)] mb-4">
          {t('skills.title')}
        </h2>
        <p className="text-[var(--color-text-secondary)] max-w-lg mx-auto">
          {t('skills.subtitle')}
        </p>
      </div>

      {/* Category tabs */}
      <div className="flex flex-wrap justify-center gap-2 mb-12">
        {categories.map((cat) => (
          <button
            key={cat.key}
            onClick={() => setActiveCategory(cat.key)}
            className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 ${
              activeCategory === cat.key
                ? 'bg-[var(--color-accent)] text-white glow-accent'
                : 'glass text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:border-[var(--color-accent)]/30'
            }`}
          >
            {t(`skills.${cat.key}`)}
          </button>
        ))}
      </div>

      {/* Skills grid */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeCategory}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 max-w-4xl mx-auto"
        >
          {activeSkills.map((skill, i) => (
            <motion.div
              key={skill.name}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.06 }}
              className="glass rounded-2xl p-6 flex flex-col items-center gap-3 group hover:border-[var(--color-accent)]/30 transition-all cursor-default"
            >
              <skill.icon
                size={32}
                style={{ color: skill.color }}
                className="opacity-70 group-hover:opacity-100 transition-opacity"
              />
              <span className="text-[var(--color-text-secondary)] text-sm font-medium group-hover:text-[var(--color-text-primary)] transition-colors text-center">
                {skill.name}
              </span>
            </motion.div>
          ))}
        </motion.div>
      </AnimatePresence>
    </SectionWrapper>
  );
}
