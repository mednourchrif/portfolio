import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell,
} from 'recharts';
import {
  FiUsers, FiUserCheck, FiMail, FiMessageCircle,
  FiDownload, FiLogOut, FiMonitor, FiSmartphone,
  FiGlobe, FiClock,
} from 'react-icons/fi';

const COLORS = ['#4F6BFF', '#3A47FF', '#597DFF', '#81C4FF', '#6DA0FF'];

function StatCard({ icon: Icon, label, value, color = 'accent' }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass rounded-2xl p-6"
    >
      <div className="flex items-center gap-4">
        <div className={`w-12 h-12 rounded-xl bg-[var(--color-${color}-glow)] flex items-center justify-center`}>
          <Icon className={`text-[var(--color-${color}-light)]`} size={22} />
        </div>
        <div>
          <p className="text-2xl font-bold text-[var(--color-text-primary)]">{value}</p>
          <p className="text-[var(--color-text-muted)] text-sm">{label}</p>
        </div>
      </div>
    </motion.div>
  );
}

export default function AdminDashboard({ token, onLogout }) {
  const { t } = useTranslation();
  const [analytics, setAnalytics] = useState(null);
  const [messages, setMessages] = useState([]);
  const [chatLogs, setChatLogs] = useState([]);
  const [activeTab, setActiveTab] = useState('analytics');
  const [loading, setLoading] = useState(true);

  const authFetch = useCallback(
    async (url) => {
      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.status === 401) {
        onLogout();
        return null;
      }
      const text = await res.text();
      try {
        return JSON.parse(text);
      } catch {
        return null;
      }
    },
    [token, onLogout]
  );

  useEffect(() => {
    const loadData = async () => {
      try {
        const [analyticsData, messagesData, chatData] = await Promise.all([
          authFetch('/api/admin/analytics'),
          authFetch('/api/admin/messages'),
          authFetch('/api/admin/chat-logs'),
        ]);

        if (analyticsData) setAnalytics(analyticsData);
        if (messagesData) setMessages(messagesData.messages || []);
        if (chatData) setChatLogs(chatData.logs || []);
      } catch (err) {
        console.error('Failed to load admin data:', err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [authFetch]);

  const exportJSON = () => {
    const data = { analytics, messages, chatLogs, exportedAt: new Date().toISOString() };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `portfolio-analytics-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--color-bg)] flex items-center justify-center">
        <div className="w-10 h-10 border-2 border-[var(--color-accent)] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const tabs = [
    { key: 'analytics', label: t('admin.analytics'), icon: FiGlobe },
    { key: 'messages', label: t('admin.messages_title'), icon: FiMail },
    { key: 'chats', label: t('admin.chat_logs'), icon: FiMessageCircle },
  ];

  // Mock chart data if analytics not available
  const chartData = analytics?.dailyVisits || [
    { date: 'Mon', visits: 12 },
    { date: 'Tue', visits: 19 },
    { date: 'Wed', visits: 15 },
    { date: 'Thu', visits: 22 },
    { date: 'Fri', visits: 28 },
    { date: 'Sat', visits: 18 },
    { date: 'Sun', visits: 14 },
  ];

  const deviceData = analytics?.devices || [
    { name: 'Desktop', value: 65 },
    { name: 'Mobile', value: 30 },
    { name: 'Tablet', value: 5 },
  ];

  return (
    <div className="min-h-screen bg-[var(--color-bg)]">
      {/* Header */}
      <header className="glass-strong border-b border-[var(--color-border)] sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[var(--color-accent)] to-[var(--color-violet)] flex items-center justify-center text-white font-bold text-sm">
              M
            </div>
            <span className="text-[var(--color-text-primary)] font-semibold">
              {t('admin.title')}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={exportJSON}
              className="flex items-center gap-2 px-4 py-2 rounded-xl glass text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] text-sm transition-colors"
            >
              <FiDownload size={14} />
              {t('admin.export')}
            </button>
            <button
              onClick={onLogout}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-[var(--color-error)] hover:bg-[var(--color-error)]/10 text-sm transition-colors"
            >
              <FiLogOut size={14} />
              {t('admin.logout')}
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard
            icon={FiUsers}
            label={t('admin.visitors')}
            value={analytics?.totalVisitors || 0}
          />
          <StatCard
            icon={FiUserCheck}
            label={t('admin.unique')}
            value={analytics?.uniqueVisitors || 0}
          />
          <StatCard
            icon={FiMail}
            label={t('admin.messages')}
            value={messages.length}
          />
          <StatCard
            icon={FiMessageCircle}
            label={t('admin.chats')}
            value={chatLogs.length}
            color="violet"
          />
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-8">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                activeTab === tab.key
                  ? 'bg-[var(--color-accent)] text-white'
                  : 'glass text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'
              }`}
            >
              <tab.icon size={15} />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab content */}
        {activeTab === 'analytics' && (
          <div className="space-y-8">
            {/* Visits chart */}
            <div className="glass rounded-2xl p-6">
              <h3 className="text-[var(--color-text-primary)] font-semibold mb-6">
                Visitor Traffic
              </h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                    <XAxis dataKey="date" stroke="var(--color-text-muted)" fontSize={12} />
                    <YAxis stroke="var(--color-text-muted)" fontSize={12} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'var(--color-surface)',
                        border: '1px solid var(--color-border)',
                        borderRadius: '12px',
                        color: 'var(--color-text-primary)',
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="visits"
                      stroke="#4F6BFF"
                      fill="url(#colorVisits)"
                      strokeWidth={2}
                    />
                    <defs>
                      <linearGradient id="colorVisits" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#4F6BFF" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#4F6BFF" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Device breakdown */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="glass rounded-2xl p-6">
                <h3 className="text-[var(--color-text-primary)] font-semibold mb-6">
                  Devices
                </h3>
                <div className="h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={deviceData}
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={80}
                        paddingAngle={4}
                        dataKey="value"
                      >
                        {deviceData.map((_, idx) => (
                          <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          backgroundColor: 'var(--color-surface)',
                          border: '1px solid var(--color-border)',
                          borderRadius: '12px',
                          color: 'var(--color-text-primary)',
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex justify-center gap-4 mt-2">
                  {deviceData.map((d, i) => (
                    <div key={d.name} className="flex items-center gap-2 text-sm">
                      <span
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: COLORS[i % COLORS.length] }}
                      />
                      <span className="text-[var(--color-text-secondary)]">
                        {d.name} ({d.value}%)
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Top countries */}
              <div className="glass rounded-2xl p-6">
                <h3 className="text-[var(--color-text-primary)] font-semibold mb-6">
                  Top Countries
                </h3>
                <div className="space-y-3">
                  {(analytics?.topCountries || [
                    { country: 'United States', visits: 45 },
                    { country: 'France', visits: 32 },
                    { country: 'Algeria', visits: 28 },
                    { country: 'Germany', visits: 15 },
                    { country: 'Canada', visits: 12 },
                  ]).map((c, i) => (
                    <div key={c.country} className="flex items-center justify-between">
                      <span className="text-[var(--color-text-secondary)] text-sm">
                        {c.country}
                      </span>
                      <span className="text-[var(--color-text-muted)] text-sm font-mono">
                        {c.visits}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'messages' && (
          <div className="space-y-4">
            {messages.length === 0 ? (
              <div className="glass rounded-2xl p-12 text-center">
                <FiMail className="mx-auto mb-3 text-[var(--color-text-muted)]" size={32} />
                <p className="text-[var(--color-text-muted)]">No messages yet</p>
              </div>
            ) : (
              messages.map((msg, i) => (
                <motion.div
                  key={msg._id || i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="glass rounded-2xl p-6"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="text-[var(--color-text-primary)] font-semibold">
                        {msg.name}
                      </p>
                      <p className="text-[var(--color-accent-light)] text-sm">{msg.email}</p>
                    </div>
                    <span className="text-[var(--color-text-muted)] text-xs flex items-center gap-1">
                      <FiClock size={12} />
                      {new Date(msg.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-[var(--color-text-secondary)] text-sm leading-relaxed">
                    {msg.message}
                  </p>
                </motion.div>
              ))
            )}
          </div>
        )}

        {activeTab === 'chats' && (
          <div className="space-y-4">
            {chatLogs.length === 0 ? (
              <div className="glass rounded-2xl p-12 text-center">
                <FiMessageCircle className="mx-auto mb-3 text-[var(--color-text-muted)]" size={32} />
                <p className="text-[var(--color-text-muted)]">No chat logs yet</p>
              </div>
            ) : (
              chatLogs.map((log, i) => (
                <motion.div
                  key={log._id || i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="glass rounded-2xl p-6"
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[var(--color-text-muted)] text-xs flex items-center gap-1">
                      <FiClock size={12} />
                      {new Date(log.createdAt).toLocaleDateString()}
                    </span>
                    <span className="text-[var(--color-text-muted)] text-xs">
                      {log.messages?.length || 0} messages
                    </span>
                  </div>
                  <div className="space-y-2">
                    {(log.messages || []).slice(0, 4).map((msg, j) => (
                      <p
                        key={j}
                        className={`text-sm ${
                          msg.role === 'user'
                            ? 'text-[var(--color-accent-light)]'
                            : 'text-[var(--color-text-secondary)]'
                        }`}
                      >
                        <span className="font-mono text-[var(--color-text-muted)]">
                          {msg.role === 'user' ? '>' : '<'}{' '}
                        </span>
                        {msg.content.slice(0, 150)}
                        {msg.content.length > 150 ? '...' : ''}
                      </p>
                    ))}
                  </div>
                </motion.div>
              ))
            )}
          </div>
        )}
      </main>
    </div>
  );
}
