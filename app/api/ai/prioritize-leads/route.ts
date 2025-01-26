import { NextResponse } from "next/server"
import { createServerSupabaseClient } from "@/lib/supabase-server"
import OpenAI from "openai"

export async function POST(req: Request) {
  try {
    const supabase = createServerSupabaseClient()
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

    const { leads } = await req.json()

    if (!leads || !Array.isArray(leads)) {
      return NextResponse.json({ error: "Invalid leads data provided" }, { status: 400 })
    }

    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        { role: "system", content: "You are an AI assistant prioritizing plumbing service leads." },
        { role: "user", content: `Analyze and prioritize these leads: ${JSON.stringify(leads)}` },
      ],
      max_tokens: 1000,
    })

    const prioritizedLeads = JSON.parse(response.choices[0].message.content)

    // Log the prioritized leads in Supabase
    const { error: insertError } = await supabase
      .from("lead_prioritizations")
      .insert({ original_leads: leads, prioritized_leads: prioritizedLeads, created_at: new Date().toISOString() })

    if (insertError) {
      console.error("Error inserting lead prioritization:", insertError)
    }

    return NextResponse.json({ prioritizedLeads })
  } catch (error) {
    console.error("Error in lead prioritization:", error)
    return NextResponse.json({ error: "Failed to prioritize leads", details: error.message }, { status: 500 })
  }
}

