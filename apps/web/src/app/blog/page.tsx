'use client';

import { ChangeEvent, FormEvent, useEffect, useMemo, useState, startTransition } from 'react';
import Link from 'next/link';
import { BLOG_DATA, type BlogCategoryKey, type BlogCopy, LocaleKey } from '@/data/blog';
import { SiteHeader } from '@/components/site-header';

type SubmissionState = 'idle' | 'submitting' | 'success' | 'error';

export default function BlogPage() {
  const [locale, setLocale] = useState<LocaleKey>('en');
  const [transitioning, setTransitioning] = useState(false);
  const [category, setCategory] = useState<BlogCategoryKey | 'all'>('all');
  const data = BLOG_DATA[locale];

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const stored = window.localStorage.getItem('finspeed-blog-locale');
    if (stored === 'en' || stored === 'hi') {
      startTransition(() => {
        setLocale(stored);
        document.documentElement.lang = stored === 'hi' ? 'hi' : 'en';
      });
    }
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    document.documentElement.lang = locale === 'hi' ? 'hi' : 'en';
    window.localStorage.setItem('finspeed-blog-locale', locale);
  }, [locale]);

  const posts = useMemo(() => {
    if (category === 'all') return data.posts;
    return data.posts.filter((post) => post.categoryKey === category);
  }, [category, data.posts]);

  return (
    <div className="relative min-h-screen overflow-hidden bg-[var(--fs-bg-dark)] text-[var(--fs-text-primary)]">
      <div className="pointer-events-none absolute inset-0 opacity-60">
        <div className="brand-texture" />
      </div>
      <div className="relative mx-auto flex min-h-screen w-full max-w-5xl flex-col gap-10 px-5 py-8 sm:px-6 lg:px-10">
        <SiteHeader
          locale={locale}
          onLocaleChange={(next) => {
            if (next === locale) return;
            setTransitioning(true);
            setLocale(next);
            setTimeout(() => setTransitioning(false), 220);
          }}
        />
        <Header copy={data.hero} />
        <main className={`flex flex-col gap-12 pb-12 transition-opacity duration-200 ${transitioning ? 'opacity-0' : 'opacity-100'}`}>
          <CategoryNav categories={data.categories} active={category} onChange={setCategory} />
          <FeaturedArticle post={data.featured} />
          <BlogGrid posts={posts} />
          <SubscriptionBanner locale={locale} copy={data.subscribe} />
        </main>
      </div>
      <div className="sr-only" aria-live="polite">
        Locale changed to {locale}
      </div>
    </div>
  );
}

function Header({ copy }: { copy: BlogCopy['hero'] }) {
  return (
    <section
      className="rounded-[30px] border border-[var(--fs-card-border)] bg-[var(--fs-card)] px-6 py-8 text-[var(--fs-text-primary)] shadow-[var(--fs-card-shadow)]"
      aria-labelledby="blog-hero"
    >
      <div className="flex flex-col gap-6">
        <div className="space-y-3">
          <p className="text-xs font-semibold uppercase tracking-[0.45em] text-[var(--fs-primary)]">{copy.kicker}</p>
          <h1 id="blog-hero" className="text-4xl font-semibold tracking-tight sm:text-5xl">
            {copy.title}
          </h1>
          <p className="text-xl text-[var(--fs-text-muted)]">{copy.subtitle}</p>
          <p className="text-base text-[var(--fs-text-muted)]">{copy.body}</p>
        </div>
      </div>
    </section>
  );
}

function CategoryNav({
  categories,
  active,
  onChange
}: {
  categories: BlogCopy['categories'];
  active: BlogCategoryKey | 'all';
  onChange: (key: BlogCategoryKey | 'all') => void;
}) {
  return (
    <nav aria-label="Blog categories" className="flex flex-wrap items-center gap-3">
      {categories.map((category) => (
        <button
          key={category.key}
          type="button"
          onClick={() => onChange(category.key as BlogCategoryKey | 'all')}
          aria-pressed={active === category.key}
          className={`focus-ring-target rounded-full border px-4 py-1.5 text-xs sm:text-sm font-semibold transition ${
            active === category.key
              ? 'border-[var(--fs-primary)] bg-[var(--fs-primary)] text-[var(--fs-ink)]'
              : 'border-[var(--fs-border)] text-[var(--fs-text-muted)] hover:border-[var(--fs-primary)] hover:text-[var(--fs-text-primary)]'
          }`}
        >
          {category.label}
        </button>
      ))}
    </nav>
  );
}

function FeaturedArticle({ post }: { post: BlogCopy['featured'] }) {
  return (
    <article className="rounded-[30px] border border-[var(--fs-card-border)] bg-[var(--fs-card)] p-6 text-[var(--fs-text-primary)] shadow-[var(--fs-card-shadow)]">
      <p className="text-xs font-semibold uppercase tracking-[0.45em] text-[var(--fs-eco)]">{post.highlight}</p>
      <div className="mt-4 flex flex-wrap items-center gap-3 text-xs uppercase tracking-[0.3em] text-[var(--fs-text-muted)]">
        <span>{post.categoryLabel}</span>
        <span aria-hidden>•</span>
        <span>{post.readingTime}</span>
        <span aria-hidden>•</span>
        <span>{post.date}</span>
      </div>
      <h2 className="mt-3 text-3xl font-semibold">{post.title}</h2>
      <p className="mt-3 text-base text-[var(--fs-text-muted)]">{post.summary}</p>
      <a
        href={`/blog/${post.slug}`}
        className="focus-ring-target mt-5 inline-flex items-center gap-2 rounded-full border border-[var(--fs-border)] px-5 py-2 text-sm font-semibold text-[var(--fs-text-primary)] transition hover:border-[var(--fs-primary)]"
      >
        Continue reading
        <span aria-hidden>↗</span>
      </a>
    </article>
  );
}

