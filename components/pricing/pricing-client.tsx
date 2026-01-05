'use client'

import { useMemo, useState } from "react"
import { Check, Info, Shield, Sparkles } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Button, buttonVariants } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { CreemPricingProducts, CreemPricingTierKey } from "@/lib/creem/products"
import { PricingFaq } from "@/components/pricing/pricing-faq"
import { cn } from "@/lib/utils"

type BillingInterval = "monthly" | "yearly"

type Props = {
  products: CreemPricingProducts
  customerEmail: string | null
  creemEnabled: boolean
}

type Plan = {
  key: CreemPricingTierKey
  name: string
  description: string
  popular?: boolean
  monthlyUsd: number
  yearlyUsd: number
  originalYearlyUsd?: number
  creditsPerYear: number
  imagesPerMonth: number
  features: string[]
  footnote?: string
}

const PLANS: Plan[] = [
  {
    key: "basic",
    name: "Basic",
    description: "For casual users and hobbyists",
    monthlyUsd: 12,
    yearlyUsd: 144,
    originalYearlyUsd: 180,
    creditsPerYear: 2400,
    imagesPerMonth: 100,
    features: [
      "100 high-quality images/month",
      "All style templates included",
      "Fast generation speed",
      "Standard support",
      "Download: PNG, JPG",
      "Commercial license",
    ],
  },
  {
    key: "pro",
    name: "Pro",
    description: "For professionals and creators",
    popular: true,
    monthlyUsd: 19.5,
    yearlyUsd: 234,
    originalYearlyUsd: 468,
    creditsPerYear: 9600,
    imagesPerMonth: 400,
    features: [
      "400 high-quality images/month",
      "Advanced model access",
      "Priority support",
      "All style templates included",
      "More control settings",
      "Access to new features",
      "Download: PNG, JPG, SVG, PDF",
      "Commercial license",
    ],
  },
  {
    key: "max",
    name: "Max",
    description: "For teams and power users",
    monthlyUsd: 80,
    yearlyUsd: 960,
    originalYearlyUsd: 1920,
    creditsPerYear: 43200,
    imagesPerMonth: 1800,
    features: [
      "1800 high-quality images/month",
      "Advanced model access",
      "Dedicated support",
      "All style templates included",
      "Highest speed & limits",
      "Access to new features",
      "Download: PNG, JPG, SVG, PDF",
      "Commercial license",
    ],
  },
]

function formatUsd(amount: number) {
  const hasCents = Math.round(amount * 100) % 100 !== 0
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: hasCents ? 2 : 0,
    maximumFractionDigits: hasCents ? 2 : 0,
  }).format(amount)
}

