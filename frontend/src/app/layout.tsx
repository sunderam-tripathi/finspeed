import type { Metadata } from 'next'
import { Rubik } from 'next/font/google'
import './globals.css'
import Header from '@/components/Header'
import Link from "next/link";

const rubik = Rubik({
  subsets: ['latin'],
  weight: ['400', '500', '700', '900'],
  variable: '--font-body',
})

export const metadata: Metadata = {
  title: 'Finspeed - Premium E-commerce Platform',
  description: 'Fast, reliable e-commerce platform for premium products. Built with modern technology for the best shopping experience.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      </head>
      <body className={`${rubik.variable} antialiased`} suppressHydrationWarning>
        <Header />
        
        {/* Main Content */}
        <main>
          {children}
        </main>

        {/* Footer */}
        <footer className="bg-gray-900 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div>
                <h3 className="text-lg font-semibold mb-4">Finspeed</h3>
                <p className="text-gray-400">Premium cycles and accessories for India</p>
              </div>
              <div>
                <h4 className="font-semibold mb-4">Products</h4>
                <ul className="space-y-2 text-gray-400">
                  <li><Link href="/products?category=road-bikes" className="hover:text-white">Road Bikes</Link></li>
                  <li><Link href="/products?category=mountain-bikes" className="hover:text-white">Mountain Bikes</Link></li>
                  <li><Link href="/products?category=electric-bikes" className="hover:text-white">Electric Bikes</Link></li>
                  <li><Link href="/products?category=accessories" className="hover:text-white">Accessories</Link></li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-4">Support</h4>
                <ul className="space-y-2 text-gray-400">
                  <li><Link href="/support" className="hover:text-white">Contact Us</Link></li>
                  <li><Link href="/shipping" className="hover:text-white">Shipping Info</Link></li>
                  <li><Link href="/returns" className="hover:text-white">Returns</Link></li>
                  <li><Link href="/warranty" className="hover:text-white">Warranty</Link></li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-4">Legal</h4>
                <ul className="space-y-2 text-gray-400">
                  <li><Link href="/privacy" className="hover:text-white">Privacy Policy</Link></li>
                  <li><Link href="/terms" className="hover:text-white">Terms of Service</Link></li>
                  <li><Link href="/cookies" className="hover:text-white">Cookie Policy</Link></li>
                </ul>
              </div>
            </div>
            <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
              <p>&copy; 2025 Finspeed. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
