import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import SectionWrapper from '../SectionWrapper';
import { FiFolder, FiStar, FiUsers, FiActivity } from 'react-icons/fi';

export default function GitHubStats() {
  const { t } = useTranslation();
  const [stats, setStats] = useState(null);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGitHub = async () => {
      try {
        const [userRes, eventsRes, reposRes] = await Promise.all([
          fetch('https://api.github.com/users/mednourchrif'),
          fetch('https://api.github.com/users/mednourchrif/events/public?per_page=5'),
          fetch('https://api.github.com/users/mednourchrif/repos?per_page=100&sort=updated'),
        ]);

        const user = await userRes.json();
        const evts = await eventsRes.json();
        const repos = await reposRes.json();

        const totalStars = Array.isArray(repos)
          ? repos.reduce((acc, r) => acc + (r.stargazers_count || 0), 0)
          : 0;

        // Language breakdown
        const langMap = {};
        if (Array.isArray(repos)) {
          repos.forEach((r) => {
            if (r.language) {
              langMap[r.language] = (langMap[r.language] || 0) + 1;
            }
          });
        }
        const languages = Object.entries(langMap)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 6)
          .map(([name, count]) => ({
            name,
            count,
            percent: Math.round((count / repos.length) * 100),
          }));

        setStats({
          repos: user.public_repos || 0,
          stars: totalStars,
          followers: user.followers || 0,
          languages,
        });
        setEvents(Array.isArray(evts) ? evts.slice(0, 5) : []);
      } catch (err) {
        console.error('GitHub fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchGitHub();
  }, []);

  const statCards = stats
    ? [
        { icon: FiFolder, label: t('github.repos'), value: stats.repos },
        { icon: FiStar, label: t('github.stars'), value: stats.stars },
        { icon: FiUsers, label: t('github.followers'), value: stats.followers },
      ]
    : [];

  const langColors = {
    JavaScript: '#F7DF1E',
    TypeScript: '#3178C6',
    Python: '#3776AB',
    HTML: '#E34F26',
    CSS: '#1572B6',
    Dart: '#0175C2',
    Swift: '#F05138',
    Java: '#ED8B00',
    Vue: '#4FC08D',
    'C++': '#00599C',
    Go: '#00ADD8',
    Rust: '#DEA584',
  };

  const getEventDescription = (event) => {
    switch (event.type) {
      case 'PushEvent':
        return `Pushed to ${event.repo?.name?.split('/')[1] || event.repo?.name}`;
      case 'CreateEvent':
        return `Created ${event.payload?.ref_type} in ${event.repo?.name?.split('/')[1] || event.repo?.name}`;
      case 'WatchEvent':
        return `Starred ${event.repo?.name}`;
      case 'ForkEvent':
        return `Forked ${event.repo?.name}`;
      case 'IssuesEvent':
        return `${event.payload?.action} issue in ${event.repo?.name?.split('/')[1] || event.repo?.name}`;
      default:
        return `Activity in ${event.repo?.name?.split('/')[1] || event.repo?.name}`;
    }
  };

  if (loading) {
    return (
      <SectionWrapper id="github">
        <div className="flex justify-center py-20">
          <div className="w-10 h-10 border-2 border-[var(--color-accent)] border-t-transparent rounded-full animate-spin" />
        </div>
      </SectionWrapper>
    );
  }

  return (
    <SectionWrapper id="github">
      <div className="text-center mb-16">
        <p className="text-[var(--color-accent)] font-mono text-sm mb-3 uppercase tracking-[0.2em]">
          ./github
        </p>
        <h2 className="text-3xl md:text-4xl font-bold text-[var(--color-text-primary)] mb-4">
          {t('github.title')}
        </h2>
        <p className="text-[var(--color-text-secondary)] max-w-lg mx-auto">
          {t('github.subtitle')}
        </p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-12 max-w-3xl mx-auto">
        {statCards.map((card, i) => (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.06, duration: 0.35 }}
            whileHover={{ y: -2, transition: { duration: 0.15 } }}
            className="glass-card rounded-2xl p-6 text-center"
          >
            <card.icon className="mx-auto mb-3 text-[var(--color-blue-200)]" size={24} />
            <p className="text-3xl font-bold text-gradient-accent mb-1">{card.value}</p>
            <p className="text-[var(--color-text-muted)] text-sm">{card.label}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
        {/* Languages */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="glass-card rounded-2xl p-6"
        >
          <h3 className="text-[var(--color-text-primary)] font-semibold mb-6 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[var(--color-blue-500)]" />
            {t('github.top_languages')}
          </h3>
          <div className="space-y-4">
            {stats?.languages.map((lang) => (
              <div key={lang.name}>
                <div className="flex justify-between text-sm mb-1.5">
                  <span className="text-[var(--color-text-secondary)]">{lang.name}</span>
                  <span className="text-[var(--color-text-muted)] font-mono">{lang.percent}%</span>
                </div>
                <div className="h-1.5 bg-[var(--color-bg-tertiary)] rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: `${lang.percent}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="h-full rounded-full"
                    style={{
                      backgroundColor: langColors[lang.name] || 'var(--color-accent)',
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Recent activity */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="glass-card rounded-2xl p-6"
        >
          <h3 className="text-[var(--color-text-primary)] font-semibold mb-6 flex items-center gap-2">
            <FiActivity className="text-[var(--color-blue-200)]" size={16} />
            {t('github.recent_activity')}
          </h3>
          <div className="space-y-4">
            {events.map((event, i) => (
              <div key={event.id || i} className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-[var(--color-accent)] mt-2 shrink-0" />
                <div>
                  <p className="text-[var(--color-text-secondary)] text-sm">
                    {getEventDescription(event)}
                  </p>
                  <p className="text-[var(--color-text-muted)] text-xs mt-0.5">
                    {new Date(event.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
            {events.length === 0 && (
              <p className="text-[var(--color-text-muted)] text-sm">No recent activity</p>
            )}
          </div>
        </motion.div>
      </div>
    </SectionWrapper>
  );
}
