type SupabaseEnv = {
  url: string
  publishableKey: string
}

export function getSupabaseEnv(): SupabaseEnv | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const publishableKey =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_OR_ANON_KEY

  if (!url || !publishableKey) return null

  return { url, publishableKey }
}

export function isSupabaseConfigured() {
  return Boolean(getSupabaseEnv())
}

export function getSupabaseEnvOrThrow(): SupabaseEnv {
  const env = getSupabaseEnv()
  if (!env) {
    throw new Error(
      "Missing Supabase env vars: NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY (or NEXT_PUBLIC_SUPABASE_ANON_KEY)",
    )
  }
  return env
}

