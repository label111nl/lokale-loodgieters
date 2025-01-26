import { Clock, CheckCircle, Users, Shield } from "lucide-react"

export default function QuoteHero() {
  return (
    <div className="bg-white py-12 border-b">
      <div className="container mx-auto px-4 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          Vind de <span className="text-blue-600">perfecte loodgieter</span> voor uw klus
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Ontvang binnen 24 uur meerdere offertes van gekwalificeerde loodgieters
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
          <div className="flex items-center justify-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-500" />
            <span className="text-sm">Gratis en vrijblijvend</span>
          </div>
          <div className="flex items-center justify-center gap-2">
            <Clock className="h-5 w-5 text-blue-500" />
            <span className="text-sm">Binnen 24 uur reactie</span>
          </div>
          <div className="flex items-center justify-center gap-2">
            <Users className="h-5 w-5 text-purple-500" />
            <span className="text-sm">Meerdere offertes</span>
          </div>
          <div className="flex items-center justify-center gap-2">
            <Shield className="h-5 w-5 text-orange-500" />
            <span className="text-sm">Betrouwbare partners</span>
          </div>
        </div>
      </div>
    </div>
  )
}

