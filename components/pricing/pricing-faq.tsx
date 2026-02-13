import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { CREDITS_PER_GENERATION, CREDITS_PER_MONTH } from "@/lib/credits"

const faqs = [
  {
    question: "How do credits work?",
    answer:
      `Each image generation uses credits. One generation costs ${CREDITS_PER_GENERATION} credits.`,
  },
  {
    question: "How many credits do I get each month?",
    answer: `Basic Monthly includes ${CREDITS_PER_MONTH} credits per billing cycle.`,
  },
  {
    question: "Can I cancel anytime?",
    answer:
      "Yes. You can cancel anytime, and your subscription will remain active until the end of the current billing cycle.",
  },
  {
    question: "Do unused credits roll over?",
    answer:
      "Credits reset at the start of each billing cycle and typically do not roll over.",
  },
  {
    question: "Can I use generated images commercially?",
    answer: "Yes. Paid subscriptions include a commercial license.",
  },
  {
    question: "How do I get a receipt/invoice?",
    answer:
      "After payment, our payment provider will provide a receipt/invoice. If you need help, contact support and include the email used for purchase.",
  },
]

export function PricingFaq() {
  return (
    <section className="bg-muted/30 rounded-2xl border px-6 py-10">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold mb-2 text-balance">FAQ</h2>
          <p className="text-muted-foreground">Plans, billing, and credits.</p>
        </div>

        <Accordion type="single" collapsible className="w-full">
          {faqs.map((faq, index) => (
            <AccordionItem key={index} value={`item-${index}`}>
              <AccordionTrigger className="text-left">{faq.question}</AccordionTrigger>
              <AccordionContent className="text-muted-foreground leading-relaxed">{faq.answer}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  )
}
