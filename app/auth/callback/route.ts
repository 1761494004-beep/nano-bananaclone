import { NextResponse, type NextRequest } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { getSafeNextPath } from "@/lib/supabase/redirect"

export const dynamic = "force-dynamic"
export const revalidate = 0

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const code = searchParams.get("code")
  const next = getSafeNextPath(searchParams.get("next"))

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (error) {
      const errorUrl = new URL("/", request.url)
      errorUrl.searchParams.set("authError", error.message)
      const res = NextResponse.redirect(errorUrl)
      res.headers.set("Cache-Control", "no-store")
      return res
    }
  }

  const origin = request.nextUrl.origin
  const forwardedHost = request.headers.get("x-forwarded-host")
  const isDev = process.env.NODE_ENV === "development"

  if (isDev || !forwardedHost) {
    const res = NextResponse.redirect(`${origin}${next}`)
    res.headers.set("Cache-Control", "no-store")
    return res
  }

  const res = NextResponse.redirect(`https://${forwardedHost}${next}`)
  res.headers.set("Cache-Control", "no-store")
  return res
}
