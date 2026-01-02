import { Button } from "@/components/ui/button"

export function Header() {
  return (
    <header className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="text-2xl">🍌</div>
          <span className="font-bold text-xl text-foreground">Nano Banana</span>
        </div>
        <nav className="hidden md:flex items-center gap-8">
          <a
            href="#editor"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Editor
          </a>
          <a
            href="#features"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Features
          </a>
          <a
            href="#showcase"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Showcase
          </a>
          <a href="#faq" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            FAQ
          </a>
        </nav>
        <Button className="bg-primary text-primary-foreground hover:bg-primary/90">Start Editing</Button>
      </div>
    </header>
  )
}
