import { useTranslation } from 'react-i18next';

export default function LanguageSwitcher() {
  const { i18n } = useTranslation();
  const currentLang = i18n.language?.split('-')[0] || 'en';

  const toggle = () => {
    const next = currentLang === 'en' ? 'fr' : 'en';
    i18n.changeLanguage(next);
  };

  return (
    <button
      onClick={toggle}
      className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-[var(--color-border)] hover:border-[var(--color-accent)] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] text-xs font-mono transition-all duration-200"
      aria-label="Switch language"
    >
      <span className={currentLang === 'en' ? 'text-[var(--color-accent-light)]' : ''}>EN</span>
      <span className="text-[var(--color-text-muted)]">/</span>
      <span className={currentLang === 'fr' ? 'text-[var(--color-accent-light)]' : ''}>FR</span>
    </button>
  );
}
