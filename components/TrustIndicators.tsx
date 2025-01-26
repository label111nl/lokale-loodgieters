import { ReactRuntime } from "@makeswift/runtime/react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Shield, Tag, MapPin } from "lucide-react"
import Link from "next/link"

// Makeswift imports
import { List, Shape, TextInput, Style } from "@makeswift/runtime/controls"

interface TrustIndicator {
  iconName: string
  title: string
  description: string
}

const defaultIndicators: TrustIndicator[] = [
  {
    iconName: "Shield",
    title: "Gegarandeerd",
    description: "Al onze werkzaamheden worden uitgevoerd met garantie",
  },
  {
    iconName: "Tag",
    title: "Vaste prijzen",
    description: "Duidelijke prijsafspraken, geen verrassingen achteraf",
  },
  {
    iconName: "MapPin",
    title: "Lokale loodgieters",
    description: "Altijd een vakkundige loodgieter bij u in de buurt",
  },
]

export function TrustIndicators({
  indicators = defaultIndicators,
  buttonText = "Vraag direct een offerte aan",
  buttonLink = "/offerte-aanvragen",
  className,
}: { indicators?: TrustIndicator[]; buttonText?: string; buttonLink?: string; className?: string }) {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case "Shield":
        return <Shield className="h-12 w-12 text-primary" />
      case "Tag":
        return <Tag className="h-12 w-12 text-primary" />
      case "MapPin":
        return <MapPin className="h-12 w-12 text-primary" />
      default:
        return <Shield className="h-12 w-12 text-primary" />
    }
  }

  return (
    <section className={`py-16 bg-white ${className}`}>
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Waarom voor ons kiezen?</h2>
          <p className="text-lg text-gray-600">Wij staan garant voor kwaliteit en betrouwbaarheid in heel Nederland</p>
        </div>
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {indicators.map((indicator, index) => (
            <Card key={index} className="text-center">
              <CardHeader>
                <div className="flex justify-center mb-4">{getIcon(indicator.iconName)}</div>
                <CardTitle>{indicator.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">{indicator.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="text-center">
          <Button size="lg" asChild>
            <Link href={buttonLink}>{buttonText}</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}

// Register with Makeswift
ReactRuntime.registerComponent(TrustIndicators, {
  type: "trust-indicators",
  label: "Trust Indicators",
  props: {
    indicators: List({
      label: "Indicators",
      type: Shape({
        title: TextInput({ label: "Title" }),
        description: TextInput({ label: "Description", multiline: true }),
        iconName: TextInput({ label: "Icon Name", defaultValue: "Shield" }),
      }),
    }),
    buttonText: TextInput({ label: "Button Text" }),
    buttonLink: TextInput({ label: "Button Link" }),
    className: Style({ properties: [Style.Margin, Style.Padding] }),
  },
})

