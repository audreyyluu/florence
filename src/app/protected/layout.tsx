"use client";

import { Loader2 } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { redirect } from "next/navigation";
import SidebarComponent from "@/components/protected/Sidebar";
import type { MenuItem } from "@/components/protected/Sidebar";
import { useEffect } from "react";
import { useUserRole } from "@/contexts/UserRoleContext";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isLoading, isAuthenticated, user } = useAuth();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      redirect('/auth');
    }
  }, [isLoading, isAuthenticated]);

  const { role: userRole } = useUserRole();

  const isHealthcareProvider = userRole === 'healthcareProvider';

  const protectedMenuItems: MenuItem[] = [
    { label: "Dashboard", href: "/protected/", section: "Monitoring" },
    { label: "Alerts History", href: "/protected/alerts", section: "Monitoring" },
    { 
      label: isHealthcareProvider ? "Staff Coordination" : "Caregiver Assistance", 
      href: "/protected/staffing", 
      section: "Monitoring" 
    },
    { 
      label: isHealthcareProvider ? "Hospital Map" : "Home Map", 
      href: "/protected/map", 
      section: "Monitoring" 
    },
    { label: "Settings", href: "/protected/settings", section: "System" },
    { label: "User Guide", href: "/protected/user-guide", section: "System" }
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-12 w-12 animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // Will be redirected by the useEffect
  }

  return (
    <SidebarComponent 
      menuItems={protectedMenuItems} 
      userEmail={user?.email} 
      userName={user?.user_metadata?.full_name}
      logoName="CareCam"
    >
      {children}
    </SidebarComponent>
  );
}