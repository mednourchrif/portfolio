import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { HiMenu, HiX } from 'react-icons/hi';
import LanguageSwitcher from './LanguageSwitcher';

const navLinks = [
  { key: 'about', href: '/#about' },
  { key: 'skills', href: '/#skills' },
  { key: 'projects', href: '/#projects' },
  { key: 'github', href: '/#github' },
  { key: 'contact', href: '/#contact' },
];

export default function Navbar() {
  const { t } = useTranslation();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('');
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 50);

      // Track active section
      const sections = navLinks.map((l) => l.key);
      for (const id of [...sections].reverse()) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top < 200) {
          setActiveSection(id);
          break;
        }
      }
    };
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [location]);

  const handleNavClick = (href) => {
    setMobileOpen(false);
    if (href.startsWith('/#')) {
      const id = href.slice(2);
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <motion.nav
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.7, ease: [0.215, 0.61, 0.355, 1] }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'glass-strong shadow-lg shadow-black/20'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link
          to="/"
          className="flex items-center gap-2.5 group"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        >
          <motion.div
            whileHover={{ scale: 1.1, rotate: 5 }}
            whileTap={{ scale: 0.95 }}
            className="w-9 h-9 rounded-xl bg-gradient-to-br from-[var(--color-blue-400)] to-[var(--color-blue-900)] flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-[var(--color-accent-glow)]"
          >
            M
          </motion.div>
          <span className="text-[var(--color-text-primary)] font-semibold text-lg hidden sm:block group-hover:text-gradient transition-all">
            Mohamed<span className="text-[var(--color-text-muted)]">.dev</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <button
              key={link.key}
              onClick={() => handleNavClick(link.href)}
              className={`relative px-4 py-2 text-sm font-medium transition-colors duration-200 rounded-lg ${
                activeSection === link.key
                  ? 'text-[var(--color-accent-light)]'
                  : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'
              }`}
            >
              {t(`nav.${link.key}`)}
              {activeSection === link.key && (
                <motion.div
                  layoutId="activeNav"
                  className="absolute inset-0 bg-[var(--color-accent-glow)] rounded-lg -z-10"
                  transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                />
              )}
            </button>
          ))}
          <div className="ml-4 pl-4 border-l border-[var(--color-border)]">
            <LanguageSwitcher />
          </div>
        </div>

        {/* Mobile toggle */}
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label={mobileOpen ? 'Close navigation menu' : 'Open navigation menu'}
          aria-expanded={mobileOpen}
          className="md:hidden text-[var(--color-text-primary)] p-2"
        >
          {mobileOpen ? <HiX size={24} /> : <HiMenu size={24} />}
        </motion.button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="md:hidden glass-strong border-t border-[var(--color-border)]"
          >
            <div className="px-6 py-4 space-y-1">
              {navLinks.map((link, i) => (
                <motion.button
                  key={link.key}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  onClick={() => handleNavClick(link.href)}
                  className={`block w-full text-left text-sm font-medium py-2.5 px-3 rounded-lg transition-colors ${
                    activeSection === link.key
                      ? 'text-[var(--color-accent-light)] bg-[var(--color-accent-glow)]'
                      : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'
                  }`}
                >
                  {t(`nav.${link.key}`)}
                </motion.button>
              ))}
              <div className="pt-3 mt-2 border-t border-[var(--color-border)]">
                <LanguageSwitcher />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
