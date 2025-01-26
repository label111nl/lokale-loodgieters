import { NextResponse } from "next/server"
import { createServerSupabaseClient } from "@/lib/supabase-server"
import OpenAI from "openai"

export async function POST(req: Request) {
  try {
    const supabase = createServerSupabaseClient()
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

    const { feedbackData } = await req.json()

    if (!feedbackData) {
      return NextResponse.json({ error: "No feedback data provided" }, { status: 400 })
    }

    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        { role: "system", content: "You are an AI assistant analyzing customer feedback for a plumbing service." },
        { role: "user", content: `Analyze this feedback and provide insights: ${JSON.stringify(feedbackData)}` },
      ],
      max_tokens: 500,
    })

    const analysis = response.choices[0].message.content

    // Log the feedback analysis in Supabase
    const { error: insertError } = await supabase
      .from("feedback_analyses")
      .insert({ feedback_id: feedbackData.id, analysis, created_at: new Date().toISOString() })

    if (insertError) {
      console.error("Error inserting feedback analysis:", insertError)
    }

    return NextResponse.json({ analysis })
  } catch (error) {
    console.error("Error in feedback analysis:", error)
    return NextResponse.json({ error: "Failed to analyze feedback", details: error.message }, { status: 500 })
  }
}

