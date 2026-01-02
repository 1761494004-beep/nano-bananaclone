import { Card } from "@/components/ui/card"
import { Star } from "lucide-react"

const reviews = [
  {
    name: "Sarah Chen",
    role: "Digital Creator",
    avatar: "👩‍🎨",
    review:
      "This editor completely changed my workflow. The character consistency is incredible - miles ahead of other tools!",
    rating: 5,
  },
  {
    name: "Michael Torres",
    role: "UGC Specialist",
    avatar: "👨‍💼",
    review: "Creating consistent AI influencers has never been easier. It maintains perfect face details across edits!",
    rating: 5,
  },
  {
    name: "Emma Wilson",
    role: "Professional Editor",
    avatar: "👩‍💻",
    review: "One-shot editing is basically solved with this tool. The scene blending is so natural and realistic!",
    rating: 5,
  },
]

export function Reviews() {
  return (
    <section className="py-20 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-balance">User Reviews</h2>
          <p className="text-xl text-muted-foreground text-pretty">What creators are saying</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {reviews.map((review, index) => (
            <Card key={index} className="p-8 hover:shadow-lg transition-shadow">
              <div className="flex items-center gap-1 mb-4">
                {[...Array(review.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-primary text-primary" />
                ))}
              </div>
              <p className="text-muted-foreground mb-6 leading-relaxed">"{review.review}"</p>
              <div className="flex items-center gap-3">
                <div className="text-3xl">{review.avatar}</div>
                <div>
                  <p className="font-bold">{review.name}</p>
                  <p className="text-sm text-muted-foreground">{review.role}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
