'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { jwtDecode } from 'jwt-decode';

interface User {
  id: number;
  email: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
}

const AdminAuthContext = createContext<AuthContextType | undefined>(undefined);

export const AdminAuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded: { user_id: number; email: string; role: string; exp: number } = jwtDecode(token);
        if (decoded.exp * 1000 > Date.now() && decoded.role === 'admin') {
          setUser({ id: decoded.user_id, email: decoded.email, role: decoded.role });
        } else {
          router.push('/login');
        }
      } catch (error) {
        console.error('Invalid token:', error);
        router.push('/login');
      }
    } else {
      router.push('/login');
    }
    setIsLoading(false);
  }, [router]);

  return (
    <AdminAuthContext.Provider value={{ user, isLoading }}>
      {!isLoading && user ? children : null}
    </AdminAuthContext.Provider>
  );
};

export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext);
  if (context === undefined) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  return context;
};
