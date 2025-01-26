import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1"
import { Configuration, OpenAIApi } from "https://esm.sh/openai@3.1.0"

const openAiConfig = new Configuration({
  apiKey: Deno.env.get("OPENAI_API_KEY"),
})
const openai = new OpenAIApi(openAiConfig)

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

  const prompt = `
    Given the following quote request:
    Service: ${quote.service_type}
    Description: ${quote.description}
    Urgency: ${quote.urgency}

    Assign a priority score from 1-10 based on the urgency and nature of the request.
    Provide a brief explanation for the score.
  `

  const completion = await openai.createCompletion({
    model: "text-davinci-002",
    prompt,
    max_tokens: 100,
  })

  const response = completion.data.choices[0].text?.trim() ?? ""
  const priorityScore = Number.parseInt(response.match(/\d+/)?.[0] ?? "0")
  const explanation = response.split("\n").slice(1).join(" ").trim()

  const { error: updateError } = await supabaseClient
    .from("quotes")
    .update({ priority_score: priorityScore, priority_explanation: explanation })
    .eq("id", quoteId)

  if (updateError) {
    return new Response(JSON.stringify({ error: "Failed to update quote" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    })
  }

  return new Response(JSON.stringify({ success: true }), {
    headers: { "Content-Type": "application/json" },
  })
})

