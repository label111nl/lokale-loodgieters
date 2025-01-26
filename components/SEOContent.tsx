import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Droplet, Wrench, Flame, Bath, Home, PlugIcon as PipeValve, CloudyIcon as Gutter, Hammer } from "lucide-react"

interface SEOContentProps {
  location: string
}

const services = [
  {
    title: "Lekkages Opsporen en Repareren",
    icon: Droplet,
    description: "Snelle detectie en reparatie van lekkages met geavanceerde technieken.",
  },
  {
    title: "Verstoppingen Verhelpen",
    icon: Wrench,
    description: "Efficiënte oplossingen voor verstopte afvoeren en rioleringen.",
  },
  {
    title: "Cv-ketel Onderhoud, Reparatie en Installatie",
    icon: Flame,
    description: "Optimaliseer je verwarmingssysteem voor comfort en efficiëntie.",
  },
  {
    title: "Waterleidingen Aanleggen en Vervangen",
    icon: PipeValve,
    description: "Professionele installatie en vervanging van waterleidingen.",
  },
  {
    title: "Riolering Onderhoud en Reparatie",
    icon: Home,
    description: "Complete rioleringsservice van inspectie tot reparatie.",
  },
  {
    title: "Dakgoten Onderhouden en Repareren",
    icon: Gutter,
    description: "Bescherm je woning tegen waterschade met goed onderhouden dakgoten.",
  },
  {
    title: "Sanitair Installeren en Repareren",
    icon: Bath,
    description: "Alles voor een perfect functionerende badkamer.",
  },
  {
    title: "Algemene Loodgietersdiensten",
    icon: Hammer,
    description: "Professionele oplossingen voor al je loodgietersbehoeften.",
  },
]

export default function SEOContent({ location }: SEOContentProps) {
  return (
    <div className="space-y-8">
      <div className="prose max-w-none">
        <h1 className="text-3xl font-bold mb-4">
          Loodgietersdiensten in {location}: Deskundige Hulp voor Al Jouw Water- en Verwarmingsproblemen
        </h1>
        <p>
          Ben je op zoek naar professionele loodgietersdiensten in {location}? Wij bieden een breed scala aan
          hoogwaardige oplossingen voor alles wat met water, verwarmingssystemen en sanitair te maken heeft. Of je nu
          last hebt van een lekkage, een verstopping, of gewoon een upgrade van je badkamer wilt, onze ervaren
          loodgieters staan voor je klaar. Met moderne technieken, uitgebreide ervaring en een klantgerichte aanpak
          bieden wij altijd een oplossing op maat.
        </p>
        <p>Lees hieronder meer over onze diensten en ontdek hoe wij je kunnen helpen in {location}.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {services.map((service, index) => (
          <Card key={index} className="flex flex-col">
            <CardHeader>
              <CardTitle className="flex items-center text-lg">
                <service.icon className="w-5 h-5 mr-2" />
                {service.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-grow">
              <p>{service.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="prose max-w-none">
        <h2 className="text-2xl font-semibold mt-8 mb-4">Waarom Kiezen voor Onze Loodgieters in {location}?</h2>
        <ul>
          <li>24/7 beschikbaarheid voor noodgevallen</li>
          <li>Ervaren en gecertificeerde professionals</li>
          <li>Transparante prijzen zonder verborgen kosten</li>
          <li>Gebruik van de nieuwste technieken en apparatuur</li>
          <li>Klanttevredenheid als onze hoogste prioriteit</li>
        </ul>
        <p>
          Of je nu een kleine reparatie nodig hebt of een groot project wilt starten, onze loodgieters in {location}{" "}
          staan klaar om je te helpen. Neem vandaag nog contact met ons op voor een vrijblijvende offerte of voor meer
          informatie over onze diensten.
        </p>
      </div>
    </div>
  )
}

