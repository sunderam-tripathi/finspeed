'use client';

import { useState } from 'react';
import { SiteHeader } from '@/components/site-header';
import type { LocaleKey } from '@/data/brand';

type CatalogCategory = {
  id: string;
  label: string;
  subtitle: string;
  description: string;
  badge: string;
};

const CATALOG_COPY: Record<LocaleKey, { title: string; intro: string; categories: CatalogCategory[] }> = {
  en: {
    title: 'Bicycles catalog',
    intro: 'Explore our core families — pick a discipline to see where each platform shines before you book a test ride or visit a studio.',
    categories: [
      {
        id: 'mtb',
        label: 'MTB',
        subtitle: 'Trail & off-road',
        description: 'Hardtail and full-suspension platforms tuned for Indian trails, weekend singletrack, and uplift days.',
        badge: '4 models'
      },
      {
        id: 'road',
        label: 'Road Racer',
        subtitle: 'Speed & endurance',
        description: 'Aero and endurance frames engineered for long-haul efforts, crits, and fast group rides.',
        badge: '2 models'
      },
      {
        id: 'city',
        label: 'City & commute',
        subtitle: 'Everyday reliability',
        description: 'Robust commuters and hybrid frames with mounts for racks, fenders, and dynamo lighting.',
        badge: '2 models'
      }
    ]
  },
  hi: {
    title: 'साइकिल कैटलॉग',
    intro: 'अपनी राइडिंग शैली के अनुसार परिवार चुनें — ट्रेल, रोड या डेली कम्यूट — और टेस्ट राइड या स्टूडियो विज़िट प्लान करें।',
    categories: [
      {
        id: 'mtb',
        label: 'एमटीबी',
        subtitle: 'ट्रेल और ऑफ-रोड',
        description: 'भारतीय ट्रेल्स और वीकेंड सिंगलट्रैक के लिए ट्यून किए गए हार्डटेल और फुल सस्पेंशन प्लेटफॉर्म।',
        badge: '4 मॉडल'
      },
      {
        id: 'road',
        label: 'रोड रेसर',
        subtitle: 'स्पीड और एंड्यूरेंस',
        description: 'लॉन्ग राइड्स, क्रिट्स और तेज़ ग्रुप राइड्स के लिए एयरो और एंड्यूरेंस फ्रेम।',
        badge: '2 मॉडल'
      },
      {
        id: 'city',
        label: 'सिटी और कम्यूट',
        subtitle: 'रोज़मर्रा की भरोसेमंद राइड',
        description: 'मजबूत कम्यूटर्स और हाइब्रिड फ्रेम जिनमें रैक, फेंडर और डायनेमो लाइटिंग के लिए माउंट हैं।',
        badge: '2 मॉडल'
      }
    ]
  }
};

export default function CatalogPage() {
  const [locale, setLocale] = useState<LocaleKey>('en');
  const copy = CATALOG_COPY[locale];

  return (
    <div className="relative min-h-screen overflow-hidden bg-[var(--fs-bg-dark)] text-[var(--fs-text-primary)]">
      <div className="pointer-events-none absolute inset-0 opacity-60">
        <div className="brand-texture" />
      </div>
      <div className="relative mx-auto flex min-h-screen w-full max-w-6xl flex-col gap-10 px-5 py-8 sm:px-6 lg:px-10">
        <SiteHeader locale={locale} onLocaleChange={setLocale} />
        <main className="flex flex-1 flex-col gap-10 pb-12">
          <section
            className="rounded-[30px] border border-[var(--fs-card-border)] bg-[var(--fs-card)] px-6 py-8 text-[var(--fs-text-primary)] shadow-[var(--fs-card-shadow)]"
            aria-labelledby="catalog-hero"
          >
            <div className="space-y-3">
              <p className="text-xs font-semibold uppercase tracking-[0.45em] text-[var(--fs-primary)]">
                {locale === 'hi' ? 'FINSPEED कैटलॉग' : 'FINSPEED CATALOG'}
              </p>
              <h1 id="catalog-hero" className="text-4xl font-semibold tracking-tight sm:text-5xl">
                {copy.title}
              </h1>
              <p className="text-base text-[var(--fs-text-muted)]">{copy.intro}</p>
            </div>
          </section>
          <section aria-label={locale === 'hi' ? 'कैटलॉग श्रेणियाँ' : 'Catalog categories'} className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-semibold text-[var(--fs-text-primary)]">
                {locale === 'hi' ? 'डिसिप्लिन के अनुसार ब्राउज़ करें' : 'Browse by discipline'}
              </h2>
              <span className="text-xs uppercase tracking-[0.35em] text-[var(--fs-text-soft)]">
                {locale === 'hi' ? 'आठ मॉडल · लॉन्च कैटलॉग' : 'Eight models · launch catalog'}
              </span>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              {copy.categories.map((category) => (
                <article
                  key={category.id}
                  className="flex flex-col justify-between rounded-3xl border border-[var(--fs-card-border)] bg-[var(--fs-card)] p-5 text-[var(--fs-text-primary)] shadow-[var(--fs-card-shadow-soft)]"
                >
                  <div className="space-y-2">
                    <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[var(--fs-primary)]">
                      {category.label}
                    </p>
                    <h3 className="text-xl font-semibold text-[var(--fs-text-primary)]">{category.subtitle}</h3>
                    <p className="text-sm text-[var(--fs-text-muted)]">{category.description}</p>
                  </div>
                  <div className="mt-4 flex items-center justify-between">
                    <span className="inline-flex items-center rounded-full border border-[var(--fs-card-border)] bg-[var(--fs-surface-muted)] px-3 py-1 text-xs text-[var(--fs-text-muted)]">
                      {category.badge}
                    </span>
                    <a
                      href="/dealers"
                      className="focus-ring-target rounded-full border border-[var(--fs-primary)] px-4 py-1.5 text-xs font-semibold text-[var(--fs-primary)] transition hover:bg-[var(--fs-primary)] hover:text-[var(--fs-ink)]"
                    >
                      {locale === 'hi' ? 'टेस्ट राइड खोजें' : 'Find a test ride'}
                    </a>
                  </div>
                </article>
              ))}
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}

