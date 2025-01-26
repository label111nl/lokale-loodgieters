import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY)

export async function sendConfirmationEmail(email: string, name: string) {
  try {
    await resend.emails.send({
      from: "Lokale Loodgieters <noreply@lokaleloodgieters.nl>",
      to: email,
      subject: "Bevestiging van uw offerte aanvraag",
      html: `
        <h1>Bedankt voor uw offerte aanvraag, ${name}!</h1>
        <p>We hebben uw aanvraag succesvol ontvangen. Binnen 72 uur ontvangt u gegarandeerd 3 tot 5 offertes van gekwalificeerde loodgieters in uw omgeving.</p>
        <p>Als u vragen heeft, aarzel dan niet om contact met ons op te nemen.</p>
        <p>Met vriendelijke groet,<br>Het team van Lokale Loodgieters</p>
      `,
    })
  } catch (error) {
    console.error("Error sending email:", error)
  }
}

