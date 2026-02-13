import Link from "next/link"
import { Button } from "@/components/ui/button"
import { CREDITS_PER_MONTH } from "@/lib/credits"

export default function SuccessPage() {
  return (
    <main className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-xl rounded-2xl border bg-card p-8 text-center">
        <h1 className="text-3xl md:text-4xl font-bold mb-3">Payment successful</h1>
        <p className="text-muted-foreground mb-6">
          Thanks for your purchase. Your credits ({CREDITS_PER_MONTH}) may take 1-2 minutes to appear. Please refresh
          the page shortly.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button asChild>
            <Link href="/#editor">Start generating</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/pricing">Back to pricing</Link>
          </Button>
        </div>
      </div>
    </main>
  )
}
