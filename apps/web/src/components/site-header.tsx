'use client';

import dynamic from 'next/dynamic';
import { usePathname } from 'next/navigation';
import { BrandMark } from '@/components/brand-mark';
import { LocaleSwitch } from '@/components/locale-switch';
import { HOME_COPY, LocaleKey, NAV_LINKS, SUPPORT_CHANNELS } from '@/data/content';
import { useTheme } from '@/components/theme-provider';

const ThemeToggle = dynamic(() => import('@/components/theme-toggle').then((mod) => mod.ThemeToggle), { ssr: false });

type SiteHeaderProps = {
  locale: LocaleKey;
  onLocaleChange: (locale: LocaleKey) => void;
};

export function SiteHeader({ locale, onLocaleChange }: SiteHeaderProps) {
  const pathname = usePathname();
  const { theme } = useTheme();
  const panelClass = theme === 'light' ? 'glass-panel-light' : 'glass-panel';
  const whatsapp = SUPPORT_CHANNELS.find((channel) => channel.label.toLowerCase().includes('whatsapp'));

  return (
    <header className={`${panelClass} sticky top-4 z-30 px-5 py-4 text-[var(--fs-text-primary)]`}>
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-3">
          <BrandMark className="rounded-full border border-[var(--fs-card-border)] bg-[var(--fs-surface-muted)] px-3 py-1" priority />
          <span className="text-xs font-semibold uppercase tracking-[0.4em] text-[var(--fs-text-muted)]">
            {HOME_COPY.en.hero.headline}
          </span>
        </div>
        <nav
          aria-label="Primary navigation"
          className="flex flex-wrap items-center justify-center gap-3 text-sm font-medium text-[var(--fs-text-muted)]"
        >
          {NAV_LINKS.map((link) => {
            const isActive = pathname ? pathname === link.href || pathname.startsWith(`${link.href}/`) : false;
            return (
              <a
                key={link.href}
                href={link.href}
                data-active={isActive}
                aria-current={isActive ? 'page' : undefined}
                className="focus-ring-target rounded-full px-4 py-2 text-[var(--fs-text-muted)] transition hover:text-[var(--fs-text-primary)] data-[active=true]:bg-[var(--fs-nav-active)] data-[active=true]:text-[var(--fs-text-primary)]"
              >
                {link.label}
              </a>
            );
          })}
        </nav>
        <div className="flex items-center justify-end gap-3">
          <LocaleSwitch value={locale} onChange={onLocaleChange} />
          <ThemeToggle />
          {whatsapp ? (
            <a
              href={whatsapp.href}
              className="focus-ring-target inline-flex items-center gap-2 rounded-full bg-[var(--fs-primary)] px-4 py-2 text-sm font-semibold text-[var(--fs-ink)] transition hover:bg-[var(--fs-primary-dark)] hover:text-white"
            >
              <span>WhatsApp</span>
              <span aria-hidden>↗</span>
            </a>
          ) : null}
        </div>
      </div>
    </header>
  );
}

