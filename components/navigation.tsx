"use client"

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Users, UserCog, Clipboard, AlertTriangle, Home, Menu } from 'lucide-react';
import { navbarData } from '@/api/service/navbarService';

const Navigation = () => {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [links, setLinks] = useState([]); // Initialize state for links
  
  const defaultlink = [
    { menuSlug: '/', menuName: 'Dashboard', icon: Home },
    { menuSlug: '/clients', menuName: 'Clients', icon: Users },
    { menuSlug: '/staff', menuName: 'Staff', icon: UserCog },
    { menuSlug: '/care-plans', menuName: 'Care Plans', icon: Clipboard },
    { menuSlug: '/incidents', menuName: 'Incidents', icon: AlertTriangle },
  ];

  useEffect(() => {
    const fetchNavbarData = async () => {
      debugger;
      const navbarList = await navbarData();
      setLinks(navbarList.menuList);
    };

    fetchNavbarData();
  }, defaultlink);

  const renderLinks = (links: any) => {
    return links.map((link: any) => {
      const Icon = link.icon; // Assuming you have a mapping for icon names to components
      return (
        <div key={link.menuSlug}>
          <Link href={link.menuSlug} passHref>
            <Button
              variant="ghost"
              className={cn(
                "w-full justify-start mb-2",
                pathname === link.menuSlug && "bg-gray-200 dark:bg-gray-700",
                isCollapsed && "px-2"
              )}
            >
              <Icon className={cn("h-4 w-4", isCollapsed ? "mr-0" : "mr-2")} />
              {!isCollapsed && link.menuName}
            </Button>
          </Link>
          {/* Render child links if they exist */}
          {link.children && link.children.length > 0 && !isCollapsed && (
            <div className="ml-4">
              {renderLinks(link.children)}
            </div>
          )}
        </div>
      );
    });
  };

  return (
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
      {renderLinks(links)}
    </nav>
  );
};

export default Navigation;