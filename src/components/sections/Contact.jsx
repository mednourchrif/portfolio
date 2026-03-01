import { useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import SectionWrapper from '../SectionWrapper';
import { FiSend, FiCheck, FiAlertCircle } from 'react-icons/fi';

export default function Contact() {
  const { t } = useTranslation();
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState('idle'); // idle | sending | success | error
  const [errorMsg, setErrorMsg] = useState('');

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('sending');
    setErrorMsg('');

    try {
      const res = await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        let errorMessage = 'Failed to send';
        try {
          const text = await res.text();
          const data = JSON.parse(text);
          errorMessage = data.error || errorMessage;
        } catch {}
        throw new Error(errorMessage);
      }

      setStatus('success');
      setForm({ name: '', email: '', message: '' });
      setTimeout(() => setStatus('idle'), 5000);
    } catch (err) {
      setStatus('error');
      setErrorMsg(err.message);
      setTimeout(() => setStatus('idle'), 5000);
    }
  };

  return (
    <SectionWrapper id="contact">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-16">
          <p className="text-[var(--color-accent)] font-mono text-sm mb-3 uppercase tracking-[0.2em]">
            ./contact
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-[var(--color-text-primary)] mb-4">
            {t('contact.title')}
          </h2>
          <p className="text-[var(--color-text-secondary)] max-w-lg mx-auto">
            {t('contact.subtitle')}
          </p>
        </div>

        <motion.form
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          onSubmit={handleSubmit}
          className="glass-card rounded-2xl p-8 space-y-6"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-[var(--color-text-secondary)] text-sm mb-2 font-medium">
                {t('contact.name')}
              </label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                required
                minLength={2}
                maxLength={100}
                className="w-full px-4 py-3 rounded-xl bg-[var(--color-bg-tertiary)] border border-[var(--color-border)] text-[var(--color-text-primary)] text-sm focus:outline-none focus:border-[var(--color-accent)] transition-colors placeholder:text-[var(--color-text-muted)]"
                placeholder="John Doe"
              />
            </div>
            <div>
              <label className="block text-[var(--color-text-secondary)] text-sm mb-2 font-medium">
                {t('contact.email')}
              </label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
                maxLength={200}
                className="w-full px-4 py-3 rounded-xl bg-[var(--color-bg-tertiary)] border border-[var(--color-border)] text-[var(--color-text-primary)] text-sm focus:outline-none focus:border-[var(--color-accent)] transition-colors placeholder:text-[var(--color-text-muted)]"
                placeholder="john@example.com"
              />
            </div>
          </div>

          <div>
            <label className="block text-[var(--color-text-secondary)] text-sm mb-2 font-medium">
              {t('contact.message')}
            </label>
            <textarea
              name="message"
              value={form.message}
              onChange={handleChange}
              required
              minLength={10}
              maxLength={2000}
              rows={5}
              className="w-full px-4 py-3 rounded-xl bg-[var(--color-bg-tertiary)] border border-[var(--color-border)] text-[var(--color-text-primary)] text-sm focus:outline-none focus:border-[var(--color-accent)] transition-colors resize-none placeholder:text-[var(--color-text-muted)]"
              placeholder="Tell me about your project..."
            />
          </div>

          <button
            type="submit"
            disabled={status === 'sending'}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[var(--color-blue-500)] to-[var(--color-blue-900)] text-white font-medium text-sm hover:shadow-[0_0_30px_rgba(79,107,255,0.25)] transition-all disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {status === 'sending' ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                {t('contact.sending')}
              </>
            ) : status === 'success' ? (
              <>
                <FiCheck size={16} />
                {t('contact.success')}
              </>
            ) : (
              <>
                <FiSend size={16} />
                {t('contact.send')}
              </>
            )}
          </button>

          {status === 'error' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-2 text-[var(--color-error)] text-sm"
            >
              <FiAlertCircle size={16} />
              {errorMsg || t('contact.error')}
            </motion.div>
          )}
        </motion.form>
      </div>
    </SectionWrapper>
  );
}
