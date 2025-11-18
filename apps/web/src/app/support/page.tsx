'use client';

import { ChangeEvent, FormEvent, useEffect, useMemo, useState, startTransition } from 'react';
import { SUPPORT_COPY, type SupportCopy, LocaleKey } from '@/data/support';
import { logAnalyticsEvent } from '@/lib/analytics';
import { SiteHeader } from '@/components/site-header';

type SubmissionState = 'idle' | 'submitting' | 'success' | 'error';

export default function SupportPage() {
  const [locale, setLocale] = useState<LocaleKey>('en');
  const copy = SUPPORT_COPY[locale];
  const [outage, setOutage] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const stored = window.localStorage.getItem('finspeed-support-locale');
    if (stored === 'en' || stored === 'hi') {
      startTransition(() => {
        setLocale(stored);
        document.documentElement.lang = stored === 'hi' ? 'hi' : 'en';
      });
    }
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    window.localStorage.setItem('finspeed-support-locale', locale);
    document.documentElement.lang = locale === 'hi' ? 'hi' : 'en';
  }, [locale]);

  const channels = useMemo(() => {
    if (outage) {
      return copy.channels.map((channel) =>
        channel.label.toLowerCase().includes('whatsapp')
          ? { ...channel, disabled: true }
          : channel
      );
    }
    return copy.channels;
  }, [copy.channels, outage]);

  return (
    <div className="relative min-h-screen overflow-hidden bg-[var(--fs-bg-dark)] text-[var(--fs-text-primary)]">
      <div className="pointer-events-none absolute inset-0 opacity-60">
        <div className="brand-texture" />
      </div>
      <div className="relative mx-auto flex min-h-screen w-full max-w-5xl flex-col gap-10 px-5 py-8 sm:px-6 lg:px-10">
        <SiteHeader locale={locale} onLocaleChange={setLocale} />
        <Header copy={copy.hero} />
        <main className="flex flex-1 flex-col gap-12 pb-12">
          <ChannelStatus copy={copy.status} outage={outage} onToggleOutage={() => setOutage((prev) => !prev)} />
          <ChannelGrid channels={channels} locale={locale} />
          {outage ? <OutageBanner message={copy.status.outage} /> : null}
          <SupportForm locale={locale} copy={copy.form} />
          <FaqSection faq={copy.faq} locale={locale} />
        </main>
      </div>
    </div>
  );
}

function Header({ copy }: { copy: SupportCopy['hero'] }) {
  return (
    <section
      className="rounded-[30px] border border-[var(--fs-card-border)] bg-[var(--fs-card)] px-6 py-8 text-[var(--fs-text-primary)] shadow-[var(--fs-card-shadow)]"
      aria-labelledby="support-hero"
    >
      <div className="flex flex-col gap-6">
        <div className="space-y-3 text-[var(--fs-text-primary)]">
          <p className="text-xs font-semibold uppercase tracking-[0.45em] text-[var(--fs-primary)]">{copy.kicker}</p>
          <h1 id="support-hero" className="text-4xl font-semibold tracking-tight sm:text-5xl">
            {copy.title}
          </h1>
          <p className="text-base text-[var(--fs-text-muted)]">{copy.subtitle}</p>
        </div>
      </div>
    </section>
  );
}

function ChannelStatus({
  copy,
  outage,
  onToggleOutage
}: {
  copy: SupportCopy['status'];
  outage: boolean;
  onToggleOutage: () => void;
}) {
  return (
    <section className="rounded-[30px] border border-[var(--fs-card-border)] bg-[var(--fs-card)] p-6 text-[var(--fs-text-primary)]">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[var(--fs-text-soft)]">{copy.title}</p>
          <p className="mt-2 text-lg text-[var(--fs-text-primary)]">{outage ? copy.outage : copy.online}</p>
        </div>
        <button
          type="button"
          onClick={onToggleOutage}
          className="focus-ring-target rounded-full border border-[var(--fs-border)] px-4 py-2 text-xs font-semibold text-[var(--fs-text-muted)] transition hover:border-[var(--fs-primary)] hover:text-[var(--fs-text-primary)]"
        >
          {outage ? 'Disable outage simulation' : 'Simulate WhatsApp outage'}
        </button>
      </div>
    </section>
  );
}

