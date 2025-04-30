import { createClient } from '@/lib/supabase/client'
import { useEffect, useState } from 'react'
import { type User } from '@supabase/supabase-js'

export function useAuth() {
  const [isLoading, setIsLoading] = useState(true)
  const [user, setUser] = useState<User | null>(null)
  const supabase = createClient()

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null)
      setIsLoading(false)
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [supabase])

  const signIn = async (provider: string, options: any) => {
    if (provider === 'google') {
      return await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`
        }
      })
    } else if (provider === 'email-otp') {
      const { email, code } = options
      if (code) {
        return await supabase.auth.verifyOtp({
          email,
          token: code,
          type: 'email'
        })
      } else {
        return await supabase.auth.signInWithOtp({
          email,
          options: {
            emailRedirectTo: `${window.location.origin}/auth/callback`
          }
        })
      }
    }
    throw new Error(`Unsupported provider: ${provider}`)
  }

  const signOut = async () => {
    await supabase.auth.signOut()
  }

  return {
    isLoading,
    user,
    isAuthenticated: !!user,
    signIn,
    signOut,
  }
}
