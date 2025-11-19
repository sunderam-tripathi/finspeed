'use client';

import { useState } from 'react';
import { SiteHeader } from '@/components/site-header';

export default function ModelsPage() {
  const [locale, setLocale] = useState<'en' | 'hi'>('en');

  return (
    <div className="relative min-h-screen overflow-hidden bg-[var(--fs-bg-dark)] text-[var(--fs-text-primary)]">
      <div className="pointer-events-none absolute inset-0 opacity-60">
        <div className="brand-texture" />
      </div>
      <div className="relative mx-auto flex min-h-screen w-full max-w-5xl flex-col gap-10 px-5 py-8 sm:px-6 lg:px-10">
        <SiteHeader locale={locale} onLocaleChange={setLocale} />
        <main className="flex flex-1 flex-col gap-10 pb-12">
          <section
            className="rounded-[30px] border border-[var(--fs-card-border)] bg-[var(--fs-card)] px-6 py-8 text-[var(--fs-text-primary)] shadow-[var(--fs-card-shadow)]"
            aria-labelledby="models-hero"
          >
            <div className="space-y-3">
              <p className="text-xs font-semibold uppercase tracking-[0.45em] text-[var(--fs-primary)]">
                {locale === 'hi' ? 'FINSPEED मॉडल' : 'FINSPEED MODELS'}
              </p>
              <h1 id="models-hero" className="text-4xl font-semibold tracking-tight sm:text-5xl">
                {locale === 'hi' ? 'अपने राइडिंग स्टाइल के लिए प्लेटफॉर्म चुनें' : 'Choose the platform for your riding style'}
              </h1>
              <p className="text-base text-[var(--fs-text-muted)]">
                {locale === 'hi'
                  ? 'लॉन्च कैटलॉग में आठ मॉडल शामिल हैं — कम्यूटर से लेकर ट्रेल-रेडी एमटीबी और रोड रेसर तक। विस्तृत स्पेक शीट्स मॉडल पेज पर आएंगी; फिलहाल आप डीलर के साथ सही फ्रेम चुन सकते हैं।'
                  : 'Our launch catalog spans eight models, from city commuters to trail-ready MTBs and road racers. Full spec sheets will ship on dedicated model pages; for now, dealers can help you pick the right frame.'}
              </p>
            </div>
          </section>
          <section className="grid gap-4 rounded-3xl border border-[var(--fs-card-border)] bg-[var(--fs-card)] p-6 text-[var(--fs-text-primary)] shadow-[var(--fs-card-shadow-soft)]">
            <h2 className="text-2xl font-semibold text-[var(--fs-text-primary)]">
              {locale === 'hi' ? 'अभी आप क्या कर सकते हैं' : 'What you can do today'}
            </h2>
            <ul className="mt-2 space-y-3 text-sm text-[var(--fs-text-muted)]">
              <li>
                {locale === 'hi'
                  ? 'ब्रांड स्टोरी पढ़ें और देखें कि Finspeed किन राइडर्स के लिए इंजीनियर किया गया है।'
                  : 'Read the brand story to understand who Finspeed builds for and how each platform evolved.'}
              </li>
              <li>
                {locale === 'hi'
                  ? 'डीलर लोकेटर से अपने शहर में स्टूडियो खोजें और टेस्ट राइड स्लॉट बुक करें।'
                  : 'Use the dealer locator to find a studio in your city and book a test ride slot.'}
              </li>
              <li>
                {locale === 'hi'
                  ? 'ब्लॉग में सेटअप गाइड और राइडिंग टिप्स देखें — डीलर के साथ बातचीत के लिए तैयारी करें।'
                  : 'Browse the blog for setup guides and riding tips so you can arrive at the studio with the right questions.'}
              </li>
            </ul>
            <div className="mt-4 flex flex-wrap gap-3">
              <a
                href="/catalog"
                className="focus-ring-target inline-flex items-center justify-center gap-2 rounded-full bg-[var(--fs-primary)] px-6 py-3 text-sm font-semibold text-[var(--fs-ink)] transition hover:bg-[var(--fs-primary-dark)]"
              >
                {locale === 'hi' ? 'कैटलॉग देखें' : 'View catalog overview'}
              </a>
              <a
                href="/dealers"
                className="focus-ring-target inline-flex items-center justify-center gap-2 rounded-full border border-[var(--fs-primary)] px-6 py-3 text-sm font-semibold text-[var(--fs-primary)] transition hover:bg-[rgba(64,176,208,0.08)] hover:text-[var(--fs-text-primary)]"
              >
                {locale === 'hi' ? 'डीलर खोजें' : 'Find a dealer'}
              </a>
              <a
                href="/brand-story"
                className="focus-ring-target inline-flex items-center justify-center gap-2 rounded-full border border-[var(--fs-border)] px-6 py-3 text-sm font-semibold text-[var(--fs-text-primary)] transition hover:border-[var(--fs-primary)]"
              >
                {locale === 'hi' ? 'हमारी कहानी पढ़ें' : 'Read the brand story'}
              </a>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
