import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "Finspeed - Premium Cycles for India",
  description: "Fast, reliable e-commerce platform for premium bicycles and accessories in India",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased">
        {/* Navigation */}
        <nav className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-4">
              <div className="flex items-center">
                <Link href="/" className="text-2xl font-bold text-primary-600">
                  Finspeed
                </Link>
              </div>
              <div className="hidden md:flex space-x-8">
                <Link href="/products" className="text-gray-700 hover:text-primary-600 transition-colors">
                  Products
                </Link>
                <Link href="/categories" className="text-gray-700 hover:text-primary-600 transition-colors">
                  Categories
                </Link>
                <Link href="/cart" className="text-gray-700 hover:text-primary-600 transition-colors">
                  Cart
                </Link>
                <Link href="/admin" className="text-gray-700 hover:text-primary-600 transition-colors">
                  Admin
                </Link>
              </div>
              <div className="flex items-center space-x-4">
                <Link href="/auth/login" className="text-gray-700 hover:text-primary-600 transition-colors">
                  Login
                </Link>
                <Link href="/auth/register" className="btn-primary">
                  Sign Up
                </Link>
              </div>
            </div>
          </div>
        </nav>

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
