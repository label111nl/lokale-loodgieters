import { NextResponse } from "next/server"
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"

export async function POST(req: Request) {
  const supabase = createRouteHandlerClient({ cookies })
  const quoteData = await req.json()

  try {
    const { data, error } = await supabase.from("quotes").insert([quoteData])

    if (error) {
      throw error
    }

    // Here you could add additional logic, such as sending notifications or emails

    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error("Error submitting quote request:", error)
    return NextResponse.json({ error: "An error occurred while submitting the quote request" }, { status: 500 })
  }
}

