import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

const showcaseItems = [
  {
    title: "Ultra-Fast Mountain Generation",
    description: "Created in 0.8 seconds with optimized neural engine",
    badge: "Nano Banana Speed",
    image: "/majestic-mountain-vista.png",
  },
  {
    title: "Instant Garden Creation",
    description: "Complex scene rendered in milliseconds",
    badge: "Nano Banana Speed",
    image: "/beautiful-garden.jpg",
  },
  {
    title: "Real-time Beach Synthesis",
    description: "Delivers photorealistic results at lightning speed",
    badge: "Nano Banana Speed",
    image: "/tropical-beach-paradise.png",
  },
  {
    title: "Rapid Aurora Generation",
    description: "Advanced effects processed instantly",
    badge: "Nano Banana Speed",
    image: "/aurora-borealis.png",
  },
]

export function Showcase() {
  return (
    <section id="showcase" className="py-20 px-4 bg-muted/30 relative overflow-hidden">
      <div className="absolute top-10 right-20 text-5xl opacity-10 rotate-12">🍌</div>
      <div className="absolute bottom-20 left-10 text-6xl opacity-10 -rotate-12">🍌</div>

      <div className="container mx-auto max-w-6xl relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-balance">Showcase</h2>
          <p className="text-xl text-muted-foreground text-pretty">Lightning-Fast AI Creations</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {showcaseItems.map((item, index) => (
            <Card key={index} className="overflow-hidden hover:shadow-xl transition-shadow">
              <img
                src={item.image || "/placeholder.svg"}
                alt={item.title}
                className="w-full h-64 object-cover"
                suppressHydrationWarning
              />
              <div className="p-6">
                <Badge className="mb-3 bg-primary/10 text-primary border-primary/20">{item.badge}</Badge>
                <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                <p className="text-muted-foreground text-sm">{item.description}</p>
              </div>
            </Card>
          ))}
        </div>

        <div className="text-center">
          <p className="text-muted-foreground mb-4">Experience the power of Nano Banana yourself</p>
          <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90">
            <span className="mr-2">🍌</span>
            Try Nano Banana Generator
          </Button>
        </div>
      </div>
    </section>
  )
}
