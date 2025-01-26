import { NextResponse } from "next/server"
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"

const CREDITS_PER_LEAD = 1 // Stel dit in op het gewenste aantal credits per lead

export async function POST(req: Request) {
  const { leadId } = await req.json()
  const supabase = createRouteHandlerClient({ cookies })

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  // Start een transactie
  const { data, error } = await supabase.rpc("respond_to_lead", {
    p_plumber_id: user.id,
    p_lead_id: leadId,
    p_credits_required: CREDITS_PER_LEAD,
  })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true, remainingCredits: data })
}