function ChannelGrid({
  channels,
  locale
}: {
  channels: Array<{ label: string; detail: string; href: string; description: string; disabled?: boolean }>;
  locale: LocaleKey;
}) {
  return (
    <section className="grid gap-4 md:grid-cols-3">
      {channels.map((channel) => (
        <a
          key={channel.label}
          href={channel.disabled ? undefined : channel.href}
          aria-disabled={channel.disabled || undefined}
          tabIndex={channel.disabled ? -1 : undefined}
          className={`focus-ring-target rounded-3xl border border-[var(--fs-card-border)] bg-[var(--fs-card)] p-5 text-[var(--fs-text-primary)] transition ${
            channel.disabled ? 'pointer-events-none opacity-60' : 'hover:border-[var(--fs-primary)]'
          }`}
          onClick={() => {
            if (channel.disabled) return;
            logAnalyticsEvent('support_channel_click', { channel_id: channel.label.toLowerCase(), locale });
          }}
        >
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[var(--fs-primary)]">{channel.label}</p>
          <p className="mt-2 text-2xl font-semibold text-[var(--fs-text-primary)]">{channel.detail}</p>
          <p className="mt-2 text-sm text-[var(--fs-text-muted)]">{channel.description}</p>
          {channel.disabled ? (
            <p className="mt-2 text-xs text-[var(--fs-warning)]">{locale === 'hi' ? 'अस्थायी रूप से बंद' : 'Temporarily unavailable'}</p>
          ) : null}
        </a>
      ))}
    </section>
  );
}

