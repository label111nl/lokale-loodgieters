import { createClient } from "@supabase/supabase-js"

// Initialiseer de Supabase client
const supabaseUrl = Deno.env.get("SUPABASE_URL") as string
const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") as string
const supabase = createClient(supabaseUrl, supabaseKey)

async function renewSubscriptions() {
  const { data: plumbers, error } = await supabase
    .from("plumbers")
    .select("id, subscription_type, subscription_end_date")
    .eq("subscription_type", "monthly")
    .lt("subscription_end_date", new Date().toISOString())

  if (error) {
    console.error("Error fetching plumbers:", error)
    return
  }

  for (const plumber of plumbers) {
    // Vernieuw het abonnement
    const { error: updateError } = await supabase
      .from("plumbers")
      .update({
        subscription_end_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 dagen vanaf nu
      })
      .eq("id", plumber.id)

    if (updateError) {
      console.error(`Error renewing subscription for plumber ${plumber.id}:`, updateError)
    } else {
      console.log(`Successfully renewed subscription for plumber ${plumber.id}`)
    }
  }
}

// Voer de functie uit
renewSubscriptions()

