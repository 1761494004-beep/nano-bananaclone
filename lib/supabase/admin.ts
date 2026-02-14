import { createClient } from "@supabase/supabase-js"
import { getSupabaseEnvOrThrow } from "@/lib/supabase/env"

function getProjectRefFromSupabaseUrl(url: string) {
  try {
    const host = new URL(url).host
    // Typical: <project-ref>.supabase.co
    return host.split(".")[0] || null
  } catch {
    return null
  }
}

function tryGetJwtIssuer(jwt: string) {
  // Supabase legacy keys are JWTs (start with "eyJ...").
  // Decode payload to validate it matches the configured project.
  try {
    const parts = jwt.split(".")
    if (parts.length < 2) return null
    const payload = parts[1]
      .replace(/-/g, "+")
      .replace(/_/g, "/")
      .padEnd(Math.ceil(parts[1].length / 4) * 4, "=")
    const json = JSON.parse(Buffer.from(payload, "base64").toString("utf8")) as { iss?: string }
    return typeof json.iss === "string" ? json.iss : null
  } catch {
    return null
  }
}

function getServiceRoleKeyOrThrow() {
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.SUPABASE_SECRET_KEY
  if (!key || !key.trim()) {
    throw new Error(
      "Missing SUPABASE_SERVICE_ROLE_KEY (or SUPABASE_SECRET_KEY). This is required for server-side credit grants/deductions.",
    )
  }

  const trimmed = key.trim()
  if (trimmed.startsWith("eyJ")) {
    const { url } = getSupabaseEnvOrThrow()
    const ref = getProjectRefFromSupabaseUrl(url)
    const iss = tryGetJwtIssuer(trimmed)
    if (ref && iss && !iss.includes(ref)) {
      throw new Error(
        `Invalid SUPABASE_SERVICE_ROLE_KEY: it belongs to a different Supabase project (iss=${iss}). ` +
          `Your NEXT_PUBLIC_SUPABASE_URL points to project "${ref}". ` +
          `Copy the service_role/secret key from Supabase Dashboard → Project Settings → API for the same project, then restart the dev server.`,
      )
    }
  }

  return trimmed
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
