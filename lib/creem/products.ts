export type BillingInterval = "monthly" | "yearly"

export type CreemPricingTierKey = "basic" | "pro" | "max"

export type CreemPricingProducts = Record<
  CreemPricingTierKey,
  Record<BillingInterval, string | null>
>

function readEnv(name: string): string | null {
  const raw = process.env[name]
  if (!raw) return null
  const value = raw.trim()
  return value.length ? value : null
}

export function getCreemPricingProducts(): CreemPricingProducts {
  return {
    basic: {
      monthly: readEnv("CREEM_PRODUCT_ID_BASIC_MONTHLY"),
      yearly: readEnv("CREEM_PRODUCT_ID_BASIC_YEARLY"),
    },
    pro: {
      monthly: readEnv("CREEM_PRODUCT_ID_PRO_MONTHLY"),
      yearly: readEnv("CREEM_PRODUCT_ID_PRO_YEARLY"),
    },
    max: {
      monthly: readEnv("CREEM_PRODUCT_ID_MAX_MONTHLY"),
      yearly: readEnv("CREEM_PRODUCT_ID_MAX_YEARLY"),
    },
  }
}
