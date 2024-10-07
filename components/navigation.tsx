"use client"

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Users, UserCog, Clipboard, AlertTriangle, Home, Menu } from 'lucide-react';
import TopBar from '@/components/top-bar';

const Navigation = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(true);

  const links = [
    { href: '/', label: 'Dashboard', icon: Home },
    { href: '/clients', label: 'Clients', icon: Users },
    { href: '/staff', label: 'Staff', icon: UserCog },
    { href: '/care-plans', label: 'Care Plans', icon: Clipboard },
    { href: '/incidents', label: 'Incidents', icon: AlertTriangle },
  ];

  return (
    <div className="flex flex-col h-screen">
      <TopBar />
      <div className="flex flex-1 overflow-hidden">
        <nav className={cn(
          "flex flex-col bg-gray-100 dark:bg-gray-800 p-4 transition-all duration-300",
          isCollapsed ? "w-20" : "w-64"
        )}>
          <div className="flex items-center justify-between mb-8">
            {!isCollapsed && <h1 className="text-2xl font-bold">HMS</h1>}
            <Button variant="ghost" size="icon" onClick={() => setIsCollapsed(!isCollapsed)}>
              <Menu className="h-6 w-6" />
            </Button>
          </div>
          {links.map((link) => {
            const Icon = link.icon;
            return (
              <Link key={link.href} href={link.href} passHref>
                <Button
                  variant="ghost"
                  className={cn(
                    "w-full justify-start mb-2",
                    pathname === link.href && "bg-gray-200 dark:bg-gray-700",
                    isCollapsed && "px-2"
                  )}
                >
                  <Icon className={cn("h-4 w-4", isCollapsed ? "mr-0" : "mr-2")} />
                  {!isCollapsed && link.label}
                </Button>
              </Link>
            );
          })}
        </nav>
        <main className="flex-1 overflow-y-auto p-8">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Navigation;