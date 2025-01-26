import { createClient } from "@supabase/supabase-js"
import { Resend } from "resend"

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)
const resend = new Resend(process.env.RESEND_API_KEY)

export async function checkAndNotifyLowCredits(plumberId: string) {
  const { data: plumber, error } = await supabase
    .from("plumbers")
    .select("credits, email, subscription_type")
    .eq("id", plumberId)
    .single()

  if (error) {
    console.error("Error fetching plumber data:", error)
    return
  }

  if (plumber.subscription_type !== "premium" && plumber.credits <= 5) {
    // Send email notification
    await sendLowCreditEmail(plumber.email, plumber.credits)

    // Create in-app notification
    await supabase.from("notifications").insert({
      user_id: plumberId,
      type: "low_credits",
      message: `Your credit balance is low (${plumber.credits} credits remaining). Please purchase more credits to continue responding to leads.`,
    })
  }
}

async function sendLowCreditEmail(email: string, credits: number) {
  try {
    await resend.emails.send({
      from: "Lokale Loodgieters <noreply@lokaleloodgieters.nl>",
      to: email,
      subject: "Low Credit Balance Alert",
      html: `
        <h1>Your credit balance is low</h1>
        <p>You currently have ${credits} credits remaining. To ensure you can continue responding to leads, please purchase more credits soon.</p>
        <a href="https://lokaleloodgieters.nl/plumber/dashboard">Go to Dashboard</a>
      `,
    })
  } catch (error) {
    console.error("Error sending low credit email:", error)
  }
}

