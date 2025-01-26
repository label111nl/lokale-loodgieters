import Header from "@/components/Header"
import Footer from "@/components/Footer"
import FAQ from "@/components/FAQ"

export default function FAQPage() {
  const faqs = [
    {
      question: "Wat doet Lokale Loodgieters?",
      answer:
        "Lokale Loodgieters is een online platform dat klanten verbindt met ervaren loodgieters in hun regio. Via ons systeem kunt u eenvoudig een loodgietersklus plaatsen, zoals het repareren van lekkages, het ontstoppen van afvoeren, of een complete badkamerrenovatie. Lokale loodgieters reageren op uw aanvraag met een offerte, waarna u degene kiest die het beste bij uw wensen past. Ons platform zorgt voor een snelle, transparante en betrouwbare manier om de juiste vakman te vinden. We bemoeien ons niet met de communicatie of betalingen, zodat u alles rechtstreeks met de loodgieter kunt regelen.",
    },
    {
      question: "Hoe vind ik een loodgieter via Lokale Loodgieters?",
      answer:
        "Het proces is eenvoudig: plaats uw klus via ons offerteformulier en beschrijf wat er nodig is, zoals een reparatie of installatie. Voeg indien nodig foto's toe om het probleem te verduidelijken. Loodgieters in uw regio bekijken uw aanvraag en sturen een offerte. U kunt deze offertes vergelijken op basis van prijs, ervaring en reviews. Zodra u een keuze heeft gemaakt, neemt de loodgieter contact met u op om verdere details af te stemmen. Het hele proces is ontworpen om snel, gebruiksvriendelijk en transparant te zijn.",
    },
    {
      question: "Wat voor klussen kunnen loodgieters op het platform uitvoeren?",
      answer:
        "Onze aangesloten loodgieters bieden een breed scala aan diensten aan, variërend van kleine reparaties tot grote renovaties. Denk aan het oplossen van lekkages, ontstoppen van afvoeren, installatie van sanitair, en onderhoud van verwarmingssystemen. Ook complexe projecten, zoals badkamerrenovaties en het aanleggen van waterleidingen, behoren tot de mogelijkheden. Of u nu een spoedklus heeft of een langetermijnproject, onze loodgieters staan klaar om u te helpen. Via het offerteformulier kunt u uw specifieke wensen aangeven, waarna u offertes ontvangt van loodgieters die gespecialiseerd zijn in uw type klus.",
    },
    {
      question: "Hoe kies ik de juiste loodgieter?",
      answer:
        "Bij het kiezen van een loodgieter via ons platform kunt u vertrouwen op reviews en beoordelingen van eerdere klanten. Nadat u een offerteaanvraag heeft geplaatst, ontvangt u reacties van verschillende loodgieters. Bekijk hun profiel om meer te weten te komen over hun ervaring, specialisaties en tarieven. U kunt ook hun recensies lezen om een beter beeld te krijgen van hun service. Kies een loodgieter die past bij uw budget, maar let ook op kwaliteit en betrouwbaarheid. Transparantie en keuzevrijheid staan bij ons platform centraal, zodat u altijd een goede beslissing kunt nemen.",
    },
    {
      question: "Hoe lang duurt het voordat ik een reactie ontvang?",
      answer:
        "Loodgieters reageren meestal binnen enkele uren tot maximaal 24 uur nadat u een aanvraag heeft geplaatst. Onze aangesloten professionals begrijpen hoe belangrijk het is om snel te handelen, vooral bij spoedgevallen zoals lekkages of verstoppingen. Zodra uw aanvraag is ingediend, wordt deze direct zichtbaar voor loodgieters in uw regio. U ontvangt notificaties zodra een loodgieter heeft gereageerd. Heeft u een dringende klus? Geef dit dan aan bij uw aanvraag, zodat loodgieters weten dat prioriteit gewenst is. Dankzij ons netwerk van lokale specialisten is snelle hulp vrijwel altijd gegarandeerd.",
    },
    {
      question: "Wat kost het om een loodgieter in te schakelen via Lokale Loodgieters?",
      answer:
        "Het gebruik van ons platform is gratis voor klanten. De kosten voor een loodgieter hangen af van de aard van de klus en de offerte die u accepteert. Loodgieters bepalen hun eigen tarieven, gebaseerd op factoren zoals de tijdsduur, benodigde materialen, en eventuele voorrijkosten. Bij het ontvangen van offertes kunt u de prijzen vergelijken en een weloverwogen keuze maken. Ons platform bemoeit zich niet met de betaling; u regelt dit rechtstreeks met de loodgieter. Dit garandeert volledige transparantie en voorkomt verborgen kosten.",
    },
  ]

  return (
    <>
      <Header />
      <main className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold mb-4">Veelgestelde Vragen</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Hier vindt u antwoorden op de meest gestelde vragen over Lokale Loodgieters. Staat uw vraag er niet tussen?
            Neem dan gerust contact met ons op.
          </p>
        </div>
        <FAQ faqs={faqs} />
      </main>
      <Footer />
    </>
  )
}

