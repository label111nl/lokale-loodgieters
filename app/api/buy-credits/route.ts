import { NextResponse } from "next/server"
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import stripe from "@/utils/stripe-server"

export async function POST(req: Request) {
  const { amount } = await req.json()
  const supabase = createRouteHandlerClient({ cookies })

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    // Haal de plumber gegevens op
    const { data: plumber, error: plumberError } = await supabase
      .from("plumbers")
      .select("*")
      .eq("id", user.id)
      .single()

    if (plumberError) {
      throw new Error("Error fetching plumber data")
    }

    // Maak een Stripe Checkout sessie
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "eur",
            product_data: {
              name: "Credits",
            },
            unit_amount: 100, // 1 euro per credit
          },
          quantity: amount,
        },
      ],
      mode: "payment",
      success_url: `${req.headers.get("origin")}/plumber/dashboard?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.get("origin")}/plumber/dashboard`,
      client_reference_id: user.id,
    })

    return NextResponse.json({ sessionId: session.id })
  } catch (error) {
    console.error("Error:", error)
    return NextResponse.json({ error: "An error occurred" }, { status: 500 })
  }
}

