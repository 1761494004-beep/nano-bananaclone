import { createBrowserClient } from "@supabase/ssr"
import { getSupabaseEnvOrThrow } from "@/lib/supabase/env"

export function createClient() {
  const { url, publishableKey } = getSupabaseEnvOrThrow()
  return createBrowserClient(url, publishableKey)
}

