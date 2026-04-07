import type { Metadata } from "next"
import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { BASIC_MONTHLY_PRICE_USD, CREDITS_PER_GENERATION, CREDITS_PER_MONTH } from "@/lib/credits"
import { SUPPORT_EMAIL, SUPPORT_MAILTO } from "@/lib/support"

export const metadata: Metadata = {
  title: "Billing Policy - cartoonphoto",
  description: "Billing, subscription, cancellation, and refund information for cartoonphoto.",
}

export default function BillingPage() {
  return (
    <main className="min-h-screen">
      <Header />

      <div className="container mx-auto max-w-3xl px-4 pt-28 pb-16">
        <h1 className="text-3xl font-bold tracking-tight">Billing Policy</h1>
        <p className="mt-2 text-sm text-muted-foreground">Last updated: April 7, 2026</p>

        <section className="mt-10 space-y-6 text-sm leading-6 text-foreground">
          <p>
            This page explains how subscriptions, credits, cancellation, and billing support work for cartoonphoto.
            Public pricing is available on the <Link className="underline" href="/pricing">Pricing page</Link> before
            checkout.
          </p>

          <div className="space-y-2">
            <h2 className="text-base font-semibold">Current plan</h2>
            <ul className="list-disc pl-6 space-y-1">
              <li>Basic Monthly: ${BASIC_MONTHLY_PRICE_USD}/month.</li>
              <li>Includes {CREDITS_PER_MONTH} credits per billing cycle.</li>
              <li>Each image generation uses {CREDITS_PER_GENERATION} credits.</li>
            </ul>
          </div>

          <div className="space-y-2">
            <h2 className="text-base font-semibold">Subscriptions and renewal</h2>
            <p>
              Paid plans renew automatically each billing cycle until canceled. Before completing checkout, customers can
              review the price, plan name, and billing interval.
            </p>
          </div>

          <div className="space-y-2">
            <h2 className="text-base font-semibold">How to cancel</h2>
            <ul className="list-disc pl-6 space-y-1">
              <li>Use the subscription management link provided in your receipt or billing email.</li>
              <li>
                If you cannot access that link, email{" "}
                <a className="underline" href={SUPPORT_MAILTO}>
                  {SUPPORT_EMAIL}
                </a>{" "}
                from the purchase email address and we will help you cancel.
              </li>
              <li>Cancellation stops future renewals. Access and credits already granted for the current cycle remain available until the end of that billing period unless we state otherwise.</li>
            </ul>
          </div>

          <div className="space-y-2">
            <h2 className="text-base font-semibold">Refunds and billing disputes</h2>
            <p>
              If you believe you were charged incorrectly, contact support within 7 days of the charge and include your
              purchase email plus any receipt or invoice details. We review refund requests case by case in accordance
              with applicable law and payment-provider requirements.
            </p>
          </div>

          <div className="space-y-2">
            <h2 className="text-base font-semibold">Support contact</h2>
            <p>
              Billing help, cancellation requests, and refund questions:{" "}
              <a className="underline" href={SUPPORT_MAILTO}>
                {SUPPORT_EMAIL}
              </a>
              .
            </p>
          </div>

          <div className="space-y-2">
            <h2 className="text-base font-semibold">Related policies</h2>
            <p>
              See our <Link className="underline" href="/terms">Terms of Service</Link>,{" "}
              <Link className="underline" href="/privacy">Privacy Policy</Link>, and{" "}
              <Link className="underline" href="/acceptable-use">Acceptable Use Policy</Link>.
            </p>
          </div>
        </section>
      </div>

      <Footer />
    </main>
  )
}