export function PricingClient({ products, customerEmail, creemEnabled }: Props) {
  const [interval, setInterval] = useState<BillingInterval>("monthly")
  const [currency, setCurrency] = useState("USD")
  const [unitsByPlan, setUnitsByPlan] = useState<Record<CreemPricingTierKey, number>>({
    basic: 1,
    pro: 1,
    max: 1,
  })

  const missingCreemConfig = useMemo(() => {
    if (!creemEnabled) return true
    return (
      !products.basic.monthly ||
      !products.basic.yearly ||
      !products.pro.monthly ||
      !products.pro.yearly ||
      !products.max.monthly ||
      !products.max.yearly
    )
  }, [creemEnabled, products])

  return (
    <section className="pt-32 pb-20 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-10">
          <Badge className="mb-4 bg-primary/10 text-primary border-primary/20 hover:bg-primary/20">
            Limited Time: Save with Annual Billing
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold mb-4 text-balance">Choose Your Perfect Plan</h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto text-pretty">
            Select the best plan for your AI image generation needs.
          </p>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-center gap-4 mb-10">
          <Tabs value={interval} onValueChange={(v) => setInterval(v as BillingInterval)} className="items-center">
            <TabsList className="w-full md:w-auto">
              <TabsTrigger value="monthly" className="min-w-[120px]">
                Monthly
              </TabsTrigger>
              <TabsTrigger value="yearly" className="min-w-[160px]">
                Yearly <span className="ml-1 text-xs text-primary">(Limited-time deals)</span>
              </TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>Currency</span>
            <Select value={currency} onValueChange={setCurrency}>
              <SelectTrigger size="sm" className="min-w-[92px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="USD">USD</SelectItem>
                <SelectItem value="CNY" disabled>Chinese Yuan (CNY)</SelectItem>
                <SelectItem value="EUR" disabled>Euro (EUR)</SelectItem>
                <SelectItem value="JPY" disabled>Japanese Yen (JPY)</SelectItem>
                <SelectItem value="GBP" disabled>Pound Sterling (GBP)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {missingCreemConfig ? (
          <Alert className="mb-10">
            <Info />
            <AlertTitle>Payments not configured</AlertTitle>
            <AlertDescription>
              <p>
                Set Creem env vars (product IDs + API key) to enable checkout buttons. See <code>.env.example</code>.
              </p>
            </AlertDescription>
          </Alert>
        ) : null}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {PLANS.map((plan) => (
            // Creem expects a productId to be passed via /checkout query params.
            // We keep product IDs on the server (env vars) and pass them into this client component.
            <Card
              key={plan.key}
              className={[
                "relative overflow-hidden",
                plan.popular ? "border-primary shadow-[0_0_0_1px_hsl(var(--primary))]" : "",
              ].join(" ")}
            >
              {plan.popular ? (
                <div className="absolute top-4 right-4">
                  <Badge className="bg-primary text-primary-foreground">Most Popular</Badge>
                </div>
              ) : null}

              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-2xl font-bold">{plan.name}</h3>
                  <span className="text-sm text-muted-foreground">{currency}</span>
                </div>
                <p className="text-sm text-muted-foreground">{plan.description}</p>

                <div className="mt-4">
                  {interval === "monthly" ? (
                    <div className="flex items-end gap-2">
                      <span className="text-4xl font-bold">{formatUsd(plan.monthlyUsd)}</span>
                      <span className="text-muted-foreground mb-1">/month</span>
                    </div>
                  ) : (
                    <div className="flex items-end gap-2">
                      <span className="text-4xl font-bold">{formatUsd(plan.yearlyUsd)}</span>
                      <span className="text-muted-foreground mb-1">/year</span>
                      {plan.originalYearlyUsd ? (
                        <span className="text-sm text-muted-foreground line-through mb-2 ml-2">
                          {formatUsd(plan.originalYearlyUsd)}
                        </span>
                      ) : null}
                    </div>
                  )}
                </div>
              </CardHeader>

              <CardContent className="pt-0">
                <div className="rounded-lg border bg-muted/20 p-4 mb-5">
                  <div className="text-sm text-muted-foreground">Credits</div>
                  <div className="text-lg font-semibold">
                    {plan.creditsPerYear.toLocaleString("en-US")} / year
                  </div>
                  <div className="text-sm text-muted-foreground mt-1">
                    ~ {plan.imagesPerMonth.toLocaleString("en-US")} high-quality images/month
                  </div>
                </div>

                {plan.key !== "basic" ? (
                  <div className="flex items-center justify-between gap-3 rounded-lg border bg-background p-3 mb-5">
                    <div className="text-sm">
                      <div className="font-medium">Quantity</div>
                      <div className="text-xs text-muted-foreground">Purchase multiple units (optional)</div>
                    </div>
                    <Select
                      value={String(unitsByPlan[plan.key])}
                      onValueChange={(value) =>
                        setUnitsByPlan((prev) => ({ ...prev, [plan.key]: Number(value) || 1 }))
                      }
                    >
                      <SelectTrigger size="sm" className="min-w-[84px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Array.from({ length: 10 }).map((_, i) => {
                          const units = i + 1
                          return (
                            <SelectItem key={units} value={String(units)}>
                              {units}x
                            </SelectItem>
                          )
                        })}
                      </SelectContent>
                    </Select>
                  </div>
                ) : null}

                <ul className="space-y-3 text-sm">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2">
                      <Check className="h-4 w-4 mt-0.5 text-primary" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>

              <CardFooter className="flex flex-col gap-3">
                {(() => {
                  const productId = products[plan.key][interval]
                  const units = unitsByPlan[plan.key] || 1

                  if (missingCreemConfig || !productId) {
                    return (
                      <Button
                        className="w-full"
                        variant={plan.popular ? "default" : "outline"}
                        disabled
                        title="Set CREEM_API_KEY + CREEM_PRODUCT_ID_* env vars to enable checkout."
                      >
                        Get {plan.name}
                      </Button>
                    )
                  }

                  const hrefParams = new URLSearchParams()
                  hrefParams.set("productId", productId)
                  if (units > 1) hrefParams.set("units", String(units))
                  if (customerEmail) hrefParams.set("customer", JSON.stringify({ email: customerEmail }))
                  hrefParams.set("successUrl", "/success")
                  hrefParams.set(
                    "metadata",
                    JSON.stringify({
                      source: "pricing",
                      tier: plan.key,
                      interval,
                      units,
                    }),
                  )

                  return (
                    <a
                      href={`/checkout?${hrefParams.toString()}`}
                      className={cn(
                        buttonVariants({
                          variant: plan.popular ? "default" : "outline",
                          className: "w-full",
                        }),
                        plan.popular ? "bg-primary text-primary-foreground hover:bg-primary/90" : "",
                      )}
                    >
                      Get {plan.name}
                    </a>
                  )
                })()}

                <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
                  <Shield className="h-3.5 w-3.5" />
                  Secure checkout by Creem
                </div>

                {customerEmail ? (
                  <div className="text-center text-xs text-muted-foreground">
                    Using account: <span className="font-medium text-foreground">{customerEmail}</span>
                  </div>
                ) : (
                  <div className="text-center text-xs text-muted-foreground">
                    <Sparkles className="inline h-3.5 w-3.5 mr-1" />
                    Sign in to auto-fill email (optional)
                  </div>
                )}
              </CardFooter>
            </Card>
          ))}
        </div>

        <div className="mt-12">
          <PricingFaq />
        </div>
      </div>
    </section>
  )
}
