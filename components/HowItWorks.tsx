export default function HowItWorks() {
  return (
    <div className="mb-12">
      <h2 className="text-2xl font-bold mb-8 text-center">Hoe het werkt</h2>
      <div className="grid md:grid-cols-3 gap-8">
        <div className="text-center">
          <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
            1
          </div>
          <h3 className="font-semibold mb-2">Vul het formulier in</h3>
          <p className="text-gray-600 text-sm">Beschrijf uw klus en wensen in het aanvraagformulier</p>
        </div>
        <div className="text-center">
          <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
            2
          </div>
          <h3 className="font-semibold mb-2">Ontvang offertes</h3>
          <p className="text-gray-600 text-sm">Binnen 24 uur ontvangt u meerdere passende offertes</p>
        </div>
        <div className="text-center">
          <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
            3
          </div>
          <h3 className="font-semibold mb-2">Maak uw keuze</h3>
          <p className="text-gray-600 text-sm">Vergelijk de offertes en kies de beste loodgieter</p>
        </div>
      </div>
    </div>
  )
}

