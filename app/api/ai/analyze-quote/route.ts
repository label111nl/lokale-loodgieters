import { NextResponse } from "next/server"
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import OpenAI from "openai"

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

export async function POST(req: Request) {
  const supabase = createRouteHandlerClient({ cookies })
  const { quoteData } = await req.json()

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        { role: "system", content: "You are an AI assistant analyzing plumbing quote requests." },
        { role: "user", content: `Analyze this quote request and provide insights: ${JSON.stringify(quoteData)}` },
      ],
      max_tokens: 500,
    })

    const analysis = response.choices[0].message.content

    // Store the analysis in the database
    const { error: updateError } = await supabase
      .from("quotes")
      .update({ ai_analysis: analysis })
      .eq("id", quoteData.id)

    if (updateError) {
      console.error("Error updating quote with AI analysis:", updateError)
    }

    return NextResponse.json({ analysis })
  } catch (error) {
    console.error("Error in AI quote analysis:", error)
    return NextResponse.json({ error: "Failed to analyze quote" }, { status: 500 })
  }
}