function SupportForm({ locale, copy }: { locale: LocaleKey; copy: SupportCopy['form'] }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState<SubmissionState>('idle');
  const [feedback, setFeedback] = useState('');
  const endpoint = process.env.NEXT_PUBLIC_SUPPORT_FORM_ENDPOINT;
  const feedbackId = 'support-form-feedback';

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!endpoint) {
      setStatus('error');
      setFeedback(copy.fallback);
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setStatus('error');
      setFeedback(locale === 'hi' ? 'मान्य ईमेल दर्ज करें।' : 'Please enter a valid email.');
      return;
    }
    setStatus('submitting');
    setFeedback('');

    try {
      const formData = new FormData();
      formData.append('name', name.trim());
      formData.append('email', email.trim());
      formData.append('message', message.trim());
      formData.append('locale', locale);
      formData.append('source', 'support-hub');

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { Accept: 'application/json' },
        body: formData
      });

      if (response.status === 429) {
        throw new Error(locale === 'hi' ? 'अभी अधिक सबमिशन हैं। बाद में प्रयास करें।' : 'Quota exceeded. Please try again soon.');
      }

      if (!response.ok) {
        throw new Error(locale === 'hi' ? 'अनुरोध भेजा नहीं जा सका।' : 'Unable to submit request.');
      }

      setStatus('success');
      setFeedback(copy.success);
      setName('');
      setEmail('');
      setMessage('');
    } catch (error) {
      setStatus('error');
      const message = error instanceof Error ? error.message : copy.fallback;
      setFeedback(message);
    }
  };

  return (
    <section className="rounded-[30px] border border-[var(--fs-card-border)] bg-[var(--fs-card)] p-6 text-[var(--fs-text-primary)]" aria-labelledby="support-form">
      <header className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[var(--fs-primary)]">{copy.title}</p>
        <h2 id="support-form" className="text-3xl font-semibold text-[var(--fs-text-primary)]">
          {copy.subtitle}
        </h2>
      </header>
      <form onSubmit={handleSubmit} className="mt-4 grid gap-4" noValidate>
        <input
          type="text"
          value={name}
          onChange={(event: ChangeEvent<HTMLInputElement>) => setName(event.target.value)}
          placeholder={copy.namePlaceholder}
          aria-invalid={status === 'error' && !name}
          className="rounded-2xl border border-[var(--fs-card-border)] bg-[var(--fs-surface-muted)] px-4 py-3 text-sm text-[var(--fs-text-primary)] placeholder:text-[var(--fs-text-soft)] focus-visible:border-[var(--fs-primary)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--fs-primary)]"
          required
        />
        <input
          type="email"
          value={email}
          onChange={(event: ChangeEvent<HTMLInputElement>) => setEmail(event.target.value)}
          placeholder={copy.emailPlaceholder}
          aria-invalid={status === 'error'}
          aria-describedby={feedback ? feedbackId : undefined}
          className="rounded-2xl border border-[var(--fs-card-border)] bg-[var(--fs-surface-muted)] px-4 py-3 text-sm text-[var(--fs-text-primary)] placeholder:text-[var(--fs-text-soft)] focus-visible:border-[var(--fs-primary)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--fs-primary)]"
          required
        />
        <textarea
          value={message}
          onChange={(event: ChangeEvent<HTMLTextAreaElement>) => setMessage(event.target.value)}
          placeholder={copy.messagePlaceholder}
          rows={4}
          className="rounded-2xl border border-[var(--fs-card-border)] bg-[var(--fs-surface-muted)] px-4 py-3 text-sm text-[var(--fs-text-primary)] placeholder:text-[var(--fs-text-soft)] focus-visible:border-[var(--fs-primary)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--fs-primary)]"
          required
        />
        <button
          type="submit"
          disabled={status === 'submitting'}
          className="focus-ring-target inline-flex items-center justify-center rounded-2xl bg-[var(--fs-primary)] px-6 py-3 text-sm font-semibold text-[var(--fs-ink)] transition hover:bg-[var(--fs-primary-dark)] disabled:cursor-not-allowed disabled:opacity-70"
        >
          {status === 'submitting' ? (locale === 'hi' ? 'भेजा जा रहा है…' : 'Sending…') : copy.button}
        </button>
      </form>
      <p className="mt-3 text-xs text-[var(--fs-text-muted)]">{copy.privacy}</p>
      {feedback ? (
        <p
          id={feedbackId}
          className={`mt-2 text-sm ${status === 'success' ? 'text-[var(--fs-eco)]' : 'text-[var(--fs-warning)]'}`}
          role={status === 'error' ? 'alert' : 'status'}
        >
          {feedback}
        </p>
      ) : null}
    </section>
  );
}

function FaqSection({ faq, locale }: { faq: SupportCopy['faq']; locale: LocaleKey }) {
  return (
    <section className="rounded-[30px] border border-[var(--fs-card-border)] bg-[var(--fs-card)] p-6 text-[var(--fs-text-primary)]" aria-labelledby="faq-heading">
      <h2 id="faq-heading" className="text-2xl font-semibold text-[var(--fs-text-primary)]">
        {locale === 'hi' ? 'सामान्य प्रश्न' : 'FAQs'}
      </h2>
      <div className="mt-4 space-y-4">
        {faq.map((item) => (
          <details key={item.question} className="rounded-2xl border border-[var(--fs-card-border)] bg-[var(--fs-surface-muted)] p-4">
            <summary className="cursor-pointer text-sm font-semibold text-[var(--fs-text-primary)]">{item.question}</summary>
            <p className="mt-2 text-sm text-[var(--fs-text-muted)]">{item.answer}</p>
          </details>
        ))}
      </div>
    </section>
  );
}

function OutageBanner({ message }: { message: string }) {
  return (
    <div className="rounded-[30px] border border-[color:rgba(249,115,22,0.3)] bg-[color:rgba(249,115,22,0.12)] p-4 text-sm text-[var(--fs-warning)] shadow-[var(--fs-card-shadow-soft)]" role="status" aria-live="assertive">
      {message}
    </div>
  );
}
