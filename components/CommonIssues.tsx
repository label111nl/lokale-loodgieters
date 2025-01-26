import { ReactRuntime } from "@makeswift/runtime/react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Clock, Thermometer, Droplets } from "lucide-react"

// Makeswift imports
import { List, Shape, TextInput, Style } from "@makeswift/runtime/controls"

interface Issue {
  iconName: string
  title: string
  description: string
}

const defaultIssues: Issue[] = [
  {
    iconName: "Clock",
    title: "Wachten te lang op warm water?",
    description:
      "Als u moet wachten op warm water, kunnen wij u helpen dit op te lossen. Onze loodgieters komen snel bij u langs.",
  },
  {
    iconName: "Thermometer",
    title: "Koude plekken op de radiator?",
    description:
      "Heeft uw radiator koude plekken? Dit kan duiden op lucht in het systeem. Wij kunnen deze snel en effectief verhelpen.",
  },
  {
    iconName: "Droplets",
    title: "Last van kalkaanslag?",
    description:
      "Kalkaanslag in uw leidingen kan voor veel problemen zorgen. Onze experts kunnen uw leidingen grondig reinigen.",
  },
]

export function CommonIssues({ issues = defaultIssues, className }: { issues?: Issue[]; className?: string }) {
  return (
    <section className={`py-16 bg-white ${className}`}>
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-4">Heeft u een van deze problemen?</h2>
        <p className="text-lg text-center text-gray-600 mb-12">Onze loodgieters kunnen direct helpen</p>
        <div className="grid md:grid-cols-3 gap-8">
          {issues.map((issue, index) => {
            const Icon = {
              Clock,
              Thermometer,
              Droplets,
            }[issue.iconName]
            return (
              <Card key={index} className="text-center">
                <CardHeader>
                  <div className="flex justify-center mb-4">
                    <Icon className="h-12 w-12 text-primary" />
                  </div>
                  <CardTitle>{issue.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-6">{issue.description}</p>
                  <Button variant="outline" className="w-full">
                    Direct contact opnemen
                  </Button>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </section>
  )
}

// Register with Makeswift
ReactRuntime.registerComponent(CommonIssues, {
  type: "common-issues",
  label: "Common Issues",
  props: {
    issues: List({
      label: "Issues",
      type: Shape({
        title: TextInput({ label: "Title" }),
        description: TextInput({ label: "Description", multiline: true }),
        iconName: TextInput({ label: "Icon Name", defaultValue: "Clock" }),
      }),
    }),
    className: Style({ properties: [Style.Margin, Style.Padding] }),
  },
})

