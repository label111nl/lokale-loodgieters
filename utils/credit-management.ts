import { createClient } from "@supabase/supabase-js"

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

export async function deductCredits(plumberId: string, amount: number, description: string) {
  const { data: plumber, error: plumberError } = await supabase
    .from("plumbers")
    .select("subscription_type")
    .eq("id", plumberId)
    .single()

  if (plumberError) {
    throw new Error(`Failed to fetch plumber data: ${plumberError.message}`)
  }

  // Check if the plumber has a premium subscription
  if (plumber.subscription_type === "premium") {
    // Premium subscribers don't use credits
    return { creditsUsed: 0, remainingCredits: "unlimited" }
  }

  const { data, error } = await supabase.rpc("deduct_credits", {
    p_plumber_id: plumberId,
    p_amount: amount,
    p_description: description,
  })

  if (error) {
    throw new Error(`Failed to deduct credits: ${error.message}`)
  }

  return { creditsUsed: amount, remainingCredits: data }
}

