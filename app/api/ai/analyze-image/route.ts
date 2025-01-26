import { NextResponse } from "next/server"
import OpenAI from "openai"
import { createServerSupabaseClient } from "@/lib/supabase-server"
import { writeFile } from "fs/promises"
import path from "path"

export async function POST(req: Request) {
  try {
    const supabase = createServerSupabaseClient()
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

    const formData = await req.formData()
    const image = formData.get("image") as File

    if (!image) {
      return NextResponse.json({ error: "No image provided" }, { status: 400 })
    }

    const bytes = await image.arrayBuffer()
    const buffer = Buffer.from(bytes)

    const tempFilePath = path.join("/tmp", `${Date.now()}-${image.name}`)
    await writeFile(tempFilePath, buffer)

    const response = await openai.chat.completions.create({
      model: "gpt-4-vision-preview",
      messages: [
        {
          role: "user",
          content: [
            { type: "text", text: "Analyze this plumbing-related image and describe the problem you see." },
            {
              type: "image_url",
              image_url: {
                url: `data:${image.type};base64,${buffer.toString("base64")}`,
              },
            },
          ],
        },
      ],
      max_tokens: 300,
    })

    const analysis = response.choices[0].message.content

    // Log the analysis in Supabase
    const { error: insertError } = await supabase
      .from("image_analyses")
      .insert({ analysis, image_name: image.name, created_at: new Date().toISOString() })

    if (insertError) {
      console.error("Error inserting image analysis:", insertError)
    }

    return NextResponse.json({ analysis })
  } catch (error) {
    console.error("Error in analyze-image:", error)
    return NextResponse.json({ error: "Failed to analyze image", details: error.message }, { status: 500 })
  }
}

