import { NextResponse } from "next/server"
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import stripe from "@/utils/stripe-server"

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET

export async function POST(req: Request) {
  const supabase = createRouteHandlerClient({ cookies })
  const body = await req.text()
  const sig = req.headers.get("stripe-signature") as string

  let event

  try {
    event = stripe.webhooks.constructEvent(body, sig, endpointSecret!)
  } catch (err: any) {
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 })
  }

  switch (event.type) {
    case "checkout.session.completed":
      const session = event.data.object

      if (session.mode === "payment") {
        // Handle credit purchase
        const { client_reference_id, amount_total } = session
        const creditsToAdd = Math.floor(amount_total! / 100) // 1 credit per euro

        await supabase
          .from("plumbers")
          .update({ credits: supabase.sql`credits + ${creditsToAdd}` })
          .eq("id", client_reference_id)
      } else if (session.mode === "subscription") {
        // Handle subscription
        const { client_reference_id, subscription } = session
        const subscriptionData = await stripe.subscriptions.retrieve(subscription as string)

        await supabase
          .from("plumbers")
          .update({
            subscription_id: subscription,
            subscription_status: subscriptionData.status,
            subscription_type: subscriptionData.items.data[0].price.nickname,
            subscription_end_date: new Date(subscriptionData.current_period_end * 1000).toISOString(),
          })
          .eq("id", client_reference_id)
      }
      break
    case "invoice.paid":
      // Handle successful subscription renewal
      const invoice = event.data.object
      await supabase
        .from("plumbers")
        .update({
          subscription_status: "active",
          subscription_end_date: new Date(invoice.lines.data[0].period.end * 1000).toISOString(),
        })
        .eq("subscription_id", invoice.subscription)
      break
    case "invoice.payment_failed":
      // Handle failed subscription renewal
      const failedInvoice = event.data.object
      await supabase
        .from("plumbers")
        .update({
          subscription_status: "past_due",
        })
        .eq("subscription_id", failedInvoice.subscription)
      break
    default:
      console.log(`Unhandled event type ${event.type}`)
  }

  return NextResponse.json({ received: true })
}

