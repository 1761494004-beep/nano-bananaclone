import { Header } from "@/components/header"
import { Hero } from "@/components/hero"
import { EditorSection } from "@/components/editor-section"
import { Features } from "@/components/features"
import { Showcase } from "@/components/showcase"
import { FAQ } from "@/components/faq"
import { Footer } from "@/components/footer"
import Link from "next/link"
import { BASIC_MONTHLY_PRICE_USD, CREDITS_PER_GENERATION, CREDITS_PER_MONTH } from "@/lib/credits"

export default function Home() {
  return (
    <main className="min-h-screen">
      <Header />
      <Hero />
      <section className="px-4 pb-4">
        <div className="container mx-auto max-w-5xl">
          <div className="rounded-2xl border bg-card px-6 py-5 text-sm leading-6 text-muted-foreground">
            <p className="font-medium text-foreground">Public pricing summary</p>
            <p className="mt-2">
              Basic Monthly is ${BASIC_MONTHLY_PRICE_USD}/month and includes {CREDITS_PER_MONTH} credits. Each image
              generation uses {CREDITS_PER_GENERATION} credits. Full billing details are available on the{" "}
              <Link className="underline underline-offset-4" href="/pricing">
                pricing page
              </Link>{" "}
              and <Link className="underline underline-offset-4" href="/billing">billing policy</Link>.
            </p>
          </div>
        </div>
      </section>
      <EditorSection />
      <Features />
      <Showcase />
      <FAQ />
      <Footer />
    </main>
  )
}
