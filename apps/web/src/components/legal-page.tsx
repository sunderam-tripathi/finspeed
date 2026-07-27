import Link from 'next/link';
import type { ReactNode } from 'react';

// Legal and policy pages are deliberately server-rendered outside the design
// SPA (WEB-041): payment-gateway reviewers, regulators and crawlers must be
// able to read them without JavaScript. Chrome is intentionally minimal and
// self-contained for the same reason.

export const LEGAL_ROUTES = [
  { href: '/privacy', label: 'Privacy policy' },
  { href: '/terms', label: 'Terms of service' },
  { href: '/refunds', label: 'Returns & refunds' },
  { href: '/shipping', label: 'Shipping policy' },
] as const;

export const LAST_UPDATED = '27 July 2026';

export function LegalPage({ title, intro, children }: { title: string; intro: string; children: ReactNode }) {
  return (
    <main className="legal-page">
      <header className="legal-page__header">
        <Link href="/" className="legal-page__brand">FINSPEED</Link>
        <p className="legal-page__eyebrow">Policies</p>
        <h1>{title}</h1>
        <p className="legal-page__intro">{intro}</p>
        <p className="legal-page__meta">Last updated {LAST_UPDATED}</p>
      </header>

      <div className="legal-page__body">{children}</div>

      <footer className="legal-page__footer">
        <nav aria-label="Policies">
          <ul>
            {LEGAL_ROUTES.map((route) => (
              <li key={route.href}><Link href={route.href}>{route.label}</Link></li>
            ))}
            <li><Link href="/contact">Contact us</Link></li>
          </ul>
        </nav>
        <p>
          Finspeed · Greater Noida, Uttar Pradesh, India ·{' '}
          <Link href="/">Back to the storefront</Link>
        </p>
      </footer>
    </main>
  );
}

export function Section({ heading, children }: { heading: string; children: ReactNode }) {
  return (
    <section className="legal-page__section">
      <h2>{heading}</h2>
      {children}
    </section>
  );
}
