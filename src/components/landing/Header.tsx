'use client'

import Link from 'next/link'
import Image from 'next/image'
import { AuthButton } from '@/components/auth/AuthButton'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/hooks/use-auth'
import { Authenticated, Unauthenticated } from 'convex/react'

export function Header() {
  const { signOut } = useAuth()

  return (
    <motion.header 
      className="w-full py-4 sticky top-0 z-50"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="container mx-auto px-4 lg:px-8">
        <div className="backdrop-blur-md bg-white/60 dark:bg-gray-900/60 shadow-sm rounded-full py-2 px-6 flex justify-between items-center">
          <motion.div
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <Link href="/" className="flex items-center gap-2">
              <Image alt="logo" src="/florence_logo.png" width={140} height={110} className="dark:invert" />
            </Link>
          </motion.div>
          
          <nav className="flex items-center gap-3">
            <Authenticated>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button 
                  onClick={() => signOut()} 
                  variant="outline" 
                  className="rounded-full px-6 font-medium"
                >
                  Logout
                </Button>
              </motion.div>
            </Authenticated>
            
            <Unauthenticated>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <AuthButton trigger={
                  <Button variant="outline" className="rounded-full px-6 font-medium">
                    Login
                  </Button>
                } />
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <AuthButton trigger={
                  <Button className="rounded-full px-6 font-medium" size="lg">
                    Get Started
                  </Button>
                } />
              </motion.div>
            </Unauthenticated>
          </nav>
        </div>
      </div>
    </motion.header>
  )
}