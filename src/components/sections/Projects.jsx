import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import SectionWrapper from '../SectionWrapper';
import { FiGithub, FiExternalLink, FiLock, FiStar, FiArrowUpRight } from 'react-icons/fi';

const projectsData = [
  {
    title: 'OACA — Gestion des Marchés Publics',
    description: 'Full-stack public procurement management system for OACA (Office des Aéroports et de la Navigation Aérienne). Manages tenders, suppliers, contracts, with a dashboard and role-based access control.',
    tags: ['React', 'TypeScript', 'Tailwind CSS', 'Python', 'Flask', 'MySQL'],
    category: 'fullstack',
    github: null,
    demo: null,
    image: '/projects/oaca.jpeg',
    featured: true,
  },
  {
    title: 'ChroniCare — Chronic Disease Tracker',
    description: 'E-health platform connecting patients, doctors, and admins for chronic disease monitoring. Features medical profiles, daily health journals, appointment scheduling, and a discussion forum.',
    tags: ['Symfony', 'PHP', 'Twig', 'Bootstrap', 'MySQL', 'Doctrine'],
    category: 'fullstack',
    github: null,
    demo: null,
    image: '/projects/chronicare.png',
    featured: true,
  },
  {
    title: 'Personal Portfolio',
    description: 'Premium developer portfolio with WebGL animated background, Three.js 3D hero, AI chatbot, admin dashboard with analytics, and multilingual support.',
    tags: ['React', 'Three.js', 'Tailwind CSS', 'OpenAI', 'MongoDB'],
    category: 'fullstack',
    github: 'https://github.com/mednourchrif',
    demo: "https://nourcherif.me",
    image: '/projects/portfolio.png',
  },
  {
    title: 'Tech-Web-Symfony',
    description: 'Full-stack web application built with Symfony for managing a list of authors. Features full CRUD operations with a clean MVC architecture.',
    tags: ['PHP', 'Symfony', 'Twig', 'MySQL'],
    category: 'backend',
    github: 'https://github.com/mednourchrif/Tech-Web-Symfony',
    demo: null,
    image: null,
  },
  {
    title: 'Happy Valentine',
    description: 'Interactive Valentine\'s Day themed web experience with animated visuals and creative frontend design, deployed on GitHub Pages.',
    tags: ['HTML', 'CSS', 'JavaScript'],
    category: 'frontend',
    github: 'https://github.com/mednourchrif/Happy-Valentine',
    demo: 'https://mednourchrif.github.io/Happy-Valentine/',
    image: null,
  },
];

const filters = ['all', 'fullstack', 'backend', 'frontend'];

export default function Projects() {
  const { t } = useTranslation();
  const [activeFilter, setActiveFilter] = useState('all');

  const filtered =
    activeFilter === 'all'
      ? projectsData
      : projectsData.filter((p) => p.category === activeFilter);

  return (
    <SectionWrapper id="projects">
      <div className="text-center mb-16">
        <p className="text-[var(--color-accent)] font-mono text-sm mb-3 uppercase tracking-[0.2em]">
          ./projects
        </p>
        <h2 className="text-3xl md:text-4xl font-bold text-[var(--color-text-primary)] mb-4">
          {t('projects.title')}
        </h2>
        <p className="text-[var(--color-text-secondary)] max-w-lg mx-auto">
          {t('projects.subtitle')}
        </p>
      </div>

      {/* Filters */}
      <div className="flex justify-center gap-2 mb-12">
        {filters.map((f) => (
          <motion.button
            key={f}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setActiveFilter(f)}
            className={`relative px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 ${
              activeFilter === f
                ? 'text-white'
                : 'glass text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'
            }`}
          >
            {activeFilter === f && (
              <motion.div
                layoutId="activeProjectFilter"
                className="absolute inset-0 bg-gradient-to-r from-[var(--color-blue-600)] to-[var(--color-blue-900)] rounded-xl"
                transition={{ type: 'spring', bounce: 0.2, duration: 0.5 }}
              />
            )}
            <span className="relative z-10">{t(`projects.filter_${f}`)}</span>
          </motion.button>
        ))}
      </div>

      {/* Grid */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeFilter}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {filtered.map((project, i) => (
            <motion.div
              key={project.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06, duration: 0.35, ease: [0.215, 0.61, 0.355, 1] }}
              whileHover={{ y: -3, transition: { duration: 0.15 } }}
              className="glass-card rounded-2xl overflow-hidden group"
            >
              {/* Project image or gradient fallback */}
              <div className="h-48 bg-gradient-to-br from-[var(--color-bg-tertiary)] to-[var(--color-surface)] flex items-center justify-center relative overflow-hidden">
                {project.image ? (
                  <img
                    src={project.image}
                    alt={project.title}
                    loading="lazy"
                    decoding="async"
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-400 group-hover:scale-105"
                  />
                ) : (
                  <>
                    <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-blue-600)]/5 to-[var(--color-blue-1000)]/5 group-hover:from-[var(--color-blue-600)]/12 group-hover:to-[var(--color-blue-1000)]/12 transition-all duration-500" />
                    {/* Animated grid pattern */}
                    <div className="absolute inset-0 opacity-[0.03] group-hover:opacity-[0.06] transition-opacity" style={{
                      backgroundImage: 'linear-gradient(rgba(79,107,255,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(79,107,255,0.4) 1px, transparent 1px)',
                      backgroundSize: '25px 25px',
                    }} />
                  </>
                )}
                {!project.image && (
                  <span className="text-[var(--color-text-muted)] font-mono text-sm z-10 tracking-widest">
                    {project.category.toUpperCase()}
                  </span>
                )}
                {project.featured && (
                  <motion.span
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="absolute top-3 right-3 z-20 flex items-center gap-1 px-2.5 py-1 text-xs font-semibold bg-gradient-to-r from-[var(--color-blue-500)] to-[var(--color-blue-800)] text-white rounded-lg shadow-lg shadow-[var(--color-accent-glow)]"
                  >
                    <FiStar size={11} /> Featured
                  </motion.span>
                )}
                {project.image && (
                  <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-bg)] via-[var(--color-bg)]/20 to-transparent" />
                )}
              </div>

              <div className="p-6">
                <h3 className="text-[var(--color-text-primary)] font-semibold text-lg mb-2 group-hover:text-gradient-accent transition-all">
                  {project.title}
                </h3>
                <p className="text-[var(--color-text-secondary)] text-sm leading-relaxed mb-4">
                  {project.description}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-5">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2.5 py-1 text-xs font-mono text-[var(--color-blue-200)] bg-[var(--color-accent-glow)] rounded-md border border-[var(--color-border)]"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Links */}
                <div className="flex items-center gap-4">
                  {project.github ? (
                    <motion.a
                      whileHover={{ x: 3 }}
                      href={project.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 text-[var(--color-text-muted)] hover:text-[var(--color-accent-light)] text-sm transition-colors"
                    >
                      <FiGithub size={15} />
                      {t('projects.view_code')}
                      <FiArrowUpRight size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                    </motion.a>
                  ) : (
                    <span className="flex items-center gap-1.5 text-[var(--color-text-muted)] text-sm">
                      <FiLock size={14} />
                      {t('projects.private_repo')}
                    </span>
                  )}
                  {project.demo && (
                    <motion.a
                      whileHover={{ x: 3 }}
                      href={project.demo}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 text-[var(--color-text-muted)] hover:text-[var(--color-accent-light)] text-sm transition-colors"
                    >
                      <FiExternalLink size={15} />
                      {t('projects.live_demo')}
                    </motion.a>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </AnimatePresence>
    </SectionWrapper>
  );
}
