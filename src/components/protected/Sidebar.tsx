"use client"
import React, { useState, useEffect } from 'react';
import { useIsMobile } from "@/hooks/use-mobile";
import Link from 'next/link';
import Image from 'next/image'
import { UserButton } from '../auth/UserButton';
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { LogOut } from "lucide-react";
import { useRouter, usePathname } from "next/navigation";

// Define menu item interface
export interface MenuItem {
  label: string;
  href: string;
  icon?: string; // Optional icon
  section?: string; // Optional section grouping
}

interface SidebarProps {
  children?: React.ReactNode;
  menuItems?: MenuItem[]; // New prop for dynamic menu items
  logoName?: string; // New prop for custom page name
  pageTitle?: string; // New prop for the navigation bar title
  currentPath?: string; // New prop to track the current path for highlighting
  userEmail?: string; // New prop for user email
  userName?: string; // New prop for user name
}

// Default menu items to maintain backward compatibility
const defaultMenuItems: MenuItem[] = [
  { label: 'Dashboard', href: '/dashboard', icon: 'dashboard', section: 'Main' },
  { label: 'Profile', href: '/profile', icon: 'person', section: 'Main' },
  { label: 'Settings', href: '/settings', icon: 'settings', section: 'System' },
  { label: 'Messages', href: '/messages', icon: 'mail', section: 'System' },
  { label: 'Help', href: '/help', icon: 'help_circle', section: 'Support' },
  { label: 'Discord', href: 'https://discord.gg/2gSmB9DxJW', section: 'Support' }
];

const Sidebar: React.FC<SidebarProps> = ({ 
  children, 
  menuItems = defaultMenuItems, // Use default items if not provided
  logoName = "crack.diy", // Default page name if not provided
  pageTitle, // Page title shown in the navigation bar
  currentPath: propCurrentPath, // Current path from props
  userEmail = "", // User email
  userName = "" // User name
}) => {
  const [collapsed, setCollapsed] = useState(false);
  const isMobile = useIsMobile();
  const { signOut } = useAuth();
  const router = useRouter();
  const pathname = usePathname(); // Get current path from router
  
  // Use pathname from router if currentPath prop is not provided
  const currentPath = propCurrentPath || pathname || "";

  // Prefetch all menu items for faster navigation
  useEffect(() => {
    menuItems.forEach(item => {
      if (item.href !== currentPath && item.href.startsWith('/')) {
        router.prefetch(item.href);
      }
    });
  }, [menuItems, currentPath, router]);

  // Function to extract and format name from email
  const getNameFromEmail = (email: string): string => {
    if (!email) return "User";
    
    // Extract the part before @ symbol
    const namePart = email.split('@')[0];
    
    // Replace dots and underscores with spaces
    const nameWithSpaces = namePart.replace(/[._]/g, ' ');
    
    // Capitalize each word
    return nameWithSpaces
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  // Use userName if provided, otherwise try to extract from email
  const displayName = userName || (userEmail ? getNameFromEmail(userEmail) : "John Doe");

  // Handle logout with redirection to home page
  const handleLogout = () => {
    signOut();
    router.push('/');
  };

  return (
    <div className="flex h-screen">
      {/* Overlay to close sidebar when clicking outside on mobile */}
      {isMobile && !collapsed && (
        <div 
          className="fixed inset-0 bg-black/20" 
          onClick={() => setCollapsed(true)}
          aria-hidden="true"
        />
      )}
      
      {/* Sidebar - Always visible on desktop, toggleable on mobile */}
      <div
        className={`w-[200px] h-full transition-transform duration-300 ease-in-out ${
          isMobile ? 'absolute bg-background z-50' : 'relative'
        } ${
          (isMobile && collapsed) ? '-translate-x-full' : 'translate-x-0'
        } overflow-y-auto left-0 top-0 border-r border-border flex flex-col`}
      >
        {/* Logo in Sidebar */}
        <div className="p-4 flex justify-between items-center">
          <Link href="/" prefetch={true} className='flex flex-row gap-x-2'>
            <Image alt="logo" src="/Florence.svg" width={25} height={15} className="dark:invert" />
            <h1 className="text-lg sm:text-2xl md:text-2xl font-bold tracking-tighter bg-clip-text text-indigo-900">Florence</h1>
          </Link>
          {/* Close button - Only visible on mobile */}
          {isMobile && !collapsed && (
            <button
              onClick={() => setCollapsed(true)}
              className="bg-transparent border-none cursor-pointer text-xl p-1"
              aria-label="Close menu"
            >
              ✕
            </button>
          )}
        </div>
        
        {/* Navigation Links */}
        <nav className="mt-2.5 flex-grow">

          {/* Group menu items by section */}
          {Array.from(new Set(menuItems.map(item => item.section || 'General'))).map(section => (
            <div key={section}>
              <h3 className="text-xs uppercase text-muted-foreground ml-4 mb-1 mt-4 tracking-wider text-left">
                {section}
              </h3>
              <ul className="list-none p-0 m-0">
                {menuItems
                  .filter(item => (item.section || 'General') === section)
                  .map((item, index) => {
                    const isActive = currentPath === item.href;
                    return (
                      <li key={index}>
                        <Link 
                          href={item.href}
                          prefetch={true}
                          className={`flex items-center px-7 py-2 text-sm font-medium my-0.5 bg-transparent transition-all duration-200 ease-in justify-start text-left hover:text-foreground hover:bg-accent hover:border-r-accent-foreground hover:border-r-[3px] border-r-transparent ${
                            isActive 
                              ? 'text-foreground bg-accent border-r-accent-foreground border-r-[3px] font-semibold' 
                              : 'text-muted-foreground no-underline'
                          }`}
                        >
                          {item.label}
                        </Link>
                      </li>
                    );
                  })}
              </ul>
            </div>
          ))}
        </nav>
        
        {/* Simplified Logout button instead of user info */}
        <div className="px-4 py-3 border-t border-border flex items-center justify-center">
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full" 
            onClick={handleLogout}
          >
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>
        
        {/* Credit text */}
        <div className="px-4 py-3 text-xs text-center border-t border-border">
          Florence © 2025
        </div>
      </div>

      {/* Content area */}
      <div className="flex flex-col flex-1">
        {/* Mobile-only top navigation bar */}
        {isMobile && (
          <div className={`h-14 ${collapsed ? 'border-b border-border' : ''} flex items-center justify-center relative px-4`}>
            {/* Hamburger menu button - Only visible when sidebar is collapsed */}
            {collapsed && (
              <button
                onClick={() => setCollapsed(false)}
                className="absolute left-4 bg-transparent border-none cursor-pointer text-xl p-1 flex items-center justify-center"
                aria-label="Open menu"
              >
                ☰
              </button>
            )}
            
            {/* Centered logo/title */}
            <div className="text-xl font-serif font-extrabold">
              {logoName}
            </div>
          </div>
        )}
        
        {/* Content */}
        <div className="flex-1 p-6 overflow-auto">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;