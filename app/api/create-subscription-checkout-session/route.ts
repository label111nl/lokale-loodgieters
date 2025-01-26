import { NextResponse } from "next/server"
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import stripe from "@/utils/stripe-server"

const subscriptionPlans = {
  Standaard: {
    price: 5000, // in cents
    interval: "month",
  },
  Premium: {
    price: 15000, // in cents
    interval: "month",
  },
}

export async function POST(req: Request) {
  const { planName, plumberId } = await req.json()
  const supabase = createRouteHandlerClient({ cookies })

  const { data: plumber, error: plumberError } = await supabase
    .from("plumbers")
    .select("*")
    .eq("id", plumberId)
    .single()

  if (plumberError) {
    return NextResponse.json({ error: "Plumber not found" }, { status: 404 })
  }

  if (!subscriptionPlans[planName]) {
    return NextResponse.json({ error: "Invalid plan" }, { status: 400 })
  }

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "eur",
            product_data: {
              name: `${planName} Abonnement`,
            },
            unit_amount: subscriptionPlans[planName].price,
            recurring: {
              interval: subscriptionPlans[planName].interval,
            },
          },
          quantity: 1,
        },
      ],
      mode: "subscription",
      success_url: `${req.headers.get("origin")}/plumber/dashboard?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.get("origin")}/plumber/dashboard`,
      client_reference_id: plumberId,
    })

    return NextResponse.json({ sessionId: session.id })
  } catch (error) {
    console.error("Error:", error)
    return NextResponse.json({ error: "An error occurred" }, { status: 500 })
  }
}

