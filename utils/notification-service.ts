import { createClient } from "@supabase/supabase-js"
import { Resend } from "resend"
import axios from "axios"

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)
const resend = new Resend(process.env.RESEND_API_KEY)

interface NotificationPayload {
  userId: string
  type: string
  title: string
  message: string
  data?: Record<string, any>
}

export async function sendNotification(payload: NotificationPayload) {
  const { userId, type, title, message, data } = payload

  // Store notification in database
  const { error: dbError } = await supabase.from("notifications").insert([
    {
      user_id: userId,
      type,
      title,
      message,
      data,
      read: false,
    },
  ])

  if (dbError) {
    console.error("Error storing notification:", dbError)
  }

  // Fetch user's notification preferences
  const { data: userPreferences, error: prefError } = await supabase
    .from("user_preferences")
    .select("email_notifications, telegram_notifications, telegram_chat_id")
    .eq("user_id", userId)
    .single()

  if (prefError) {
    console.error("Error fetching user preferences:", prefError)
    return
  }

  // Send email notification if enabled
  if (userPreferences.email_notifications) {
    await sendEmailNotification(userId, title, message)
  }

  // Send Telegram notification if enabled
  if (userPreferences.telegram_notifications && userPreferences.telegram_chat_id) {
    await sendTelegramNotification(userPreferences.telegram_chat_id, title, message)
  }
}

async function sendEmailNotification(userId: string, subject: string, body: string) {
  const { data: user, error: userError } = await supabase.from("users").select("email").eq("id", userId).single()

  if (userError) {
    console.error("Error fetching user email:", userError)
    return
  }

  try {
    await resend.emails.send({
      from: "Lokale Loodgieters <noreply@lokaleloodgieters.nl>",
      to: user.email,
      subject: subject,
      html: `<h1>${subject}</h1><p>${body}</p>`,
    })
  } catch (error) {
    console.error("Error sending email:", error)
  }
}

async function sendTelegramNotification(chatId: string, title: string, message: string) {
  const telegramBotToken = process.env.TELEGRAM_BOT_TOKEN
  if (!telegramBotToken) {
    console.error("Telegram bot token not configured")
    return
  }

  const telegramMessage = `<b>${title}</b>\n\n${message}`
  const telegramApiUrl = `https://api.telegram.org/bot${telegramBotToken}/sendMessage`

  try {
    await axios.post(telegramApiUrl, {
      chat_id: chatId,
      text: telegramMessage,
      parse_mode: "HTML",
    })
  } catch (error) {
    console.error("Error sending Telegram notification:", error)
  }
}

export async function markNotificationAsRead(notificationId: string) {
  const { error } = await supabase.from("notifications").update({ read: true }).eq("id", notificationId)

  if (error) {
    console.error("Error marking notification as read:", error)
  }
}

export async function getUnreadNotifications(userId: string) {
  const { data, error } = await supabase
    .from("notifications")
    .select("*")
    .eq("user_id", userId)
    .eq("read", false)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching unread notifications:", error)
    return []
  }

  return data
}

