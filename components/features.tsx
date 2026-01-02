import { Card } from "@/components/ui/card"
import { Sparkles, Users, Palette, Zap, Images, TrendingUp } from "lucide-react"

const features = [
  {
    icon: Sparkles,
    title: "Natural Language Editing",
    description: "Edit images using simple text prompts. AI understands complex instructions like GPT for images",
  },
  {
    icon: Users,
    title: "Character Consistency",
    description: "Maintain perfect character details across edits. Excels at preserving faces and identities",
  },
  {
    icon: Palette,
    title: "Scene Preservation",
    description: "Seamlessly blend edits with original backgrounds. Superior scene fusion technology",
  },
  {
    icon: Zap,
    title: "One-Shot Editing",
    description: "Perfect results in a single attempt. Solves one-shot image editing challenges effortlessly",
  },
  {
    icon: Images,
    title: "Multi-Image Context",
    description: "Process multiple images simultaneously. Support for advanced multi-image editing workflows",
  },
  {
    icon: TrendingUp,
    title: "AI UGC Creation",
    description: "Create consistent AI influencers and UGC content. Perfect for social media and marketing",
  },
]

export function Features() {
  return (
    <section id="features" className="py-20 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-balance">Core Features</h2>
          <p className="text-xl text-muted-foreground text-pretty">Why Choose Nano Banana?</p>
          <p className="text-muted-foreground mt-2 text-sm">
            The most advanced AI image editor with natural language understanding
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <Card key={index} className="p-6 hover:shadow-lg transition-shadow">
              <feature.icon className="w-10 h-10 text-primary mb-4" />
              <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{feature.description}</p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
