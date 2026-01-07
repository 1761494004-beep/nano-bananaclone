import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function SuccessPage() {
  return (
    <main className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-xl rounded-2xl border bg-card p-8 text-center">
        <h1 className="text-3xl md:text-4xl font-bold mb-3">Payment successful</h1>
        <p className="text-muted-foreground mb-6">
          Thanks for your purchase. If your credits don&apos;t update immediately, please wait 1-2 minutes and refresh.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button asChild>
            <Link href="/#editor">Start editing</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/pricing">Back to pricing</Link>
          </Button>
        </div>
      </div>
    </main>
  )
}

