import { ReactNode } from 'react';

interface AdminOnlyLayoutProps {
  children: ReactNode;
}

export default function AdminOnlyLayout({ children }: AdminOnlyLayoutProps) {
  return (
    <html lang="en">
      <body>
        <div className="min-h-screen bg-gray-50">
          <nav className="bg-white shadow-sm border-b">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between h-16">
                <div className="flex items-center">
                  <h1 className="text-xl font-semibold text-gray-900">
                    Finspeed Admin
                  </h1>
                </div>
                <div className="flex items-center">
                  <span className="text-sm text-gray-500">
                    Protected by IAP
                  </span>
                </div>
              </div>
            </div>
          </nav>
          <main>{children}</main>
        </div>
      </body>
    </html>
  );
}
