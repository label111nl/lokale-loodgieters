import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1"
import { Configuration, OpenAIApi } from "https://esm.sh/openai@3.1.0"

const openAiConfig = new Configuration({
  apiKey: Deno.env.get("OPENAI_API_KEY"),
})
const openai = new OpenAIApi(openAiConfig)

const TELEGRAM_BOT_TOKEN = Deno.env.get("TELEGRAM_BOT_TOKEN")!
const TELEGRAM_GROUP_ID = Deno.env.get("TELEGRAM_GROUP_ID")!

async function sendTelegramNotification() {
  const message = `Nieuw lead beschikbaar!`
  const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage?chat_id=${TELEGRAM_GROUP_ID}&text=${encodeURIComponent(
    message,
  )}`

  const response = await fetch(url)
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`)
  }
}

serve(async (req) => {
  const { quoteId } = await req.json()

  const supabaseClient = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
  )

  const { data: quote, error: quoteError } = await supabaseClient.from("quotes").select("*").eq("id", quoteId).single()

  if (quoteError) {
    return new Response(JSON.stringify({ error: "Failed to fetch quote" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    })
  }

  const { data: plumbers, error: plumbersError } = await supabaseClient
    .from("plumbers")
    .select("*")
    .eq("subscription_status", "active")

  if (plumbersError) {
    return new Response(JSON.stringify({ error: "Failed to fetch plumbers" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    })
  }

  const prompt = `
    Given the following quote request:
    Service: ${quote.service_type}
    Description: ${quote.description}
    Location: ${quote.city}

    And the following list of plumbers:
    ${plumbers
      .map(
        (p) => `
      ID: ${p.id}
      Company: ${p.company_name}
      Services: ${p.services.join(", ")}
      Work Area: ${p.work_area.join(", ")}
    `,
      )
      .join("\n")}

    Recommend the best plumber for this job based on their services and work area.
    Provide the plumber's ID and a brief explanation for the recommendation.
  `

  const completion = await openai.createCompletion({
    model: "text-davinci-002",
    prompt,
    max_tokens: 150,
  })

  const response = completion.data.choices[0].text?.trim() ?? ""
  const recommendedPlumberId = response.match(/ID: (\w+)/)?.[1]
  const explanation = response.split("\n").slice(1).join(" ").trim()

  const { error: updateError } = await supabaseClient
    .from("quotes")
    .update({ recommended_plumber_id: recommendedPlumberId, recommendation_explanation: explanation })
    .eq("id", quoteId)

  if (updateError) {
    return new Response(JSON.stringify({ error: "Failed to update quote" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    })
  }

  // Send Telegram notification
  try {
    await sendTelegramNotification()
  } catch (error) {
    console.error("Error sending Telegram notification:", error)
  }

  return new Response(JSON.stringify({ success: true }), {
    headers: { "Content-Type": "application/json" },
  })
})

