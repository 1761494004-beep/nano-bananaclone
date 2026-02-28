import Link from "next/link"

export function Footer() {
  return (
    <footer className="py-12 px-4 border-t border-border">
      <div className="container mx-auto max-w-6xl">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="text-2xl">🍌</div>
            <span className="font-bold text-xl">Nano Banana</span>
          </div>

          <div className="flex gap-8 text-sm text-muted-foreground">
            <Link href="/pricing" className="hover:text-foreground transition-colors">
              Pricing
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

          <p className="text-sm text-muted-foreground">© 2026 Nano Banana. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
