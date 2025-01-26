import { createClient } from "@supabase/supabase-js"
import { Configuration, OpenAIApi } from "openai"

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)
const openai = new OpenAIApi(new Configuration({ apiKey: process.env.OPENAI_API_KEY }))

export async function prioritizeLeads(quoteId: string) {
  const { data: quote, error } = await supabase.from("quotes").select("*").eq("id", quoteId).single()

  if (error) {
    console.error("Error fetching quote:", error)
    return
  }

  const prompt = `
    Given the following quote request:
    Service: ${quote.service_type}
    Description: ${quote.description}
    Urgency: ${quote.urgency}

    Assign a priority score from 1-10 based on the urgency and nature of the request.
    Provide a brief explanation for the score.
  `

  const response = await openai.createCompletion({
    model: "text-davinci-002",
    prompt,
    max_tokens: 100,
  })

  const priorityScore = Number.parseInt(response.data.choices[0].text!.match(/\d+/)![0])
  const explanation = response.data.choices[0].text!.split("\n").slice(1).join(" ").trim()

  await supabase
    .from("quotes")
    .update({ priority_score: priorityScore, priority_explanation: explanation })
    .eq("id", quoteId)
}

export async function matchPlumberToQuote(quoteId: string) {
  const { data: quote, error: quoteError } = await supabase.from("quotes").select("*").eq("id", quoteId).single()

  if (quoteError) {
    console.error("Error fetching quote:", quoteError)
    return
  }

  const { data: plumbers, error: plumbersError } = await supabase
    .from("plumbers")
    .select("*")
    .eq("subscription_status", "active")

  if (plumbersError) {
    console.error("Error fetching plumbers:", plumbersError)
    return
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

  const response = await openai.createCompletion({
    model: "text-davinci-002",
    prompt,
    max_tokens: 150,
  })

  const recommendedPlumberId = response.data.choices[0].text!.match(/ID: (\w+)/)![1]
  const explanation = response.data.choices[0].text!.split("\n").slice(1).join(" ").trim()

  await supabase
    .from("quotes")
    .update({ recommended_plumber_id: recommendedPlumberId, recommendation_explanation: explanation })
    .eq("id", quoteId)
}

