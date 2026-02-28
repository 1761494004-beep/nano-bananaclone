import type { Metadata } from "next"
import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { SUPPORT_EMAIL, SUPPORT_MAILTO } from "@/lib/support"

export const metadata: Metadata = {
  title: "Privacy Policy - Nano Banana",
  description: "Privacy Policy for Nano Banana.",
}

export default function PrivacyPage() {
  return (
    <main className="min-h-screen">
      <Header />

      <div className="container mx-auto max-w-3xl px-4 pt-28 pb-16">
        <h1 className="text-3xl font-bold tracking-tight">Privacy Policy</h1>
        <p className="mt-2 text-sm text-muted-foreground">Last updated: February 28, 2026</p>

        <section className="mt-10 space-y-6 text-sm leading-6 text-foreground">
          <p>
            This Privacy Policy explains how Nano Banana (&quot;we&quot;, &quot;us&quot;, or &quot;our&quot;) collects, uses, and shares information
            when you use our website and AI image editor (the &quot;Service&quot;).
          </p>

          <div className="space-y-2">
            <h2 className="text-base font-semibold">Information we collect</h2>
            <p>Depending on how you use the Service, we may collect:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>
                <span className="font-medium">Account information</span> (for example, your email address if you sign in
                via our authentication provider).
              </li>
              <li>
                <span className="font-medium">User content</span> you submit to the Service (such as uploaded images,
                prompts, and generated outputs).
              </li>
              <li>
                <span className="font-medium">Payment and billing details</span> (processed by our payment provider; we
                may receive limited information such as purchase status and a customer identifier).
              </li>
              <li>
                <span className="font-medium">Usage data</span> (such as approximate device/browser information, pages
                viewed, and basic analytics).
              </li>
            </ul>
          </div>

          <div className="space-y-2">
            <h2 className="text-base font-semibold">How we use information</h2>
            <ul className="list-disc pl-6 space-y-1">
              <li>Provide, maintain, and improve the Service.</li>
              <li>Authenticate users and prevent abuse and fraud.</li>
              <li>Process purchases, provide receipts, and handle billing-related support.</li>
              <li>Understand usage and performance to improve reliability and user experience.</li>
            </ul>
          </div>

          <div className="space-y-2">
            <h2 className="text-base font-semibold">Sharing</h2>
            <p>
              We may share information with service providers that help us operate the Service (for example, hosting,
              analytics, authentication, and payments). We may also share information if required by law or to protect
              our users and the Service.
            </p>
          </div>

          <div className="space-y-2">
            <h2 className="text-base font-semibold">Data retention</h2>
            <p>
              We retain information for as long as needed to provide the Service and for legitimate business purposes
              (such as security, compliance, and dispute resolution). Retention periods can vary depending on the type
              of data and how it is used.
            </p>
          </div>

          <div className="space-y-2">
            <h2 className="text-base font-semibold">Your choices</h2>
            <ul className="list-disc pl-6 space-y-1">
              <li>You can stop using the Service at any time.</li>
              <li>
                If you have an account, you may sign out and manage access via your identity provider where applicable.
              </li>
              <li>
                To request access, deletion, or other privacy-related help, contact us at{" "}
                <a className="underline" href={SUPPORT_MAILTO}>
                  {SUPPORT_EMAIL}
                </a>
                .
              </li>
            </ul>
          </div>

          <div className="space-y-2">
            <h2 className="text-base font-semibold">Acceptable use</h2>
            <p>
              You must follow our{" "}
              <Link className="underline" href="/acceptable-use">
                Acceptable Use Policy
              </Link>{" "}
              when using the Service.
            </p>
          </div>

          <div className="space-y-2">
            <h2 className="text-base font-semibold">Contact</h2>
            <p>
              Questions about this policy? Email{" "}
              <a className="underline" href={SUPPORT_MAILTO}>
                {SUPPORT_EMAIL}
              </a>
              .
            </p>
          </div>
        </section>
      </div>

      <Footer />
    </main>
  )
}
