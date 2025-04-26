'use client'

import Link from 'next/link'
import { AuthButton } from '@/components/auth/AuthButton'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/hooks/use-auth'
import { Authenticated, Unauthenticated } from 'convex/react'

export function Header() {
  const { signOut } = useAuth()

  return (
    <motion.header 
      className="w-full py-4"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-xl">CC</span>
          </div>
          <span className="text-2xl font-bold">CareCam</span>
        </Link>
        <nav className="flex items-center gap-4">
          <Unauthenticated>
            <AuthButton trigger={<Button variant="outline">Sign Up</Button>} />
            <AuthButton trigger={<Button>Login</Button>} />
          </Unauthenticated>
          <Authenticated>
            <Button onClick={() => signOut()}>Logout</Button>
          </Authenticated>
        </nav>
      </div>
    </motion.header>
  )
}