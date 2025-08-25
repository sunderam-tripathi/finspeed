import type { Metadata } from 'next';
import './globals.css';
import Header from '@/components/Header';
import { ThemeProvider } from '../theme/theme-context';
import ClientBootstrap from '@/components/ClientBootstrap';

export const metadata: Metadata = {
  title: 'Finspeed Admin - Management Dashboard',
  description: 'Administrative dashboard for managing Finspeed e-commerce platform.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>
      <body className="antialiased h-full bg-[color:var(--md-sys-color-background)] text-[color:var(--md-sys-color-on-background)]">
        <ThemeProvider>
          {/* Client-only bootstrap for M3 flag and fetch interception */}
          <ClientBootstrap />
          <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-1">
              {children}
            </main>
            <footer className="border-t border-[color:var(--md-sys-color-outline-variant)] bg-[color:var(--md-sys-color-surface-container)]">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                <div className="text-center text-sm text-[color:var(--md-sys-color-on-surface-variant)]">
                  <p>&copy; {new Date().getFullYear()} Finspeed Admin. All rights reserved.</p>
                </div>
              </div>
            </footer>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
