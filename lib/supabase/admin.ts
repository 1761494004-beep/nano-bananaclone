import { createClient } from "@supabase/supabase-js"
import { getSupabaseEnvOrThrow } from "@/lib/supabase/env"

function getServiceRoleKeyOrThrow() {
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!key || !key.trim()) {
    throw new Error("Missing SUPABASE_SERVICE_ROLE_KEY (required for server-side credit grants)")
  }
  return key.trim()
}

export function createAdminClient() {
  const { url } = getSupabaseEnvOrThrow()
  const serviceRoleKey = getServiceRoleKeyOrThrow()

  return createClient(url, serviceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  })
}

