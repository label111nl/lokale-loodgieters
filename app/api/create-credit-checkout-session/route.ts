import { NextResponse } from "next/server"
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import stripe from "@/utils/stripe-server"

const creditPacks = {
  1: { credits: 1, price: 3500 },
  5: { credits: 5, price: 15000 },
  10: { credits: 10, price: 30000 },
  15: { credits: 15, price: 42500 },
}

export async function POST(req: Request) {
  const { packId, plumberId } = await req.json()
  const supabase = createRouteHandlerClient({ cookies })

  const { data: plumber, error: plumberError } = await supabase
    .from("plumbers")
    .select("*")
    .eq("id", plumberId)
    .single()

  if (plumberError) {
    return NextResponse.json({ error: "Plumber not found" }, { status: 404 })
  }

  const pack = creditPacks[packId]
  if (!pack) {
    return NextResponse.json({ error: "Invalid pack" }, { status: 400 })
  }

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "eur",
            product_data: {
              name: `${pack.credits} Credit${pack.credits > 1 ? "s" : ""} Pack`,
            },
            unit_amount: pack.price,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${req.headers.get("origin")}/plumber/dashboard?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.get("origin")}/plumber/dashboard`,
      client_reference_id: plumberId,
      metadata: {
        credits: pack.credits,
      },
    })

    return NextResponse.json({ sessionId: session.id })
  } catch (error) {
    console.error("Error:", error)
    return NextResponse.json({ error: "An error occurred" }, { status: 500 })
  }
}

