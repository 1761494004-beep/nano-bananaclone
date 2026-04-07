import type { Metadata } from "next"
import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { PricingClient } from "@/components/pricing/pricing-client"
import { getCreemPricingProducts } from "@/lib/creem/products"
import { BASIC_MONTHLY_PRICE_USD, CREDITS_PER_GENERATION, CREDITS_PER_MONTH } from "@/lib/credits"
import { createClient } from "@/lib/supabase/server"
import { SUPPORT_EMAIL, SUPPORT_MAILTO } from "@/lib/support"

export const metadata: Metadata = {
  title: "Pricing - cartoonphoto",
  description: `Basic Monthly: $${BASIC_MONTHLY_PRICE_USD}/month, ${CREDITS_PER_MONTH} credits; ${CREDITS_PER_GENERATION} credits per generation.`,
}

export default async function PricingPage() {
  const products = getCreemPricingProducts()
  const creemEnabled = Boolean(process.env.CREEM_API_KEY?.trim())
  const imagesPerMonth = Math.floor(CREDITS_PER_MONTH / CREDITS_PER_GENERATION)

  let customerEmail: string | null = null
  let customerReferenceId: string | null = null
  try {
    const supabase = await createClient()
    const { data } = await supabase.auth.getUser()
    customerEmail = data.user?.email ?? null
    customerReferenceId = data.user?.id ?? null
  } catch {
    // Supabase not configured or user not logged in.
  }

  return (
    <main className="min-h-screen">
      <Header />
      <section className="px-4 pt-28">
        <div className="container mx-auto max-w-5xl">
          <div className="rounded-2xl border bg-card p-6 md:p-8">
            <div className="max-w-3xl space-y-4">
              <p className="text-sm font-medium uppercase tracking-[0.24em] text-muted-foreground">
                Public Pricing Information
              </p>
              <h1 className="text-3xl font-bold tracking-tight md:text-5xl">cartoonphoto pricing and billing summary</h1>
              <p className="text-base leading-7 text-muted-foreground">
                All prices below are shown publicly before checkout. The Basic Monthly plan costs ${BASIC_MONTHLY_PRICE_USD}
                /month and includes {CREDITS_PER_MONTH} credits per billing cycle. Each generation uses{" "}
                {CREDITS_PER_GENERATION} credits, which is about {imagesPerMonth} image generations per month.
              </p>
            </div>

            <div className="mt-8 grid gap-4 md:grid-cols-3">
              <div className="rounded-xl border bg-background p-5">
                <p className="text-sm text-muted-foreground">Plan</p>
                <p className="mt-2 text-2xl font-semibold">Basic Monthly</p>
              </div>
              <div className="rounded-xl border bg-background p-5">
                <p className="text-sm text-muted-foreground">Price</p>
                <p className="mt-2 text-2xl font-semibold">${BASIC_MONTHLY_PRICE_USD}/month</p>
              </div>
              <div className="rounded-xl border bg-background p-5">
                <p className="text-sm text-muted-foreground">Credit package</p>
                <p className="mt-2 text-2xl font-semibold">{CREDITS_PER_MONTH} credits</p>
              </div>
            </div>

            <dl className="mt-6 grid gap-4 text-sm leading-6 text-muted-foreground md:grid-cols-2">
              <div className="rounded-xl border bg-background p-5">
                <dt className="font-medium text-foreground">Credit usage</dt>
                <dd className="mt-2">Each image generation costs {CREDITS_PER_GENERATION} credits.</dd>
              </div>
              <div className="rounded-xl border bg-background p-5">
                <dt className="font-medium text-foreground">Subscription management</dt>
                <dd className="mt-2">
                  Cancel anytime from the link in your receipt or by contacting{" "}
                  <a className="underline underline-offset-4" href={SUPPORT_MAILTO}>
                    {SUPPORT_EMAIL}
                  </a>
                  .
                </dd>
              </div>
              <div className="rounded-xl border bg-background p-5">
                <dt className="font-medium text-foreground">Refund support</dt>
                <dd className="mt-2">
                  Billing issues and refund requests are reviewed manually. Contact support within 7 days of the charge.
                </dd>
              </div>
              <div className="rounded-xl border bg-background p-5">
                <dt className="font-medium text-foreground">Policy links</dt>
                <dd className="mt-2">
                  Review our <Link className="underline underline-offset-4" href="/terms">Terms</Link>,{" "}
                  <Link className="underline underline-offset-4" href="/privacy">Privacy Policy</Link>,{" "}
                  <Link className="underline underline-offset-4" href="/acceptable-use">Acceptable Use Policy</Link>, and{" "}
                  <Link className="underline underline-offset-4" href="/billing">Billing Policy</Link>.
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </section>
      <PricingClient
        products={products}
        customerEmail={customerEmail}
        customerReferenceId={customerReferenceId}
        creemEnabled={creemEnabled}
      />
      <Footer />
    </main>
  )
}
