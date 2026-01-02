import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

export function Hero() {
  return (
    <section className="pt-32 pb-20 px-4 relative overflow-hidden">
      {/* Banana decorations */}
      <div className="absolute top-20 right-10 text-6xl opacity-20 rotate-12">🍌</div>
      <div className="absolute bottom-10 left-10 text-5xl opacity-15 -rotate-12">🍌</div>
      <div className="absolute top-40 left-1/4 text-4xl opacity-10 rotate-45">🍌</div>

      <div className="container mx-auto max-w-5xl text-center relative z-10">
        <Badge className="mb-6 bg-primary/10 text-primary border-primary/20 hover:bg-primary/20">
          <span className="text-lg mr-2">🍌</span>
          NEW: Nano Banana Pro is now live
        </Badge>

        <h1 className="text-5xl md:text-7xl font-bold mb-6 text-balance leading-tight">Nano Banana</h1>

        <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto text-pretty leading-relaxed">
          Transform any image with simple text prompts. Advanced AI model delivers consistent character editing and
          scene preservation.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 text-lg px-8">
            <span className="mr-2">🍌</span>
            Start Editing
          </Button>
          <Button size="lg" variant="outline" className="text-lg px-8 bg-transparent">
            View Examples
          </Button>
        </div>

        <div className="mt-12 flex items-center justify-center gap-2 text-sm text-muted-foreground">
          <span>✨</span>
          <span>One-shot editing</span>
          <span>•</span>
          <span>Multi-image support</span>
          <span>•</span>
          <span>Natural language</span>
        </div>
      </div>
    </section>
  )
}
