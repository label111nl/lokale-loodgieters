import { NextResponse } from "next/server"
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import OpenAI from "openai"

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

export async function POST(req: Request) {
  const supabase = createRouteHandlerClient({ cookies })
  const { quoteId } = await req.json()

  try {
    // Fetch the quote data
    const { data: quoteData, error: quoteError } = await supabase.from("quotes").select("*").eq("id", quoteId).single()

    if (quoteError) throw quoteError

    // Fetch all available plumbers
    const { data: plumbers, error: plumbersError } = await supabase.from("plumbers").select("*")

    if (plumbersError) throw plumbersError

    // Use AI to match plumbers to the quote
    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        { role: "system", content: "You are an AI assistant matching plumbers to quote requests." },
        {
          role: "user",
          content: `Match these plumbers to the quote request: Quote: ${JSON.stringify(quoteData)}, Plumbers: ${JSON.stringify(plumbers)}`,
        },
      ],
      max_tokens: 500,
    })

    const matchedPlumbers = JSON.parse(response.choices[0].message.content)

    // Update the quote with matched plumbers
    const { error: updateError } = await supabase
      .from("quotes")
      .update({ matched_plumbers: matchedPlumbers })
      .eq("id", quoteId)

    if (updateError) {
      console.error("Error updating quote with matched plumbers:", updateError)
    }

    return NextResponse.json({ matchedPlumbers })
  } catch (error) {
    console.error("Error in AI plumber matching:", error)
    return NextResponse.json({ error: "Failed to match plumbers" }, { status: 500 })
  }
}

