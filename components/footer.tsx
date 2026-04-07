import Link from "next/link"
import { SUPPORT_EMAIL, SUPPORT_MAILTO } from "@/lib/support"

export function Footer() {
  return (
    <footer className="py-12 px-4 border-t border-border">
      <div className="container mx-auto max-w-6xl">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
            <div className="flex items-center gap-2">
              <div className="text-lg font-semibold">CP</div>
              <span className="font-bold text-xl">cartoonphoto</span>
            </div>

            <div className="flex gap-8 text-sm text-muted-foreground">
              <Link href="/pricing" className="hover:text-foreground transition-colors">
                Pricing
              </Link>
              <Link href="/billing" className="hover:text-foreground transition-colors">
                Billing
              </Link>
              <Link href="/privacy" className="hover:text-foreground transition-colors">
                Privacy
              </Link>
              <Link href="/terms" className="hover:text-foreground transition-colors">
                Terms
              </Link>
              <Link href="/acceptable-use" className="hover:text-foreground transition-colors">
                Acceptable Use
              </Link>
              <Link href="/contact" className="hover:text-foreground transition-colors">
                Contact
              </Link>
            </div>

            <p className="text-sm text-muted-foreground">(c) 2026 cartoonphoto. All rights reserved.</p>
          </div>

          <div className="space-y-2 text-center text-xs text-muted-foreground">
            <p>
              Support:{" "}
              <a className="underline underline-offset-4" href={SUPPORT_MAILTO}>
                {SUPPORT_EMAIL}
              </a>
            </p>
            <p>
              This service is powered by third-party AI technology. cartoonphoto is not affiliated with or endorsed by
              any AI model provider (including OpenAI, Google, Anthropic, etc.).
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
