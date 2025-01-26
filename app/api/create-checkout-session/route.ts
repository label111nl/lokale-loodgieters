import { NextResponse } from "next/server"
import Stripe from "stripe"

if (!process.env.STRIPE_SECRET_KEY) {
  console.error("STRIPE_SECRET_KEY is not set in the environment variables")
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2023-10-16", // Use the latest API version
})

export async function POST(req: Request) {
  if (!process.env.STRIPE_SECRET_KEY) {
    return NextResponse.json({ error: "Stripe is not configured" }, { status: 500 })
  }

  if (req.method === "POST") {
    try {
      const { price } = await req.json()

      // Create Checkout Sessions from body params.
      const session = await stripe.checkout.sessions.create({
        line_items: [
          {
            // Provide the exact Price ID (for example, pr_1234) of the product you want to sell
            price: price,
            quantity: 1,
          },
        ],
        mode: "payment",
        success_url: `${req.headers.get("origin")}/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${req.headers.get("origin")}/canceled`,
      })

      return NextResponse.json({ sessionId: session.id })
    } catch (err: any) {
      console.error("Stripe error:", err)
      return NextResponse.json({ error: err.message }, { status: 500 })
    }
  } else {
    return NextResponse.json({ error: "Method Not Allowed" }, { status: 405 })
  }
}

