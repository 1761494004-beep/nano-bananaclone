import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { createAdminClient } from "@/lib/supabase/admin"
import { DAILY_FREE_CREDITS } from "@/lib/credits"

export const runtime = "nodejs"

export async function GET() {
  try {
    const supabase = await createClient()
    const { data } = await supabase.auth.getUser()
    const userId = data.user?.id

    if (!userId) {
      return NextResponse.json({ error: "Not signed in" }, { status: 401 })
    }

    const supabaseAdmin = createAdminClient()
    const today = new Date().toISOString().slice(0, 10) // UTC date, e.g. "2026-02-14"

    const { data: row, error } = await supabaseAdmin
      .from("user_credits")
      .select("credits, free_credits_remaining, free_credits_date")
      .eq("user_id", userId)
      .maybeSingle()

    if (error) {
      // Common misconfig: table not created yet, or PostgREST schema cache hasn't refreshed.
      if (error.message.includes("schema cache") || error.message.includes("user_credits")) {
        return NextResponse.json(
          {
            error:
              "Credits table is not set up in Supabase. Run `supabase/credits.sql` in Supabase SQL Editor, then reload the API schema cache and retry.",
          },
          { status: 500 },
        )
      }

      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    const paid = row?.credits ?? 0
    let freeRemaining = row?.free_credits_remaining ?? DAILY_FREE_CREDITS
    const freeDate = row?.free_credits_date ?? today

    // Ensure user gets a fresh daily quota (UTC day) and a row exists.
    if (!row || freeDate !== today) {
      freeRemaining = DAILY_FREE_CREDITS
      const { error: upsertErr } = await supabaseAdmin
        .from("user_credits")
        .upsert(
          {
            user_id: userId,
            free_credits_remaining: freeRemaining,
            free_credits_date: today,
            updated_at: new Date().toISOString(),
          },
          { onConflict: "user_id" },
        )

      if (upsertErr) {
        return NextResponse.json({ error: upsertErr.message }, { status: 500 })
      }
    }

    return NextResponse.json({ credits: paid + freeRemaining })
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
