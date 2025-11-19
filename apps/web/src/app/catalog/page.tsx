'use client';

import Image from 'next/image';
import { useState } from 'react';
import { SiteHeader } from '@/components/site-header';
import type { LocaleKey } from '@/data/brand';
import atbHero from '@/assets/portfolio/ATB/category-picture-ATB.png';
import mtbHero from '@/assets/portfolio/MTB/mtb-bike-category.png';
import roadHero from '@/assets/portfolio/Road/road-racer-bikes.png';

type CatalogCategory = {
  id: string;
  label: string;
  subtitle: string;
  description: string;
  badge: string;
  image: 'atb' | 'mtb' | 'road';
};

const CATALOG_COPY: Record<LocaleKey, { title: string; intro: string; categories: CatalogCategory[] }> = {
  en: {
    title: 'Finspeed product catalog',
    intro:
      'Browse the launch catalog by discipline. ATB, MTB, and Road Racer families mirror the eight baseline bikes defined in the SCN-002 product catalog — with factory-direct pricing, warranty, and service promises repeated on every card.',
    categories: [
      {
        id: 'atb',
        label: 'ATB',
        subtitle: 'All Terrain Bikes · 2 models',
        description:
          'Shark (Grey) and Great White Shark (Standard) with high tensile steel frames and double-walled rims for everyday urban and campus rides.',
        badge: '2 models · factory-direct ₹5,500–₹5,800',
        image: 'atb'
      },
      {
        id: 'road',
        label: 'Road Racer',
        subtitle: 'Speed & endurance · 2 models',
        description:
          'Marlin (Yellow, Red) with 700C wheels and sleek tyres for smooth, fast commutes and weekend road rides.',
        badge: '2 models · factory-direct ₹9,000–₹10,000',
        image: 'road'
      },
      {
        id: 'mtb',
        label: 'MTB',
        subtitle: 'Trail-ready hardtails · 4 models',
        description:
          'Shark (Mustard, Mustard Green, Blue, Sea Green) with front suspension, disc brakes, and broad tyres tuned for Indian trails and mixed terrain.',
        badge: '4 models · factory-direct ₹7,200–₹9,600',
        image: 'mtb'
      }
    ]
  },
  hi: {
    title: 'Finspeed प्रोडक्ट कैटलॉग',
    intro:
      'लॉन्च कैटलॉग को डिसिप्लिन के अनुसार ब्राउज़ करें — ATB, MTB और रोड रेसर परिवार। कीमत, वारंटी और सर्विस वादे SCN-002 कैटलॉग के अनुरूप रखे गए हैं।',
    categories: [
      {
        id: 'atb',
        label: 'ATB',
        subtitle: 'ऑल टेरेन बाइक · 2 मॉडल',
        description:
          'Shark (Grey) और Great White Shark (Standard) — हाई टेंसाइल स्टील फ्रेम और डबल वॉल रिम के साथ रोज़मर्रा की राइड के लिए।',
        badge: '2 मॉडल · फैक्टरी प्राइस ₹5,500–₹5,800',
        image: 'atb'
      },
      {
        id: 'road',
        label: 'रोड रेसर',
        subtitle: 'स्पीड और एंड्यूरेंस · 2 मॉडल',
        description:
          'Marlin (Yellow, Red) — 700C व्हील और स्लिक टायर्स के साथ तेज़ कम्यूट और वीकेंड रोड राइड्स के लिए।',
        badge: '2 मॉडल · फैक्टरी प्राइस ₹9,000–₹10,000',
        image: 'road'
      },
      {
        id: 'mtb',
        label: 'एमटीबी',
        subtitle: 'ट्रेल-रेडी हार्डटेल · 4 मॉडल',
        description:
          'Shark (Mustard, Mustard Green, Blue, Sea Green) — फ्रंट सस्पेंशन, डिस्क ब्रेक और चौड़े टायर्स के साथ भारतीय ट्रेल और मिक्स्ड टेरेन के लिए।',
        badge: '4 मॉडल · फैक्टरी प्राइस ₹7,200–₹9,600',
        image: 'mtb'
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
              {copy.categories.map((category) => {
                const hero =
                  category.image === 'atb' ? atbHero : category.image === 'mtb' ? mtbHero : roadHero;
                const alt =
                  category.image === 'atb'
                    ? locale === 'hi'
                      ? 'ATB श्रेणी के लिए Finspeed साइकिलें'
                      : 'Finspeed ATB category bikes'
                    : category.image === 'mtb'
                    ? locale === 'hi'
                      ? 'MTB श्रेणी के लिए Finspeed साइकिलें'
                      : 'Finspeed MTB category bikes'
                    : locale === 'hi'
                    ? 'रोड रेसर श्रेणी के लिए Finspeed साइकिलें'
                    : 'Finspeed Road Racer category bikes';

                return (
                  <article
                    key={category.id}
                    className="flex flex-col justify-between rounded-3xl border border-[var(--fs-card-border)] bg-[var(--fs-card)] p-5 text-[var(--fs-text-primary)] shadow-[var(--fs-card-shadow-soft)]"
                  >
                    <div className="space-y-3">
                      <div className="overflow-hidden rounded-2xl border border-[var(--fs-card-border)] bg-[var(--fs-surface-muted)]">
                        <Image
                          src={hero}
                          alt={alt}
                          className="h-40 w-full object-cover"
                          priority={category.id === 'mtb'}
                        />
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[var(--fs-primary)]">
                          {category.label}
                        </p>
                        <h3 className="text-xl font-semibold text-[var(--fs-text-primary)]">{category.subtitle}</h3>
                        <p className="text-sm text-[var(--fs-text-muted)]">{category.description}</p>
                      </div>
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
                );
              })}
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
