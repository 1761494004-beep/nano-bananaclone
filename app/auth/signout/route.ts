import { revalidatePath } from "next/cache"
import { NextResponse, type NextRequest } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { getSafeNextPath } from "@/lib/supabase/redirect"

async function handleSignOut(request: NextRequest) {
  const supabase = await createClient()
  await supabase.auth.signOut()
  revalidatePath("/", "layout")

  const next = getSafeNextPath(request.nextUrl.searchParams.get("next"))
  return NextResponse.redirect(new URL(next, request.url))
}

export async function POST(request: NextRequest) {
  return handleSignOut(request)
}

export async function GET(request: NextRequest) {
  return handleSignOut(request)
}

