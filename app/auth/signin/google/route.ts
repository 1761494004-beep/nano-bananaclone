import { NextResponse, type NextRequest } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { getSafeNextPath } from "@/lib/supabase/redirect"

export async function GET(request: NextRequest) {
  const next = getSafeNextPath(request.nextUrl.searchParams.get("next"))
  const origin = request.nextUrl.origin

  const supabase = await createClient()
  const callbackUrl = new URL("/auth/callback", origin)
  callbackUrl.searchParams.set("next", next)

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: callbackUrl.toString(),
    },
  })

  if (error) {
    const errorUrl = new URL("/", request.url)
    errorUrl.searchParams.set("authError", error.message)
    return NextResponse.redirect(errorUrl)
  }

  return NextResponse.redirect(data.url)
}

