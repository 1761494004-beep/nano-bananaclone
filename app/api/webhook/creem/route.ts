import { Webhook } from "@creem_io/nextjs"

export const runtime = "nodejs"

export const POST = Webhook({
  webhookSecret: process.env.CREEM_WEBHOOK_SECRET!,

  onCheckoutCompleted: async ({ customer, product, subscription }) => {
    console.log("[creem] checkout.completed", {
      email: customer?.email,
      productId: product.id,
      productName: product.name,
      subscriptionId: subscription?.id,
    })
  },

  onGrantAccess: async ({ reason, customer, metadata, product, id }) => {
    console.log("[creem] grant_access", {
      reason,
      email: customer.email,
      productId: product.id,
      subscriptionId: id,
      metadata,
    })
  },

  onRevokeAccess: async ({ reason, customer, metadata, product, id }) => {
    console.log("[creem] revoke_access", {
      reason,
      email: customer.email,
      productId: product.id,
      subscriptionId: id,
      metadata,
    })
  },
})