function BlogGrid({ posts }: { posts: BlogCopy['posts'] }) {
  if (!posts.length) {
    return (
      <div className="rounded-[30px] border border-dashed border-[var(--fs-border)] p-8 text-center text-[var(--fs-text-muted)]">
        No posts available for this category yet.
      </div>
    );
  }
  return (
    <section aria-label="Latest posts" className="space-y-4">
      <h3 className="text-2xl font-semibold text-[var(--fs-text-primary)]">Latest posts</h3>
      <div className="grid gap-5 md:grid-cols-2">
        {posts.map((post) => (
          <article key={post.slug} className="flex flex-col rounded-3xl border border-[var(--fs-card-border)] bg-[var(--fs-card)] p-5 text-[var(--fs-text-primary)] shadow-[var(--fs-card-shadow-soft)]">
            <div className="text-xs uppercase tracking-[0.3em] text-[var(--fs-text-muted)]">{post.categoryLabel}</div>
            <h4 className="mt-3 text-xl font-semibold">{post.title}</h4>
            <p className="mt-2 text-sm text-[var(--fs-text-muted)]">{post.summary}</p>
            <div className="mt-3 flex flex-wrap items-center gap-3 text-xs uppercase tracking-[0.3em] text-[var(--fs-text-soft)]">
              <span>{post.readingTime}</span>
              <span aria-hidden>•</span>
              <span>{post.date}</span>
            </div>
            <a
              href={`/blog/${post.slug}`}
              className="focus-ring-target mt-auto inline-flex items-center gap-2 text-sm font-semibold text-[var(--fs-primary)] transition hover:text-[var(--fs-primary-dark)]"
            >
              Read story
              <span aria-hidden>↗</span>
            </a>
          </article>
        ))}
      </div>
    </section>
  );
}

function SubscriptionBanner({ locale, copy }: { locale: LocaleKey; copy: BlogCopy['subscribe'] }) {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<SubmissionState>('idle');
  const [message, setMessage] = useState('');
  const endpoint = process.env.NEXT_PUBLIC_FORMSPREE_ENDPOINT;
  const feedbackId = 'blog-subscription-feedback';

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!endpoint) {
      setStatus('error');
      setMessage(copy.fallback);
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setStatus('error');
      setMessage(locale === 'hi' ? 'कृपया मान्य ईमेल दर्ज करें।' : 'Please enter a valid email.');
      return;
    }
    setStatus('submitting');
    setMessage('');

    try {
      const formData = new FormData();
      formData.append('email', email.trim());
      formData.append('locale', locale);
      formData.append('source', 'finspeed-blog');

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          Accept: 'application/json'
        },
        body: formData
      });

      if (response.status === 429) {
        throw new Error(locale === 'hi' ? 'Formspree सीमा पार हो गई। कृपया बाद में प्रयास करें।' : 'Quota exceeded. Please try again later.');
      }

      if (!response.ok) {
        throw new Error(locale === 'hi' ? 'सब्सक्रिप्शन भेजा नहीं जा सका।' : 'Unable to submit subscription.');
      }

      setStatus('success');
      setMessage(locale === 'hi' ? 'धन्यवाद! हमने आपको सूची में जोड़ दिया है।' : 'Thanks! You’re on the list.');
      setEmail('');
    } catch (error) {
      setStatus('error');
      const fallback = error instanceof Error ? error.message : copy.fallback;
      setMessage(fallback);
    }
  };

  return (
    <section className="rounded-[30px] border border-[var(--fs-card-border)] bg-[var(--fs-card)] p-6 text-[var(--fs-text-primary)] shadow-[var(--fs-card-shadow)]">
      <header className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-[0.4em] text-[var(--fs-primary)]">{copy.title}</p>
        <p className="text-lg text-[var(--fs-text-muted)]">{copy.body}</p>
      </header>
      <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-3 md:flex-row" noValidate>
        <input
          type="email"
          value={email}
          onChange={(event: ChangeEvent<HTMLInputElement>) => setEmail(event.target.value)}
          placeholder={copy.placeholder}
          aria-invalid={status === 'error'}
          aria-describedby={message ? feedbackId : undefined}
          className="w-full rounded-2xl border border-[var(--fs-border)] bg-[var(--fs-surface-muted)] px-4 py-3 text-sm text-[var(--fs-text-primary)] placeholder:text-[var(--fs-text-muted)] focus-visible:border-[var(--fs-primary)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--fs-primary)]"
          required
        />
        <button
          type="submit"
          disabled={status === 'submitting'}
          className="focus-ring-target inline-flex items-center justify-center rounded-2xl bg-[var(--fs-primary)] px-6 py-3 text-sm font-semibold text-[var(--fs-ink)] transition hover:bg-[var(--fs-primary-dark)] hover:text-white disabled:cursor-not-allowed disabled:opacity-70"
        >
          {status === 'submitting' ? (locale === 'hi' ? 'भेजा जा रहा है…' : 'Sending…') : copy.button}
        </button>
      </form>
      <p className="mt-3 text-sm text-[var(--fs-text-muted)]">{copy.helper}</p>
      <p className="mt-1 text-xs text-[var(--fs-text-soft)]">
        <Link href="/privacy" className="focus-ring-target underline">
          {copy.privacy}
        </Link>
      </p>
      {message ? (
        <p
          id={feedbackId}
          className={`mt-3 text-sm ${status === 'success' ? 'text-[var(--fs-eco)]' : 'text-[var(--fs-warning)]'}`}
          role={status === 'error' ? 'alert' : 'status'}
        >
          {message}
        </p>
      ) : null}
    </section>
  );
}
