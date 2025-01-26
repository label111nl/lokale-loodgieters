import * as React from "react"
import { ReactRuntime } from "@makeswift/runtime/react"
import { Card } from "@/components/ui/card"
import {
  Droplet,
  Wrench,
  Flame,
  Bath,
  Home,
  PlugIcon as PipeValve,
  ShowerHeadIcon as Shower,
  WashingMachine,
  Sprout,
  Shield,
} from "lucide-react"
import Link from "next/link"

// Makeswift imports
import { List, Shape, TextInput, Style } from "@makeswift/runtime/controls"

interface Service {
  iconName: string
  title: string
  href: string
}

const defaultServices: Service[] = [
  { iconName: "Droplet", title: "Lekkage", href: "/diensten/lekkage" },
  { iconName: "Wrench", title: "Ontstopping", href: "/diensten/ontstopping" },
  { iconName: "Flame", title: "CV ketel", href: "/diensten/cv-ketel" },
  { iconName: "Bath", title: "Sanitair", href: "/diensten/sanitair" },
  { iconName: "Home", title: "Riolering", href: "/diensten/riolering" },
  { iconName: "PipeValve", title: "Waterleiding", href: "/diensten/waterleiding" },
  { iconName: "Shower", title: "Badkamer", href: "/diensten/badkamer" },
  { iconName: "WashingMachine", title: "Wasmachine", href: "/diensten/wasmachine" },
  { iconName: "Sprout", title: "Dakgoten", href: "/diensten/dakgoten" },
  { iconName: "Shield", title: "Preventief", href: "/diensten/preventief" },
]

const getIcon = (iconName: string) => {
  switch (iconName) {
    case "Droplet":
      return <Droplet className="h-8 w-8" />
    case "Wrench":
      return <Wrench className="h-8 w-8" />
    case "Flame":
      return <Flame className="h-8 w-8" />
    case "Bath":
      return <Bath className="h-8 w-8" />
    case "Home":
      return <Home className="h-8 w-8" />
    case "PipeValve":
      return <PipeValve className="h-8 w-8" />
    case "Shower":
      return <Shower className="h-8 w-8" />
    case "WashingMachine":
      return <WashingMachine className="h-8 w-8" />
    case "Sprout":
      return <Sprout className="h-8 w-8" />
    case "Shield":
      return <Shield className="h-8 w-8" />
    default:
      return <Droplet className="h-8 w-8" />
  }
}

export function ServicesGrid({ services = defaultServices, className }: { services?: Service[]; className?: string }) {
  return (
    <section className={`py-16 bg-gray-50 ${className}`}>
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-4">Loodgietersdiensten die wij aanbieden</h2>
        <p className="text-lg text-center text-gray-600 mb-12">
          Onze ervaren loodgieters staan klaar voor al uw loodgieterswerk
        </p>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {services.map((service, index) => (
            <Link key={index} href={service.href}>
              <Card className="flex flex-col items-center p-6 hover:shadow-lg transition-shadow">
                <div className="text-primary mb-4">{getIcon(service.iconName)}</div>
                <h3 className="text-center font-medium">{service.title}</h3>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

// Register with Makeswift
ReactRuntime.registerComponent(ServicesGrid, {
  type: "services-grid",
  label: "Services Grid",
  props: {
    services: List({
      label: "Services",
      type: Shape({
        title: TextInput({ label: "Title" }),
        href: TextInput({ label: "Link" }),
        iconName: TextInput({ label: "Icon", defaultValue: "Droplet" }),
      }),
    }),
    className: Style({ properties: [Style.Margin, Style.Padding] }),
  },
})

