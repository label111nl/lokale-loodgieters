import { NextResponse } from "next/server"
import { createServerSupabaseClient } from "@/lib/supabase-server"
import OpenAI from "openai"

export async function POST(req: Request) {
  try {
    const supabase = createServerSupabaseClient()
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

    const { contentType, prompt } = await req.json()

    if (!contentType || !prompt) {
      return NextResponse.json({ error: "Content type and prompt are required" }, { status: 400 })
    }

    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: `You are an AI assistant generating ${contentType} content for a plumbing service website.`,
        },
        { role: "user", content: prompt },
      ],
      max_tokens: 1000,
    })

    const generatedContent = response.choices[0].message.content

    // Log the generated content in Supabase
    const { error: insertError } = await supabase
      .from("generated_content")
      .insert({ content_type: contentType, prompt, content: generatedContent, created_at: new Date().toISOString() })

    if (insertError) {
      console.error("Error inserting generated content:", insertError)
    }

    return NextResponse.json({ content: generatedContent })
  } catch (error) {
    console.error("Error in content generation:", error)
    return NextResponse.json({ error: "Failed to generate content", details: error.message }, { status: 500 })
  }
}

