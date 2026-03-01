import { useTranslation } from 'react-i18next';
import { FiGithub, FiLinkedin, FiMail } from 'react-icons/fi';

export default function Footer() {
  const { t } = useTranslation();
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-[var(--color-border)] bg-[var(--color-bg)]/80 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[var(--color-blue-400)] to-[var(--color-blue-900)] flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-[var(--color-accent-glow)]">
              M
            </div>
            <div>
              <p className="text-[var(--color-text-secondary)] text-sm">
                {t('footer.built')}{' '}
                <span className="text-[var(--color-text-primary)] font-medium">
                  Mohamed Nour Cherif
                </span>
              </p>
              <p className="text-[var(--color-text-muted)] text-xs">
                © {year} — {t('footer.rights')}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <a
              href="https://github.com/mednourchrif"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[var(--color-text-muted)] hover:text-[var(--color-accent)] transition-colors p-2"
              aria-label="GitHub"
            >
              <FiGithub size={18} />
            </a>
            <a
              href="mailto:contact@mohamed.dev"
              className="text-[var(--color-text-muted)] hover:text-[var(--color-accent)] transition-colors p-2"
              aria-label="Email"
            >
              <FiMail size={18} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
