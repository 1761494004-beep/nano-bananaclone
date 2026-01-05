import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

const faqs = [
  {
    question: "What are credits and how are they used?",
    answer:
      "Credits are consumed when you generate images. As a rule of thumb, generating 1 high-quality image costs 2 credits.",
  },
  {
    question: "Can I cancel anytime?",
    answer:
      "Yes. You can cancel your subscription at any time. Your plan stays active until the end of the billing period.",
  },
  {
    question: "Do unused credits roll over?",
    answer:
      "Subscription credits refill at the start of each billing cycle. Unused subscription credits typically do not roll over.",
  },
  {
    question: "Can I use the images commercially?",
    answer: "Yes. All paid plans include commercial use.",
  },
  {
    question: "Can I upgrade or downgrade my plan later?",
    answer:
      "Yes. You can switch plans at any time. Plan changes usually apply immediately or at the next billing period depending on your billing settings.",
  },
  {
    question: "How do I get an invoice?",
    answer:
      "After checkout, your receipt and invoice are provided by the payment provider. If you need help, contact support and include your purchase email.",
  },
]

export function PricingFaq() {
  return (
    <section className="bg-muted/30 rounded-2xl border px-6 py-10">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold mb-2 text-balance">Frequently Asked Questions</h2>
          <p className="text-muted-foreground">Everything you need to know about plans and billing.</p>
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
