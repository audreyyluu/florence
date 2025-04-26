"use client";

import type { MenuItem } from "@/components/protected/Sidebar";
import Sidebar from "@/components/protected/Sidebar";
import { useAuth } from "@/hooks/use-auth";
import { AuthLoading, Authenticated, Unauthenticated } from "convex/react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  const protectedMenuItems: MenuItem[] = [
    { label: "Dashboard", href: "/protected/", section: "Monitoring" },
    { label: "Alerts History", href: "/protected/alerts", section: "Monitoring" },
    { label: "Staff Coordination", href: "/protected/staffing", section: "Monitoring" },
    { label: "Hospital Map", href: "/protected/map", section: "Monitoring" },
    { label: "Settings", href: "/protected/settings", section: "System" },
    { label: "User Guide", href: "/protected/user-guide", section: "System" }
  ];

  const { isLoading, isAuthenticated, user } = useAuth();

  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push(`/auth?redirect=${encodeURIComponent(pathname)}`);
    }
  });

  return (
    <>
      <Unauthenticated>
        <div className="flex items-center justify-center min-h-screen">
          <Loader2 className="h-12 w-12 animate-spin " />
        </div>
      </Unauthenticated>
      <AuthLoading>
        <div className="flex items-center justify-center min-h-screen">
          <Loader2 className="h-12 w-12 animate-spin " />
        </div>
      </AuthLoading>
      <Authenticated>
        <Sidebar menuItems={protectedMenuItems} userEmail={user?.email} userName={user?.name} logoName="CareCam">
          {children}
        </Sidebar>
      </Authenticated>
    </>
  );
}