import { SEO } from "@/components/SEO"

export default function QuoteConfirmationPage() {
  return (
    <>
      <SEO
        title="Offerte Aanvraag Bevestiging | Lokale Loodgieters"
        description="Uw offerte aanvraag is succesvol ontvangen. U ontvangt binnen 72 uur 3 tot 5 offertes."
      />
      <div className="container mx-auto py-16 px-4 text-center">
        <h1 className="text-3xl font-bold mb-6">Bedankt voor uw offerte aanvraag!</h1>
        <p className="text-xl mb-8">
          Uw aanvraag is succesvol ontvangen. Binnen 72 uur ontvangt u gegarandeerd 3 tot 5 offertes van gekwalificeerde
          loodgieters in uw omgeving.
        </p>
        <p className="text-lg">
          We hebben een bevestigingsmail gestuurd naar het door u opgegeven e-mailadres. Controleer ook uw spam-folder
          als u de e-mail niet ziet.
        </p>
      </div>
    </>
  )
}

