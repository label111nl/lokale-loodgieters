import { CheckCircle } from "lucide-react"

export default function PlumberInfo() {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-4">Hoe het werkt</h2>
      <ul className="space-y-4">
        <li className="flex items-start">
          <CheckCircle className="h-6 w-6 text-green-500 mr-2 flex-shrink-0" />
          <span>Registreer je gratis en maak een profiel aan</span>
        </li>
        <li className="flex items-start">
          <CheckCircle className="h-6 w-6 text-green-500 mr-2 flex-shrink-0" />
          <span>Ontvang opdrachten van klanten in jouw regio</span>
        </li>
        <li className="flex items-start">
          <CheckCircle className="h-6 w-6 text-green-500 mr-2 flex-shrink-0" />
          <span>Reageer snel op aanvragen en win klanten</span>
        </li>
        <li className="flex items-start">
          <CheckCircle className="h-6 w-6 text-green-500 mr-2 flex-shrink-0" />
          <span>Bouw een sterke online reputatie op</span>
        </li>
      </ul>
      <div className="mt-6">
        <h3 className="text-xl font-semibold mb-2">Abonnementsopties</h3>
        <ul className="list-disc list-inside space-y-2">
          <li>Gratis abonnement: €0/maand, €35 per lead</li>
          <li>Premium abonnement: €150/maand, onbeperkt aantal leads</li>
        </ul>
      </div>
    </div>
  )
}

