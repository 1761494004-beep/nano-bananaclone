import type { Metadata } from "next"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { SUPPORT_EMAIL, SUPPORT_MAILTO } from "@/lib/support"

export const metadata: Metadata = {
  title: "Contact - Nano Banana",
  description: "How to contact Nano Banana support.",
}

export default function ContactPage() {
  return (
    <main className="min-h-screen">
      <Header />

      <div className="container mx-auto max-w-3xl px-4 pt-28 pb-16">
        <h1 className="text-3xl font-bold tracking-tight">Contact</h1>
        <p className="mt-2 text-sm text-muted-foreground">Last updated: February 28, 2026</p>

        <section className="mt-10 space-y-6 text-sm leading-6 text-foreground">
          <p>
            For support, billing questions, or policy requests, email us at{" "}
            <a className="underline" href={SUPPORT_MAILTO}>
              {SUPPORT_EMAIL}
            </a>
            .
          </p>

          <div className="space-y-2">
            <h2 className="text-base font-semibold">What to include</h2>
            <ul className="list-disc pl-6 space-y-1">
              <li>A short description of the issue or request.</li>
              <li>If relevant: screenshots, the affected page URL, and your browser/device details.</li>
              <li>If billing-related: the email used for purchase and any receipt/order identifiers.</li>
            </ul>
          </div>
        </section>
      </div>

      <Footer />
    </main>
  )
}

