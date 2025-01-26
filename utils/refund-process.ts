import { createClient } from "@supabase/supabase-js"
import stripe from "@/utils/stripe-server"

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

export async function processRefund(plumberId: string, amount: number, reason: string) {
  const { data: plumber, error: plumberError } = await supabase
    .from("plumbers")
    .select("stripe_customer_id")
    .eq("id", plumberId)
    .single()

  if (plumberError) {
    throw new Error(`Failed to fetch plumber data: ${plumberError.message}`)
  }

  try {
    // Create a refund in Stripe
    const refund = await stripe.refunds.create({
      amount: amount * 100, // Convert to cents
      customer: plumber.stripe_customer_id,
      reason: "requested_by_customer",
    })

    // Record the refund in our database
    await supabase.from("credit_transactions").insert({
      plumber_id: plumberId,
      amount: -amount, // Negative amount for refund
      type: "refund",
      description: reason,
      stripe_refund_id: refund.id,
    })

    // Update plumber's credit balance
    await supabase.rpc("adjust_credits", {
      p_plumber_id: plumberId,
      p_amount: -amount,
    })

    return { success: true, refundId: refund.id }
  } catch (error) {
    console.error("Error processing refund:", error)
    throw new Error("Failed to process refund")
  }
}

