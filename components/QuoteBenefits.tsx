import { CheckCircle } from "lucide-react"

export default function QuoteBenefits() {
  const benefits = [
    "Gratis en vrijblijvend vergelijken",
    "Alleen gekwalificeerde loodgieters",
    "Persoonlijke ondersteuning",
    "Beste prijs-kwaliteit verhouding",
    "Snelle responstijd",
    "Transparant proces",
  ]

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold mb-4">Waarom Lokale Loodgieters?</h3>
      <ul className="space-y-3">
        {benefits.map((benefit, index) => (
          <li key={index} className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
            <span className="text-gray-700">{benefit}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

