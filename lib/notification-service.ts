import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY)

export async function sendNotification(type: string, userId: string, data: any) {
  const supabase = createClientComponentClient()

  // Store notification in database
  const { error: dbError } = await supabase.from("notifications").insert([
    {
      user_id: userId,
      type,
      data,
      read: false,
    },
  ])

  if (dbError) {
    console.error("Error storing notification:", dbError)
    return
  }

  // Send email notification
  if (data.email) {
    try {
      await resend.emails.send({
        from: "noreply@lokaleloodgieters.nl",
        to: data.email,
        subject: data.subject,
        html: data.html,
      })
    } catch (error) {
      console.error("Error sending email:", error)
    }
  }

  // Send Telegram notification if configured
  if (process.env.TELEGRAM_BOT_TOKEN && process.env.TELEGRAM_GROUP_ID) {
    try {
      const message = `${data.subject}\n\n${data.text}`
      await fetch(
        `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage?chat_id=${process.env.TELEGRAM_GROUP_ID}&text=${encodeURIComponent(message)}`,
      )
    } catch (error) {
      console.error("Error sending Telegram notification:", error)
    }
  }
}

