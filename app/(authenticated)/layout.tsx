"use client"

import { useAuth } from '@/contexts/auth-context';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Navigation from '@/components/navigation';
import TopBar from '@/components/top-bar'; // Import TopBar
import Loader from '@/components/loader';

export default function AuthenticatedLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
    }
  }, [user, isLoading, router]);

  if (isLoading ) {
    return <Loader/>;
  }

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex">
        <Navigation />
        <div className="flex-1 flex flex-col">
          <TopBar /> 
          <main className="flex-1 overflow-y-auto p-8 min-h-screen">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}