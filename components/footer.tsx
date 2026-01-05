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
            <a href="/pricing" className="hover:text-foreground transition-colors">
              Pricing
            </a>
            <a href="#" className="hover:text-foreground transition-colors">
              Privacy
            </a>
            <a href="#" className="hover:text-foreground transition-colors">
              Terms
            </a>
            <a href="#" className="hover:text-foreground transition-colors">
              Contact
            </a>
          </div>

          <p className="text-sm text-muted-foreground">© 2026 Nano Banana. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
