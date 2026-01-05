import { createServerClient } from "@supabase/ssr"
import { NextResponse, type NextRequest } from "next/server"
import { getSupabaseEnv } from "@/lib/supabase/env"

export async function updateSession(request: NextRequest) {
  const env = getSupabaseEnv()
  if (!env) return NextResponse.next()

  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const supabase = createServerClient(env.url, env.publishableKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll()
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) => {
          request.cookies.set({ name, value, ...options })
          response.cookies.set({ name, value, ...options })
        })
      },
    },
  })

  await supabase.auth.getUser()

  return response
}

