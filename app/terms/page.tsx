import type { Metadata } from "next"
import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { SUPPORT_EMAIL, SUPPORT_MAILTO } from "@/lib/support"

export const metadata: Metadata = {
  title: "Terms of Service - cartoonphoto",
  description: "Terms of Service for cartoonphoto.",
}

export default function TermsPage() {
  return (
    <main className="min-h-screen">
      <Header />

      <div className="container mx-auto max-w-3xl px-4 pt-28 pb-16">
        <h1 className="text-3xl font-bold tracking-tight">Terms of Service</h1>
        <p className="mt-2 text-sm text-muted-foreground">Last updated: February 28, 2026</p>

        <section className="mt-10 space-y-6 text-sm leading-6 text-foreground">
          <p>
            These Terms of Service (&quot;Terms&quot;) govern your access to and use of the cartoonphoto website and AI image editor
            (the &quot;Service&quot;). By using the Service, you agree to these Terms.
          </p>

          <div className="space-y-2">
            <h2 className="text-base font-semibold">Acceptable Use</h2>
            <p>
              You must comply with our{" "}
              <Link className="underline" href="/acceptable-use">
                Acceptable Use Policy
              </Link>{" "}
              at all times. We may remove content, suspend access, or terminate accounts for violations.
            </p>
          </div>

          <div className="space-y-2">
            <h2 className="text-base font-semibold">Your content and permissions</h2>
            <ul className="list-disc pl-6 space-y-1">
              <li>
                You are responsible for the images, prompts, and other content you upload or submit (&quot;Content&quot;).
              </li>
              <li>You represent that you have all rights necessary to submit and use your Content.</li>
              <li>
                You grant us a limited license to process your Content solely to provide and improve the Service (for
                example, to run the image transformations you request).
              </li>
            </ul>
          </div>

          <div className="space-y-2">
            <h2 className="text-base font-semibold">AI outputs</h2>
            <p>
              The Service may generate outputs based on your inputs. You are responsible for how you use outputs and for
              ensuring your use complies with applicable laws and these Terms.
            </p>
          </div>

          <div className="space-y-2">
            <h2 className="text-base font-semibold">Payments</h2>
            <p>
              If you purchase a plan or credits, payments are handled by our payment provider. Prices, features, and
              limits may change. To the extent permitted by law, all purchases are final unless otherwise stated at
              checkout.
            </p>
          </div>

          <div className="space-y-2">
            <h2 className="text-base font-semibold">Prohibited conduct</h2>
            <ul className="list-disc pl-6 space-y-1">
              <li>Attempting to disrupt, reverse engineer, or bypass Service limits or security.</li>
              <li>Using the Service to generate or distribute illegal content.</li>
              <li>Uploading malware or attempting to compromise the Service.</li>
              <li>Using the Service in a way that violates the rights of others.</li>
            </ul>
          </div>

          <div className="space-y-2">
            <h2 className="text-base font-semibold">Termination</h2>
            <p>
              We may suspend or terminate your access to the Service at any time if we reasonably believe you have
              violated these Terms or the Acceptable Use Policy, or if needed to protect the Service, users, or third
              parties.
            </p>
          </div>

          <div className="space-y-2">
            <h2 className="text-base font-semibold">Disclaimers</h2>
            <p>
              The Service is provided on an &quot;as is&quot; and &quot;as available&quot; basis. We do not guarantee that the Service will
              be uninterrupted, secure, or error-free, or that outputs will be accurate or suitable for your purposes.
            </p>
          </div>

          <div className="space-y-2">
            <h2 className="text-base font-semibold">Limitation of liability</h2>
            <p>
              To the maximum extent permitted by law, we are not liable for any indirect, incidental, special,
              consequential, or punitive damages, or any loss of profits, data, or goodwill arising out of or related to
              your use of the Service.
            </p>
          </div>

          <div className="space-y-2">
            <h2 className="text-base font-semibold">Contact</h2>
            <p>
              Questions about these Terms? Email{" "}
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
