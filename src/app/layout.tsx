import { ConvexClientProvider } from "@/app/ConvexClientProvider";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "next-themes";
import { AppStateProvider } from '@/contexts/AppStateContext'

// Optimize fonts by using the next/font feature
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap", // Add display: swap for better performance
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap", // Add display: swap for better performance
});

export const metadata: Metadata = {
  title: "Florence",
  description: "Advanced monitoring solutions for healthcare environments",
  icons: {
    icon: "/favicon_crack_light.png",
  },
};

// ROOT LAYOUT. Do not touch this file
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="/" />
        <link rel="dns-prefetch" href="/" />
        <link rel="prefetch" href="/protected" as="document" />
        <link rel="prefetch" href="/protected/alerts" as="document" />
        <link rel="prefetch" href="/protected/staffing" as="document" />
        <link rel="prefetch" href="/protected/map" as="document" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background`}
        data-preload="true"
      >
        <AppStateProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <ConvexClientProvider>{children}</ConvexClientProvider>
          </ThemeProvider>
        </AppStateProvider>
      </body>
    </html>
  );
}