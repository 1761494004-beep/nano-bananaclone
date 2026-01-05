'use client'

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/client"
import { isSupabaseConfigured } from "@/lib/supabase/env"

export function Header() {
  const supabaseConfigured = isSupabaseConfigured()
  const [userEmail, setUserEmail] = useState<string | null>(null)

  useEffect(() => {
    if (!supabaseConfigured) return

    let unsubscribe: (() => void) | undefined

    async function syncUser() {
      try {
        const supabase = createClient()

        const { data } = await supabase.auth.getUser()
        setUserEmail(data.user?.email ?? null)

        const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
          setUserEmail(session?.user?.email ?? null)
        })

        unsubscribe = () => authListener.subscription.unsubscribe()
      } catch {
        setUserEmail(null)
      }
    }

    void syncUser()

    return () => {
      unsubscribe?.()
    }
  }, [supabaseConfigured])

  return (
    <header className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <a href="/" className="flex items-center gap-2">
          <div className="text-2xl">🍌</div>
          <span className="font-bold text-xl text-foreground">Nano Banana</span>
        </a>
        <nav className="hidden md:flex items-center gap-8">
          <a
            href="/#editor"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Editor
          </a>
          <a
            href="/#features"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Features
          </a>
          <a
            href="/#showcase"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Showcase
          </a>
          <a href="/#faq" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            FAQ
          </a>
          <a
            href="/pricing"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Pricing
          </a>
        </nav>
        <div className="flex items-center gap-3">
          <Button asChild className="bg-primary text-primary-foreground hover:bg-primary/90">
            <a href="/#editor">Start Editing</a>
          </Button>

          {supabaseConfigured ? (
            userEmail ? (
              <>
                <span className="hidden sm:inline text-sm text-muted-foreground max-w-[220px] truncate">
                  {userEmail}
                </span>
                <form action="/auth/signout" method="post">
                  <Button type="submit" variant="outline">
                    Sign out
                  </Button>
                </form>
              </>
            ) : (
              <Button asChild variant="outline">
                <a href="/auth/signin/google?next=/">Sign in with Google</a>
              </Button>
            )
          ) : (
            <Button
              variant="outline"
              disabled
              title="Set NEXT_PUBLIC_SUPABASE_URL + NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY (or NEXT_PUBLIC_SUPABASE_ANON_KEY) in .env.local, then restart dev server"
            >
              Sign in with Google
            </Button>
          )}
        </div>
      </div>
    </header>
  )
}
