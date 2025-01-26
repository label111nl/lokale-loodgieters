import { createClient } from "@supabase/supabase-js"
import stripe from "@/utils/stripe-server"

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

export async function handleSubscriptionRenewal() {
  const { data: expiredSubscriptions, error } = await supabase
    .from("plumbers")
    .select("id, stripe_customer_id, subscription_type")
    .lt("subscription_end_date", new Date().toISOString())

  if (error) {
    console.error("Error fetching expired subscriptions:", error)
    return
  }

  for (const plumber of expiredSubscriptions) {
    try {
      const subscription = await stripe.subscriptions.create({
        customer: plumber.stripe_customer_id,
        items: [{ price: process.env[`STRIPE_${plumber.subscription_type.toUpperCase()}_PRICE_ID`] }],
      })

      await supabase
        .from("plumbers")
        .update({
          subscription_id: subscription.id,
          subscription_end_date: new Date(subscription.current_period_end * 1000).toISOString(),
        })
        .eq("id", plumber.id)
    } catch (error) {
      console.error(`Failed to renew subscription for plumber ${plumber.id}:`, error)
    }
  }
}

