import { Webhook } from "@creem_io/nextjs"
import { createAdminClient } from "@/lib/supabase/admin"
import { CREDITS_PER_MONTH } from "@/lib/credits"

export const runtime = "nodejs"

async function grantMonthlyCredits(referenceId: string, context: Record<string, unknown>) {
  try {
    const supabase = createAdminClient()
    const { error } = await supabase
      .from("user_credits")
      .upsert(
        {
          user_id: referenceId,
          credits: CREDITS_PER_MONTH,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "user_id" },
      )

    if (error) {
      console.error("[creem] failed to grant credits", { ...context, referenceId, error })
    }
  } catch (err) {
    console.error("[creem] failed to grant credits (exception)", {
      ...context,
      referenceId,
      error: err instanceof Error ? err.message : String(err),
    })
  }
}

export const POST = Webhook({
  webhookSecret: process.env.CREEM_WEBHOOK_SECRET!,

  onCheckoutCompleted: async ({ customer, product, subscription, metadata }) => {
    console.log("[creem] checkout.completed", {
      email: customer?.email,
      productId: product.id,
      productName: product.name,
      subscriptionId: subscription?.id,
      metadata,
    })

    const basicMonthlyProductId = process.env.CREEM_PRODUCT_ID_BASIC_MONTHLY?.trim()
    if (!basicMonthlyProductId || product.id !== basicMonthlyProductId) return

    const referenceId =
      (typeof metadata?.referenceId === "string" && metadata.referenceId.trim()) ||
      (typeof metadata?.userId === "string" && metadata.userId.trim()) ||
      null

    if (!referenceId) return

    // Idempotent: this sets credits to the monthly allowance.
    await grantMonthlyCredits(referenceId, {
      webhookEventType: "checkout.completed",
      email: customer?.email,
      productId: product.id,
      subscriptionId: subscription?.id,
    })
  },

  onGrantAccess: async ({ reason, customer, metadata, product, id }) => {
    console.log("[creem] grant_access", {
      reason,
      email: customer.email,
      productId: product.id,
      subscriptionId: id,
      metadata,
    })

    // Only grant credits for the Basic monthly subscription.
    const basicMonthlyProductId = process.env.CREEM_PRODUCT_ID_BASIC_MONTHLY?.trim()
    if (!basicMonthlyProductId || product.id !== basicMonthlyProductId) return

    // Creem recommends passing your internal user ID as `referenceId`.
    // The library surfaces it on `metadata.referenceId`.
    const referenceId =
      (typeof metadata?.referenceId === "string" && metadata.referenceId.trim()) ||
      (typeof metadata?.userId === "string" && metadata.userId.trim()) ||
      null

    if (!referenceId) {
      console.warn("[creem] grant_access missing referenceId; cannot grant credits", {
        email: customer.email,
        productId: product.id,
        subscriptionId: id,
        metadata,
      })
      return
    }

    // Grant/refill credits when payment is confirmed. Keep operation idempotent.
    if (reason !== "subscription_paid") return

    await grantMonthlyCredits(referenceId, {
      webhookEventType: "grant_access",
      reason,
      email: customer.email,
      productId: product.id,
      subscriptionId: id,
    })
  },

  onRevokeAccess: async ({ reason, customer, metadata, product, id }) => {
    console.log("[creem] revoke_access", {
      reason,
      email: customer.email,
      productId: product.id,
      subscriptionId: id,
      metadata,
    })
  },
})
