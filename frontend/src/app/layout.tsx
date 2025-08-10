import React from 'react';
import './globals.css';

export const metadata = {
  title: 'Finspeed - Premium Cycles in India',
  description: 'Fast, reliable e-commerce for premium cycles in India',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-gray-50 text-gray-900 antialiased" suppressHydrationWarning={true}>
        <div className="min-h-screen">
          {children}
        </div>
      </body>
    </html>
  );
}
