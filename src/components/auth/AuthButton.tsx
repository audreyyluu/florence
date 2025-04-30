/**
 * This component should be used on the header of the landing page to allow the user to sign in or sign up.
 * It will show a modal by default. Set the useModal prop to false to redirect to the auth page instead.
 */

'use client'

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { AuthCard } from "./AuthCard"
import { useAuth } from "@/hooks/use-auth"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Loader2 } from "lucide-react"

interface AuthButtonProps {
  trigger?: React.ReactNode
  dashboardTrigger?: React.ReactNode
  useModal?: boolean
}

const UnauthenticatedButton = ({useModal, trigger}: AuthButtonProps) => {
  const [open, setOpen] = useState(false)
  const [isRedirecting, setIsRedirecting] = useState(false)
  const router = useRouter()

  const handleOpenChange = (newOpen: boolean) => {
    if (isRedirecting && !newOpen) {
      return;
    }
    setOpen(newOpen)
  }

  const handleAuthSuccess = () => {
    setIsRedirecting(true)
  }

  return (
    <div>
      {useModal ? (
          <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogTrigger asChild>
              {trigger || <Button>Get Started</Button>}
            </DialogTrigger>
            <DialogContent className="bg-transparent border-none shadow-none">
              <DialogTitle></DialogTitle>
              <AuthCard onAuthSuccess={handleAuthSuccess} />
            </DialogContent>
          </Dialog>
        ) : (
          trigger ? 
          <div onClick={() => router.push('/auth')}>
            {trigger}
          </div> :
          <Button onClick={() => router.push('/auth')}>
            Get Started
          </Button>
        )}
    </div>
  )
}

export function AuthButton({
  trigger,
  dashboardTrigger,
  useModal = true,
}: AuthButtonProps) {
  const { isAuthenticated, isLoading } = useAuth()

  if (isLoading) {
    return (
      <Button disabled>
        <div className="flex items-center gap-2">
          <Loader2 className="h-4 w-4 animate-spin" />
          Loading...
        </div>
      </Button>
    )
  }

  return (
    <div>
      {isAuthenticated ? (
        dashboardTrigger ? 
          <div onClick={() => window.location.href = "http://localhost:3000/protected"}>
            {dashboardTrigger}
          </div> :
          <Button>
            <Link href="http://localhost:3000/protected">Dashboard</Link>
          </Button>
      ) : (
        <UnauthenticatedButton useModal={useModal} trigger={trigger}/>
      )}
    </div>
  )
}
