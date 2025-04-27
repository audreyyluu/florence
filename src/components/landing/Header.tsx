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
      className="w-full py-4"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="flex items-center gap-2">
          <Image alt="logo" src="/florence_logo.png" width={140} height={110}></Image>
        </Link>
        <nav className="flex items-center gap-4">
          <AuthButton trigger={<Button size="lg">Dashboard</Button>} />
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