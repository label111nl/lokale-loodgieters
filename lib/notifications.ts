import { createClient } from "@supabase/supabase-js"
import fetch from "node-fetch"

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN!
const TELEGRAM_GROUP_ID = process.env.TELEGRAM_GROUP_ID!

export async function sendNewLeadNotification(quoteId: string) {
  const { data: quote, error: quoteError } = await supabase.from("quotes").select("*").eq("id", quoteId).single()

  if (quoteError) {
    console.error("Error fetching quote:", quoteError)
    return
  }

  const message = `Nieuw lead beschikbaar!`

  try {
    const response = await fetch(
      `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage?chat_id=${TELEGRAM_GROUP_ID}&text=${encodeURIComponent(
        message,
      )}`,
    )

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    console.log("Telegram notification sent successfully")
  } catch (error) {
    console.error("Error sending Telegram notification:", error)
  }
}

