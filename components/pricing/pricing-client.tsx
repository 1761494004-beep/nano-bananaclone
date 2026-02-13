'use client'

import { useMemo } from "react"
import { Check, Info, Shield, Sparkles } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Button, buttonVariants } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import type { CreemPricingProducts } from "@/lib/creem/products"
import { PricingFaq } from "@/components/pricing/pricing-faq"
import { cn } from "@/lib/utils"
import { BASIC_MONTHLY_PRICE_USD, CREDITS_PER_GENERATION, CREDITS_PER_MONTH } from "@/lib/credits"

type Props = {
  products: CreemPricingProducts
  customerEmail: string | null
  customerReferenceId: string | null
  creemEnabled: boolean
}

const PLAN = {
  key: "basic" as const,
  name: "Basic Monthly",
  description: "Monthly subscription (basic tier)",
  monthlyUsd: BASIC_MONTHLY_PRICE_USD,
  creditsPerMonth: CREDITS_PER_MONTH,
  creditsPerGeneration: CREDITS_PER_GENERATION,
  features: [
    `${CREDITS_PER_MONTH} credits / month`,
    `${CREDITS_PER_GENERATION} credits / generation`,
    "Cancel anytime",
    "Fast generation",
    "Downloads: PNG, JPG",
    "Commercial license included",
  ],
}

function formatUsdText(amount: number) {
  const text = amount.toFixed(2).replace(/\.00$/, "").replace(/0$/, "")
  return `$${text}`
}

export function PricingClient({ products, customerEmail, customerReferenceId, creemEnabled }: Props) {
  const missingCreemConfig = useMemo(() => {
    if (!creemEnabled) return true
    return !products.basic.monthly
  }, [creemEnabled, products.basic.monthly])

  const imagesPerMonth = Math.floor(PLAN.creditsPerMonth / PLAN.creditsPerGeneration)

  return (
    <section className="pt-32 pb-20 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-10">
          <Badge className="mb-4 bg-primary/10 text-primary border-primary/20 hover:bg-primary/20">Basic Monthly</Badge>
          <h1 className="text-4xl md:text-6xl font-bold mb-4 text-balance">Upgrade to Basic Monthly</h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto text-pretty">
            {formatUsdText(PLAN.monthlyUsd)}/month. You will receive {PLAN.creditsPerMonth} credits. Each generation costs{" "}
            {PLAN.creditsPerGeneration} credits.
          </p>
        </div>

        {missingCreemConfig ? (
          <Alert className="mb-10">
            <Info />
            <AlertTitle>Payments not configured</AlertTitle>
            <AlertDescription>
              <p>
                Set the Creem env vars (CREEM_API_KEY, CREEM_WEBHOOK_SECRET, CREEM_PRODUCT_ID_BASIC_MONTHLY). See{" "}
                <code>.env.example</code>.
              </p>
            </AlertDescription>
          </Alert>
        ) : null}

        <div className="grid grid-cols-1 gap-6 max-w-lg mx-auto">
          {/* Creem expects a productId to be passed via /checkout query params.
              We keep product IDs on the server (env vars) and pass them into this client component. */}
          <Card key={PLAN.key} className="relative overflow-hidden">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-bold">{PLAN.name}</h3>
                <span className="text-sm text-muted-foreground">USD</span>
              </div>
              <p className="text-sm text-muted-foreground">{PLAN.description}</p>

              <div className="mt-4">
                <div className="flex items-end gap-2">
                  <span className="text-4xl font-bold">{formatUsdText(PLAN.monthlyUsd)}</span>
                  <span className="text-muted-foreground mb-1">/month</span>
                </div>
              </div>
            </CardHeader>

            <CardContent className="pt-0">
              <div className="rounded-lg border bg-muted/20 p-4 mb-5">
                <div className="text-sm text-muted-foreground">Credits</div>
                <div className="text-lg font-semibold">{PLAN.creditsPerMonth.toLocaleString("en-US")} / month</div>
                <div className="text-sm text-muted-foreground mt-1">
                  About {imagesPerMonth.toLocaleString("en-US")} images/month ({PLAN.creditsPerGeneration} credits per
                  generation)
                </div>
              </div>

              <ul className="space-y-3 text-sm">
                {PLAN.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2">
                    <Check className="h-4 w-4 mt-0.5 text-primary" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>

            <CardFooter className="flex flex-col gap-3">
              {(() => {
                const productId = products.basic.monthly

                if (missingCreemConfig || !productId) {
                  return (
                    <Button
                      className="w-full"
                      variant="outline"
                      disabled
                      title="Set CREEM_API_KEY + CREEM_PRODUCT_ID_BASIC_MONTHLY to enable payments."
                    >
                      Subscribe
                    </Button>
                  )
                }

                if (!customerReferenceId) {
                  return (
                    <a
                      href="/auth/signin/google?next=/pricing"
                      className={cn(
                        buttonVariants({
                          variant: "default",
                          className: "w-full",
                        }),
                        "bg-primary text-primary-foreground hover:bg-primary/90",
                      )}
                    >
                      Sign in to subscribe (credits will be added)
                    </a>
                  )
                }

                const hrefParams = new URLSearchParams()
                hrefParams.set("productId", productId)
                if (customerEmail) hrefParams.set("customer", JSON.stringify({ email: customerEmail }))
                if (customerReferenceId) hrefParams.set("referenceId", customerReferenceId)
                hrefParams.set("successUrl", "/success")
                hrefParams.set(
                  "metadata",
                  JSON.stringify({
                    source: "pricing",
                    tier: PLAN.key,
                    interval: "monthly",
                    units: 1,
                    referenceId: customerReferenceId,
                  }),
                )

                return (
                  <a
                    href={`/checkout?${hrefParams.toString()}`}
                    className={cn(
                      buttonVariants({
                        variant: "default",
                        className: "w-full",
                      }),
                      "bg-primary text-primary-foreground hover:bg-primary/90",
                    )}
                  >
                    Subscribe
                  </a>
                )
              })()}

              <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
                <Shield className="h-3.5 w-3.5" />
                Secure checkout by Creem
              </div>

              {customerEmail ? (
                <div className="text-center text-xs text-muted-foreground">
                  Signed in as: <span className="font-medium text-foreground">{customerEmail}</span>
                </div>
              ) : (
                <div className="text-center text-xs text-muted-foreground">
                  <Sparkles className="inline h-3.5 w-3.5 mr-1" />
                  Optional: sign in to prefill your email
                </div>
              )}
            </CardFooter>
          </Card>
        </div>

        <div className="mt-12">
          <PricingFaq />
        </div>
      </div>
    </section>
  )
}
