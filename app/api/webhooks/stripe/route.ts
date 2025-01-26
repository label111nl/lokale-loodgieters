import { NextResponse } from "next/server"
import { headers, cookies } from "next/headers"
import { createServerClient } from "@supabase/ssr"
import Stripe from "stripe"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-12-18",
})

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!

export async function POST(req: Request) {
  const body = await req.text()
  const signature = headers().get("Stripe-Signature") as string

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
  } catch (err: any) {
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 })
  }

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookies().get(name)?.value
        },
        set(name: string, value: string, options: any) {
          cookies().set({ name, value, ...options })
        },
        remove(name: string, options: any) {
          cookies().set({ name, value: "", ...options })
        },
      },
    },
  )

  switch (event.type) {
    case "customer.subscription.created":
    case "customer.subscription.updated":
    case "customer.subscription.deleted":
      const subscription = event.data.object as Stripe.Subscription
      await handleSubscriptionChange(supabase, subscription)
      break
    case "invoice.paid":
      const invoice = event.data.object as Stripe.Invoice
      if (invoice.subscription) {
        await handleSubscriptionRenewal(supabase, invoice)
      }
      break
    // Add more cases as needed
  }

  return NextResponse.json({ received: true })
}

async function handleSubscriptionChange(supabase: any, subscription: Stripe.Subscription) {
  const { customer, status, items } = subscription
  const plumberId = customer as string // Assuming customer ID is the plumber ID

  const subscriptionType = items.data[0].price.lookup_key // Assuming you set this in Stripe

  await supabase
    .from("plumbers")
    .update({
      subscription_type: subscriptionType,
      subscription_status: status,
      subscription_end_date: new Date(subscription.current_period_end * 1000).toISOString(),
    })
    .eq("id", plumberId)
}

async function handleSubscriptionRenewal(supabase: any, invoice: Stripe.Invoice) {
  const plumberId = invoice.customer as string // Assuming customer ID is the plumber ID

  await supabase
    .from("plumbers")
    .update({
      subscription_end_date: new Date(invoice.lines.data[0].period.end * 1000).toISOString(),
    })
    .eq("id", plumberId)
}

