'use client';

import { useState } from 'react';
import { BLOG_DATA } from '@/data/blog';

const locales = [
  { key: 'en' as const, label: 'English' },
  { key: 'hi' as const, label: 'हिन्दी' }
];

export default function BlogPage() {
  const [locale, setLocale] = useState<'en' | 'hi'>('en');
  const data = BLOG_DATA[locale];
  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      <div className="mx-auto w-full max-w-5xl space-y-10 px-6 py-12">
        <header className="space-y-4">
          <div className="flex justify-between">
            <span className="text-xs font-semibold uppercase tracking-[0.3em] text-[var(--primary)]">Blog</span>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-[var(--surface)]/80 p-1 text-xs font-semibold">
              {locales.map(({ key, label }) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setLocale(key)}
                  className={`rounded-full px-3 py-1 ${
                    locale === key ? 'bg-[var(--primary)] text-white shadow' : 'text-[var(--foreground-muted)]'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
          <h1 className="text-4xl font-semibold tracking-tight">{data.hero.title}</h1>
          <p className="text-base text-[var(--foreground-muted)]">{data.hero.subtitle}</p>
        </header>

        <section className="rounded-3xl border border-white/10 bg-[var(--surface)]/80 p-6 shadow">
          <p className="text-xs uppercase tracking-[0.4em] text-[var(--primary)]">Featured</p>
          <h2 className="mt-3 text-2xl font-semibold">{data.featured.title}</h2>
          <p className="mt-2 text-sm text-[var(--foreground-muted)]">{data.featured.excerpt}</p>
          <div className="mt-4 flex gap-4 text-xs text-[var(--foreground-muted)]">
            <span>{data.featured.category}</span>
            <span>{data.featured.readingTime}</span>
            <span>{data.featured.date}</span>
          </div>
          <a href={`/blog/${data.featured.slug}`} className="mt-4 inline-flex text-sm font-semibold text-[var(--primary)]">
            Continue reading →
          </a>
        </section>

        <section className="space-y-4">
          <h3 className="text-xl font-semibold">Latest posts</h3>
          <div className="grid gap-4 md:grid-cols-2">
            {data.recent.map((post) => (
              <article key={post.slug} className="rounded-2xl border border-white/10 bg-[var(--surface)]/60 p-5">
                <p className="text-xs text-[var(--primary)]">{post.category}</p>
                <h4 className="mt-2 text-lg font-semibold">{post.title}</h4>
                <p className="mt-2 text-sm text-[var(--foreground-muted)]">{post.excerpt}</p>
                <div className="mt-3 text-xs text-[var(--foreground-muted)] flex gap-3">
                  <span>{post.readingTime}</span>
                  <span>{post.date}</span>
                </div>
                <a href={`/blog/${post.slug}`} className="mt-3 inline-flex text-sm font-semibold text-[var(--primary)]">
                  Read story →
                </a>
              </article>
            ))}
          </div>
        </section>

        <section className="rounded-3xl border border-dashed border-white/20 p-6 text-center">
          <h3 className="text-2xl font-semibold text-[var(--primary)]">Subscribe to the Journal</h3>
          <p className="mt-2 text-sm text-[var(--foreground-muted)]">
            Join the editorial newsletter for monthly engineering notes and rider stories.
          </p>
          <a href="mailto:journal@finspeed.example" className="mt-4 inline-flex rounded-full bg-[var(--primary)] px-5 py-2 text-sm font-semibold text-white">
            Email the editorial team
          </a>
        </section>
      </div>
    </div>
  );
}
