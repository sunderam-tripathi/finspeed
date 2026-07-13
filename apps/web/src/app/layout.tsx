import type { Metadata } from 'next';
import Script from 'next/script';
import { Hind, Inter } from 'next/font/google';
import './globals.css';
import { ConsentBanner } from '@/components/consent-banner';
import { ThemeProvider } from '@/components/theme-provider';

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
  display: 'swap'
});

const hind = Hind({
  variable: '--font-hind',
  subsets: ['latin', 'devanagari'],
  weight: ['400', '500', '600', '700'],
  display: 'swap'
});

export const metadata: Metadata = {
  title: 'Finspeed — Ride Beyond Boundaries',
  description: 'Finspeed performance bicycles and distributor ordering portal.'
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning data-theme="dark" style={{ colorScheme: 'dark' }}>
      <body className={`${inter.variable} ${hind.variable} antialiased`}>
        <Script id="theme-init" strategy="beforeInteractive">
          {`
            (function() {
              try {
                var stored = window.localStorage.getItem('finspeed-theme');
                var system = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
                var theme = (stored === 'light' || stored === 'dark') ? stored : system;
                document.documentElement.dataset.theme = theme;
                document.documentElement.style.colorScheme = theme;
              } catch (e) {
                document.documentElement.dataset.theme = 'dark';
                document.documentElement.style.colorScheme = 'dark';
              }
            })();
          `}
        </Script>
        <ThemeProvider>
          {children}
          <ConsentBanner />
        </ThemeProvider>
      </body>
    </html>
  );
}
