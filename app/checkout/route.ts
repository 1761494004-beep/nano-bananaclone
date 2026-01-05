import { Checkout } from "@creem_io/nextjs"

export const runtime = "nodejs"

function getBoolEnv(name: string, fallback: boolean) {
  const raw = process.env[name]
  if (!raw) return fallback
  return raw === "1" || raw.toLowerCase() === "true"
}

export const GET = Checkout({
  apiKey: process.env.CREEM_API_KEY!,
  testMode: getBoolEnv("CREEM_TEST_MODE", process.env.NODE_ENV !== "production"),
  defaultSuccessUrl: "/success",
})

