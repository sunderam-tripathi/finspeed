import type { Metadata } from 'next';
import { Hind, Inter } from 'next/font/google';
import './globals.css';
import { ConsentBanner } from '@/components/consent-banner';
import dynamic from 'next/dynamic';

const ThemeProvider = dynamic(() => import('@/components/theme-provider').then((mod) => mod.ThemeProvider), { ssr: false });

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
  title: 'Finspeed — Turning Pedals into Power',
  description: 'Precision-engineered bicycles with bilingual dealer access across India.'
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${hind.variable} antialiased`}>
        <ThemeProvider>
          {children}
          <ConsentBanner />
        </ThemeProvider>
      </body>
    </html>
  );
}
