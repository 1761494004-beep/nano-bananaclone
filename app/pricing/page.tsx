import type { Metadata } from "next"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { PricingClient } from "@/components/pricing/pricing-client"
import { getCreemPricingProducts } from "@/lib/creem/products"
import { createClient } from "@/lib/supabase/server"

export const metadata: Metadata = {
  title: "Pricing - Nano Banana",
  description: "Choose a plan that fits your needs. Cancel anytime.",
}

export default async function PricingPage() {
  const products = getCreemPricingProducts()
  const creemEnabled = Boolean(process.env.CREEM_API_KEY?.trim())

  let customerEmail: string | null = null
  try {
    const supabase = await createClient()
    const { data } = await supabase.auth.getUser()
    customerEmail = data.user?.email ?? null
  } catch {
    // Supabase not configured or user not logged in.
  }

  return (
    <main className="min-h-screen">
      <Header />
      <PricingClient products={products} customerEmail={customerEmail} creemEnabled={creemEnabled} />
      <Footer />
    </main>
  )
}
