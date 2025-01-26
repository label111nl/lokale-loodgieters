import { Clock, Thermometer, Droplets } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"

export default function CommonProblems() {
  const problems = [
    {
      icon: Clock,
      title: "Te lang wachten op warm water",
      description: "Als u moet wachten op warm water, kunnen wij u helpen dit op te lossen.",
    },
    {
      icon: Thermometer,
      title: "Koude plekken op de radiator",
      description: "Heeft uw radiator koude plekken? Wij kunnen deze snel en effectief verhelpen.",
    },
    {
      icon: Droplets,
      title: "Kalkaanslag in leidingen",
      description: "Last van kalkaanslag? Onze experts kunnen uw leidingen grondig reinigen.",
    },
  ]

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-4">
          Heeft u een van deze problemen? Onze loodgieters kunnen helpen.
        </h2>

        <div className="grid md:grid-cols-3 gap-8 mt-12">
          {problems.map((problem, index) => (
            <Card key={index}>
              <CardHeader>
                <problem.icon className="h-8 w-8 text-blue-600 mb-4" />
                <CardTitle>{problem.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">{problem.description}</p>
                <Link href="#" className="text-blue-600 hover:underline">
                  Ontdek meer
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}

