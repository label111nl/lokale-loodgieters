import { createClient } from "@supabase/supabase-js"

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

export async function expireCredits() {
  const { data: expiredCredits, error } = await supabase
    .from("credit_transactions")
    .select("id, plumber_id, amount")
    .eq("type", "purchase")
    .lt("created_at", new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString()) // 90 days ago

  if (error) {
    console.error("Error fetching expired credits:", error)
    return
  }

  for (const credit of expiredCredits) {
    await supabase.rpc("expire_credits", {
      p_plumber_id: credit.plumber_id,
      p_amount: credit.amount,
      p_transaction_id: credit.id,
    })
  }
}

