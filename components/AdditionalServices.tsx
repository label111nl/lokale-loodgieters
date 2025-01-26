import { Wrench, Droplet, Clock, PenToolIcon as Tool, ThermometerSun, AlertTriangle } from "lucide-react"

export default function AdditionalServices() {
  const services = [
    { icon: Wrench, name: "Loodgieterswerk" },
    { icon: Droplet, name: "Lekkages" },
    { icon: Clock, name: "Spoeddienst" },
    { icon: Tool, name: "Ontstopping" },
    { icon: ThermometerSun, name: "CV Onderhoud" },
    { icon: AlertTriangle, name: "Calamiteiten" },
  ]

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold mb-4">Onze Diensten</h3>
      <div className="space-y-3">
        {services.map((service, index) => {
          const Icon = service.icon
          return (
            <div key={index} className="flex items-center gap-2 text-gray-700">
              <Icon className="h-5 w-5 text-blue-600" />
              <span>{service.name}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

