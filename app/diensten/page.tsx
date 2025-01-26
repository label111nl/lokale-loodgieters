import TopBanner from "@/components/TopBanner"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Wrench, Droplet, Thermometer, ShowerHead, PenToolIcon as Tool, PinOffIcon as PipeOff } from "lucide-react"

export default function ServicesPage() {
  const services = [
    {
      icon: Wrench,
      title: "Lekkage Reparatie",
      description: "Snelle en effectieve reparatie van alle soorten lekkages",
    },
    {
      icon: Droplet,
      title: "Ontstopping",
      description: "Professionele ontstopping van toiletten, douches en leidingen",
    },
    {
      icon: Thermometer,
      title: "CV Ketel Service",
      description: "Onderhoud, reparatie en installatie van CV ketels",
    },
    {
      icon: ShowerHead,
      title: "Sanitair",
      description: "Installatie en reparatie van toiletten, douches en kranen",
    },
    {
      icon: Tool,
      title: "Renovatie",
      description: "Complete badkamer en keuken renovaties",
    },
    {
      icon: PipeOff,
      title: "Riool Service",
      description: "24/7 riool ontstopping en camera-inspectie",
    },
  ]

  return (
    <div className="min-h-screen flex flex-col">
      <TopBanner />
      <Header />
      <main className="flex-1">
        <div className="container mx-auto px-4 py-16">
          <h1 className="text-4xl font-bold mb-12 text-center">Onze Diensten</h1>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <Card key={index}>
                <CardHeader>
                  <service.icon className="h-8 w-8 text-primary mb-4" />
                  <CardTitle>{service.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">{service.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

