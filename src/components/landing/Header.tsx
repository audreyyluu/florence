'use client'

import Link from 'next/link'
import Image from 'next/image'
import { AuthButton } from '@/components/auth/AuthButton'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/hooks/use-auth'
import { ChevronDown } from 'lucide-react'

export function Header() {
  const { signOut, isAuthenticated, isLoading } = useAuth()

  const navLinks = [
    { name: 'Features', href: '#features' },
    { name: 'Benefits', href: '#benefits' },
    { name: 'Pricing', href: '#pricing' },
  ]

  const scrollTo = (id: string) => {
    const element = document.querySelector(id)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <motion.header 
      className="w-full py-4 sticky top-0 z-50"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="container mx-auto px-4 lg:px-8 relative">
        <div className="backdrop-blur-md bg-white/80 dark:bg-gray-900/80 shadow-md rounded-full py-3 px-6 flex justify-between items-center">
          <motion.div
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <Link href="/" className="flex items-center gap-2">
              <Image alt="Florence Logo" src="/Florence.svg" width={32} height={32} className="dark:invert" />
              <h1 className="text-xl sm:text-2xl md:text-2xl font-bold tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-indigo-700 to-blue-600">Florence</h1>
            </Link>
          </motion.div>
          
          {/* Navigation links - centered with absolute positioning */}
          <nav className="hidden md:flex items-center space-x-8 absolute left-1/2 transform -translate-x-1/2">
            {navLinks.map((link) => (
              <motion.button
                key={link.name}
                className="text-gray-600 hover:text-indigo-700 font-medium text-sm whitespace-nowrap"
                onClick={() => scrollTo(link.href)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {link.name}
              </motion.button>
            ))}
          </nav>
          
          <nav className="flex items-center gap-3">
            {!isLoading && (
              isAuthenticated ? (
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button 
                    onClick={() => signOut()} 
                    variant="outline" 
                    className="rounded-full px-6 font-medium border-indigo-200 hover:border-indigo-300 hover:bg-indigo-50"
                  >
                    Logout
                  </Button>
                </motion.div>
              ) : (
                <>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="hidden sm:block"
                  >
                    <AuthButton trigger={
                      <Button variant="outline" className="rounded-full px-6 font-medium border-indigo-200 hover:border-indigo-300 hover:bg-indigo-50">
                        Login
                      </Button>
                    } />
                  </motion.div>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <AuthButton trigger={
                      <Button className="rounded-full px-6 py-5 font-medium bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm shadow-indigo-400/20">
                        Get Started
                      </Button>
                    } />
                  </motion.div>
                </>
              )
            )}
          </nav>
        </div>
      </div>
    </motion.header>
  )
}